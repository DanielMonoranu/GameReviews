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
    public class DevelopersController : ControllerBase
    {
        private readonly ILogger<DevelopersController> _logger;
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;
        public DevelopersController(ILogger<DevelopersController> logger, ApplicationDbContext context, IMapper mapper)
        {
            _logger = logger;
            _context = context;
            _mapper = mapper;
        }
        [HttpGet]
        public async Task<ActionResult<List<DeveloperDTO>>> Get([FromQuery] PaginationDTO paginationDTO)
        {
            _logger.LogInformation("Getting all the developers"); //nu stiu daca sa mai pun

            var queryable = _context.Developers.AsQueryable();
            await HttpContext.InsertParametersPaginationInHeader(queryable);

            var developers = await queryable.OrderBy(u => u.Name).Paginate(paginationDTO).ToListAsync();
            var developersdto = _mapper.Map<List<DeveloperDTO>>(developers);
            return Ok(developersdto);
        }
        [HttpGet("all")]
        public async Task<ActionResult<List<DeveloperDTO>>> Get()
        {
            var developers = await _context.Developers.OrderBy(u => u.Name).ToListAsync();
            var developersdto = _mapper.Map<List<DeveloperDTO>>(developers);
            return Ok(developersdto);
        }


        [HttpGet("{id:int}")]
        public async Task<ActionResult<DeveloperDTO>> Get(int id)
        {
            var developer = await _context.Developers.FirstOrDefaultAsync(x => x.Id == id);
            if (developer == null) return NotFound();
            return Ok(_mapper.Map<DeveloperDTO>(developer));
        }

        [HttpPost]
        public async Task<ActionResult> Post([FromBody] DeveloperCreationDTO developerCreationDTO)
        {
            var developer = _mapper.Map<Developer>(developerCreationDTO);
            _context.Add(developer);
            await _context.SaveChangesAsync();
            return Ok(developer);
        }

        [HttpPut("{id:int}")]
        public async Task<ActionResult> Put(int id, [FromBody] DeveloperCreationDTO developerCreationDTO)
        {
            var developer = await _context.Developers.FirstOrDefaultAsync(x => x.Id == id);
            if (developer == null) return NotFound();
            developer = _mapper.Map(developerCreationDTO, developer);
            await _context.SaveChangesAsync();
            return Ok(developer);
        }


        [HttpDelete("{id:int}")]
        public async Task<ActionResult> Delete(int id)
        {
            var developer = await _context.Developers.AnyAsync(x => x.Id == id);
            if (!developer) return NotFound();
            _context.Remove(new Developer() { Id = id });
            await _context.SaveChangesAsync();
            return Ok();
        }
    }
}
