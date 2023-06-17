using System.Diagnostics.CodeAnalysis;

namespace GameReviews.API.Entities
{
    public class Review
    {
        public int Id { get; set; }
        public string ReviewText { get; set; }
        [AllowNull]
        public int? ParentReviewId { get; set; }
        public Review? ParentReview { get; set; }
        public List<Review> ChildReviews { get; set; }
        public int GameId { get; set; }
        public Game Game { get; set; }
        public string UserId { get; set; }
        public ApplicationUser User { get; set; }
    }
}
