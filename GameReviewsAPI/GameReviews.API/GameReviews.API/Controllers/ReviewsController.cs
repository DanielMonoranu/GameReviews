﻿using AutoMapper;
using GameReviews.API.DTOs;
using GameReviews.API.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace GameReviews.API.Controllers
{

    [Route("[controller]")]
    [ApiController]
    public class ReviewsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;
        public ReviewsController(ApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        [HttpGet("{id:int}")]
        public async Task<ActionResult<ReviewDTO>> Get(int id)
        {

            var reviews = GetParentReviews(null, id);
            if (reviews != null)
            {
                return Ok(reviews);
            }
            return BadRequest();
        }

        [HttpPost]
        public async Task<ActionResult> Post([FromBody] ReviewCreationDTO reviewCreationDTO)
        {
            var review = _mapper.Map<Review>(reviewCreationDTO);
            _context.Add(review);
            await _context.SaveChangesAsync();
            return Ok(review);
        }

        [HttpPut("{id:int}")]
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
            var isParent = await _context.Reviews.AnyAsync(x => x.ParentReviewId == id);
            if (isParent == true)
            {
                var reviewsToBeDeleted = await _context.Reviews.Where(x => x.ParentReviewId == id).ToListAsync();
                _context.Reviews.RemoveRange(reviewsToBeDeleted);
            }

            _context.Remove(new Review() { Id = id });
            await _context.SaveChangesAsync();
            return Ok();
        }


        List<ReviewDTO> GetParentReviews(int? parentReviewId, int id)
        {
            var reviews = _context.Reviews
                .Where(r => r.ParentReviewId == parentReviewId && r.GameId == id)
                .ToList();
            var reviewsDto = _mapper.Map<List<ReviewDTO>>(reviews);

            foreach (var reviewDTo in reviewsDto)
            {
                reviewDTo.ChildReviews = GetParentReviews(reviewDTo.Id, id);
            }

            return reviewsDto;
        }




    }
}