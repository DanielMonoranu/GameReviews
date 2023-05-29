using AutoMapper;
using GameReviews.API.DTOs;
using GameReviews.API.Entities;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace GameReviews.API.Controllers
{

    [Route("[controller]")]
    [ApiController]
    public class ReviewsController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;
        public ReviewsController(ApplicationDbContext context, IMapper mapper, UserManager<ApplicationUser> userManager)
        {
            _userManager = userManager;
            _context = context;
            _mapper = mapper;
        }

        [HttpGet("{id:int}")]
        public async Task<ActionResult<ReviewDTO>> Get(int id)
        {

            var reviews = await GetParentReviews(null, id);
            if (reviews != null)
            {
                return Ok(reviews);
            }
            return BadRequest();
        }

        [HttpPost]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public async Task<ActionResult> Post([FromBody] ReviewCreationDTO reviewCreationDTO)
        {
            var email = HttpContext.User.Claims.FirstOrDefault(x => x.Type == "email").Value;
            var user = await _userManager.FindByNameAsync(email);
            var review = _mapper.Map<Review>(reviewCreationDTO);
            review.UserId = user.Id;
            _context.Add(review);
            await _context.SaveChangesAsync();
            return Ok(review);
        }

        [HttpPut("{id:int}")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public async Task<ActionResult> Put(int id, [FromBody] ReviewCreationDTO reviewCreationDTO)
        {
            var review = await _context.Reviews.FirstOrDefaultAsync(x => x.Id == id);
            if (review == null) return NotFound();
            review = _mapper.Map(reviewCreationDTO, review);
            await _context.SaveChangesAsync();
            return Ok(review);
        }

        [HttpDelete("{id:int}")]
        public async Task<ActionResult> Delete(int id)
        {
            await DeleteListOfReviews(id);
            return Ok();
        }


        private async Task<ActionResult> DeleteListOfReviews(int id)
        {
            var reviewToDelete = await _context.Reviews.FirstOrDefaultAsync(x => x.Id == id);
            if (reviewToDelete != null)
            {
                var childrenReviews = await _context.Reviews.Where(r => r.ParentReviewId == id).ToListAsync();
                if (childrenReviews.Count != 0)
                {
                    foreach (var childReview in childrenReviews)
                    {
                        await DeleteListOfReviews(childReview.Id);
                    }
                    _context.Remove(reviewToDelete);
                    await _context.SaveChangesAsync();
                }
                else
                {
                    _context.Remove(reviewToDelete);
                    await _context.SaveChangesAsync();
                }
            }
            return Ok();
        }

        private async Task<List<ReviewDTO>> GetParentReviews(int? parentReviewId, int id)
        {
            var reviews = await _context.Reviews
                .Include(r => r.User)
                .Where(r => r.ParentReviewId == parentReviewId && r.GameId == id)
                .ToListAsync();
            var reviewsDto = _mapper.Map<List<ReviewDTO>>(reviews);

            foreach (var reviewDTo in reviewsDto)
            {
                reviewDTo.ChildReviews = await GetParentReviews(reviewDTo.Id, id);
            }
            return reviewsDto;
        }



    }
}