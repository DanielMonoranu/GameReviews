using Microsoft.AspNetCore.Mvc;

namespace GameReviews.API.Services
{
    public interface IReviewsService
    {
        Task DeleteListOfReview(int id);

    }
}
