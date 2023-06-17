using GameReviews.API.DTOs.IntermediateDTOs;

namespace GameReviews.API.DTOs
{
    public class RatingDTO
    {
        public int Id { get; set; }
        public int Score { get; set; }
        public int GameId { get; set; }
        public UserDTO User { get; set; }
    }
}
