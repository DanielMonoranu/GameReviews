using AutoMapper;
using GameReviews.API.DTOs;
using GameReviews.API.DTOs.IntermediateDTOs;
using GameReviews.API.Entities;
using GameReviews.API.Helpers;
using GameReviews.API.Services;
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
        private readonly IReviewsService _reviewsService;
        public ReviewsController(ApplicationDbContext context, IMapper mapper, UserManager<ApplicationUser> userManager, IReviewsService reviewsService)
        {
            _userManager = userManager;
            _context = context;
            _mapper = mapper;
            _reviewsService = reviewsService;
        }

        [HttpGet("{id:int}")]
        public async Task<ActionResult<ReviewDTO>> Get(int id, [FromQuery] PaginationDTO paginationDTO)
        {
            var allReviews = await GetParentReviews(null, id);
            var queryable = allReviews.AsQueryable();
            await HttpContext.InsertParametersPaginationInHeader(queryable);
            var reviews = queryable.Paginate(paginationDTO).ToList();
            if (reviews != null)
            {
                return Ok(reviews);
            }
            return BadRequest();
        }


        [HttpGet("User/{id:int}")]
        public async Task<ActionResult<ReviewDTO>> GetUserReviews(int id, [FromQuery] PaginationDTO paginationDTO)
        {
            var allReviews = await GetParentReviews(null, id);
            var userReviews = allReviews.Where(r => r.User.Type == "User").AsQueryable();
            await HttpContext.InsertParametersPaginationInHeader(userReviews);
            var reviews = userReviews.Paginate(paginationDTO).ToList();
            if (reviews != null)
            {
                return Ok(reviews);
            }
            return BadRequest();
        }


        [HttpGet("Critic/{id:int}")]
        public async Task<ActionResult<ReviewDTO>> GetCriticReviews(int id, [FromQuery] PaginationDTO paginationDTO)
        {
            var allReviews = await GetParentReviews(null, id);
            var userReviews = allReviews.Where(r => r.User.Type == "Critic").AsQueryable();
            await HttpContext.InsertParametersPaginationInHeader(userReviews);
            var reviews = userReviews.Paginate(paginationDTO).ToList();
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
            await _reviewsService.DeleteListOfReview(id);
            return Ok();
        }

        /*
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
                }*/

        /*        private List<ReviewDTO> GetParentReviews(int? parentReviewId, int id)
                {
                    var reviews = _context.Reviews
                        .Include(r => r.User)
                        .Where(r => r.ParentReviewId == parentReviewId && r.GameId == id)
                        .AsQueryable();
                    var reviewsDto = _mapper.Map<List<ReviewDTO>>(reviews);

                    foreach (var reviewDTo in reviewsDto)
                    {
                        reviewDTo.ChildReviews = GetParentReviews(reviewDTo.Id, id);
                    }
                    return reviewsDto;
                }*/

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