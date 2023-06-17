
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace GameReviews.API.Services
{
    public class ReviewsService : IReviewsService
    {
        private readonly ApplicationDbContext _context;
        public ReviewsService(ApplicationDbContext context)
        {
            _context = context;
            _context = context;
        }

        public async Task DeleteListOfReview(int id)
        {
            var reviewToDelete = await _context.Reviews.FirstOrDefaultAsync(x => x.Id == id);
            if (reviewToDelete != null)
            {
                var childrenReviews = await _context.Reviews.Where(r => r.ParentReviewId == id).ToListAsync();
                if (childrenReviews.Count != 0)
                {
                    foreach (var childReview in childrenReviews)
                    {
                        await DeleteListOfReview(childReview.Id);
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
        }

    }
}
