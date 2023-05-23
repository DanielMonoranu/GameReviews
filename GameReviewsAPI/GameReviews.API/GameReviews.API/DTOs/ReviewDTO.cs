using GameReviews.API.Entities;
using System.Diagnostics.CodeAnalysis;

namespace GameReviews.API.DTOs
{
    public class ReviewDTO
    {
        public int Id { get; set; }
        public string ReviewText { get; set; }
        public int? ParentReviewId { get; set; }
        public List<ReviewDTO> ChildReviews { get; set; }
        public int GameId { get; set; }
    }
}
