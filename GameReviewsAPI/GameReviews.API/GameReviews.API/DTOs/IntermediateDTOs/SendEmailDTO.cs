namespace GameReviews.API.DTOs.IntermediateDTOs
{
    public class SendEmailDTO
    {
        public string Email { get; set; }
        public string Text { get; set; }
        public IFormFile? Image { get; set; }
    }
}
