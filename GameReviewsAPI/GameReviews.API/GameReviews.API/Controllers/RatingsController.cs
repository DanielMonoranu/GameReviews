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
        public async Task<ActionResult> Post([FromBody] RatingCreationDTO ratingCreationDTO)
        {
            var email = HttpContext.User.Claims.FirstOrDefault(x => x.Type == "email").Value;
            var user = await _userManager.FindByNameAsync(email);
            var userId = user.Id;
            var currentScore = await _context.Ratings
                .FirstOrDefaultAsync(x => x.GameId == ratingCreationDTO.GameId &&
                x.UserId == userId);

            if (currentScore == null)
            {
                var ratingDto = _mapper.Map<Rating>(ratingCreationDTO);
                ratingDto.UserId = userId;
                _context.Add(ratingDto);
            }
            else
            {
                currentScore.Score = ratingCreationDTO.Score;
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

        [HttpDelete("{id:int}")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public async Task<ActionResult> Delete(int id)
        {
            var rating = await _context.Ratings.FirstOrDefaultAsync(r => r.Id == id);
            if (rating != null)
            {
                _context.Remove(rating);
                await _context.SaveChangesAsync();
                return Ok();
            }
            return BadRequest();
        }

    }
}
