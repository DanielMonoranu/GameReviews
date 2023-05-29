using AutoMapper;
using GameReviews.API.DTOs;
using GameReviews.API.Entities;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace GameReviews.API.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class RatingsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IMapper _mapper;
        public RatingsController(ApplicationDbContext context, UserManager<ApplicationUser> userManager, IMapper mapper)
        {
            _context = context;
            _userManager = userManager;
            _mapper = mapper;
        }

        [HttpPost]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public async Task<ActionResult> Post([FromBody] RatingCreationDTO ratingDTO)
        {
            var email = HttpContext.User.Claims.FirstOrDefault(x => x.Type == "email").Value;
            var user = await _userManager.FindByNameAsync(email);
            var userId = user.Id;
            var currentScore = await _context.Ratings
                .FirstOrDefaultAsync(x => x.GameId == ratingDTO.GameId &&
                x.UserId == userId);
            if (currentScore == null)
            {
                var rating = new Rating()
                {
                    GameId = ratingDTO.GameId,
                    Score = ratingDTO.Score,
                    UserId = userId,
                };
                _context.Add(rating);
            }
            else
            {
                currentScore.Score = ratingDTO.Score;
            }
            await _context.SaveChangesAsync();
            return Ok();
        }


        [HttpGet("{id:int}")]
        public async Task<ActionResult<RatingDTO>> Get(int id)
        {
            var ratings = await _context.Ratings.Include(r => r.User).Where(r => r.GameId == id).ToListAsync();
            var ratingsDto = _mapper.Map<List<RatingDTO>>(ratings);
            if (ratings != null)
            {
                return Ok(ratingsDto);
            }
            return BadRequest();
        }
    }
}
