using System.ComponentModel.DataAnnotations;

namespace GameReviews.API.DTOs.IntermediateDTOs
{
    public class UserCreationDTO
    {
        [Required]
        [EmailAddress]
        public required string Email { get; set; }
        [Required]
        public required string Password { get; set; }
        public IFormFile? ProfilePicture { get; set; }
    }
}
