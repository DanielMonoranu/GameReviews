using System.ComponentModel.DataAnnotations;

namespace GameReviews.API.DTOs.IntermediateDTOs
{
    public class UserCreationDTO
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; }
        [Required]
        public string Password { get; set; }
        public IFormFile? ProfilePicture { get; set; }
    }
}
