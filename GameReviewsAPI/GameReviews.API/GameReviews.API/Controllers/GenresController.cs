using AutoMapper;
using GameReviews.API.Helpers;
using GameReviews.API.DTOs;
using GameReviews.API.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace GameReviews.API.Controllers

{
    [Route("[controller]")]
    [ApiController]
    public class GenresController : ControllerBase
    {
        private readonly ILogger<GenresController> _logger;
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;
        public GenresController(ILogger<GenresController> logger, ApplicationDbContext context, IMapper mapper)
        {
            _logger = logger;
            _context = context;
            _mapper = mapper;
        }
        [HttpGet]
        public async Task<ActionResult<List<GenreDTO>>> Get([FromQuery] PaginationDTO paginationDTO)
        {
            _logger.LogInformation("Getting all the genres"); //nu stiu daca sa mai pun

            var queryable = _context.Genres.AsQueryable();
            await HttpContext.InsertParametersPaginationInHeader(queryable);

            var genres = await queryable.OrderBy(u => u.Name).Paginate(paginationDTO).ToListAsync();
            var genresdto = _mapper.Map<List<GenreDTO>>(genres);
            return Ok(genresdto);
        }

        [HttpGet("all")]
        public async Task<ActionResult<List<GenreDTO>>> Get()
        {

            var genres = await _context.Genres.OrderBy(u => u.Name).ToListAsync();
            var genresdto = _mapper.Map<List<GenreDTO>>(genres);
            return Ok(genresdto);
        }


        [HttpGet("{id:int}")]
        public async Task<ActionResult<GenreDTO>> Get(int id)
        {
            var genre = await _context.Genres.FirstOrDefaultAsync(x => x.Id == id);
            if (genre == null) return NotFound();
            return Ok(_mapper.Map<GenreDTO>(genre));
        }

        [HttpPost]
        public async Task<ActionResult> Post([FromBody] GenreCreationDTO genreCreationDTO)
        {
            var genre = _mapper.Map<Genre>(genreCreationDTO);
            _context.Add(genre);
            await _context.SaveChangesAsync();
            return Ok(genre);
        }

        [HttpPut("{id:int}")]
        public async Task<ActionResult> Put(int id, [FromBody] GenreCreationDTO genreCreationDTO)
        {
            var genre = await _context.Genres.FirstOrDefaultAsync(x => x.Id == id);
            if (genre == null) return NotFound();
            genre = _mapper.Map(genreCreationDTO, genre);
            await _context.SaveChangesAsync();
            return Ok(genre);
        }


        [HttpDelete("{id:int}")]
        public async Task<ActionResult> Delete(int id)
        {
            var genre = await _context.Genres.AnyAsync(x => x.Id == id);
            if (!genre) return NotFound();
            _context.Remove(new Genre() { Id = id });
            await _context.SaveChangesAsync();
            return Ok();
        }
    }
}
