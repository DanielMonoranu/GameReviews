using System.ComponentModel.DataAnnotations;

namespace GameReviews.API.DTOs
{
    public class RatingDTO
    {
        [Range(1, 10)]
        public int Score { get; set; }
        public int GameId { get; set; }
    }
}
