namespace GameReviews.API.DTOs
{
    public class ReviewCreationDTO
    {
        public string ReviewText { get; set; }
        public int GameId { get; set; }
        public int? ParentReviewId { get; set; }
    }
}
