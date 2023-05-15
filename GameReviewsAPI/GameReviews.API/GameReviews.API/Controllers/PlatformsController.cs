using AutoMapper;
using GameReviews.API.DTOs;
using GameReviews.API.Entities;
using GameReviews.API.Helpers;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace GameReviews.API.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class PlatformsController : ControllerBase
    {
        private readonly ILogger<PlatformsController> _logger;
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;
        public PlatformsController(ILogger<PlatformsController> logger, ApplicationDbContext context, IMapper mapper)
        {
            _logger = logger;
            _context = context;
            _mapper = mapper;
        }
        [HttpGet]
        public async Task<ActionResult<List<PlatformDTO>>> Get([FromQuery] PaginationDTO paginationDTO)
        {
            _logger.LogInformation("Getting all the platforms"); //nu stiu daca sa mai pun

            var queryable = _context.Platforms.AsQueryable();
            await HttpContext.InsertParametersPaginationInHeader(queryable);

            var platforms = await queryable.OrderBy(u => u.Name).Paginate(paginationDTO).ToListAsync();
            var platformsdto = _mapper.Map<List<PlatformDTO>>(platforms);
            return Ok(platformsdto);
        }
        [HttpGet("all")]
        public async Task<ActionResult<List<PlatformDTO>>> Get()
        {
            var platforms = await _context.Platforms.OrderBy(u => u.Name).ToListAsync();
            var platformsdto = _mapper.Map<List<PlatformDTO>>(platforms);
            return Ok(platformsdto);
        }

        [HttpGet("{id:int}")]
        public async Task<ActionResult<PlatformDTO>> Get(int id)
        {
            var platform = await _context.Platforms.FirstOrDefaultAsync(x => x.Id == id);
            if (platform == null) return NotFound();
            return Ok(_mapper.Map<PlatformDTO>(platform));
        }

        [HttpPost]
        public async Task<ActionResult> Post([FromBody] PlatformCreationDTO platformCreationDTO)
        {
            var platform = _mapper.Map<Platform>(platformCreationDTO);
            _context.Add(platform);
            await _context.SaveChangesAsync();
            return Ok(platform);
        }

        [HttpPut("{id:int}")]
        public async Task<ActionResult> Put(int id, [FromBody] PlatformCreationDTO platformCreationDTO)
        {
            var platform = await _context.Platforms.FirstOrDefaultAsync(x => x.Id == id);
            if (platform == null) return NotFound();
            platform = _mapper.Map(platformCreationDTO, platform);
            await _context.SaveChangesAsync();
            return Ok(platform);
        }


        [HttpDelete("{id:int}")]
        public async Task<ActionResult> Delete(int id)
        {
            var platform = await _context.Platforms.AnyAsync(x => x.Id == id);
            if (!platform) return NotFound();
            _context.Remove(new Platform() { Id = id });
            await _context.SaveChangesAsync();
            return Ok();
        }
    }
}
