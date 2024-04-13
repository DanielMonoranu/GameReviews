namespace GameReviews.API.DTOs.IntermediateDTOs
{
    public class UserDTO
    {
        public string Id { get; set; }
        public string Email { get; set; }
        public byte[]? ProfilePicture { get; set; }

        public string Type { get; set; }
    }
}
