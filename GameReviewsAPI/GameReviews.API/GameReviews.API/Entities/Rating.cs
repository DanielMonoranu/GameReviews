using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;

namespace GameReviews.API.Entities
{
    public class Rating
    {
        public int Id { get; set; }
        [Range(1, 10)]
        public int Score { get; set; }
        public int GameId { get; set; }
        public Game Game { get; set; }
        public string UserId { get; set; }
        public IdentityUser User { get; set; }

    }
}
