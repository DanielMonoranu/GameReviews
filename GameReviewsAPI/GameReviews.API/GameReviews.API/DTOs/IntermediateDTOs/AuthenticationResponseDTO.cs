namespace GameReviews.API.DTOs.IntermediateDTOs
{
    public class AuthenticationResponseDTO
    {
        public string Token { get; set; }
        public DateTime ExpirationDate { get; set; }
    }
}
