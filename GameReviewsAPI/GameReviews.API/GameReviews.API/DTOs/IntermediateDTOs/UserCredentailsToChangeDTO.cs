using System.ComponentModel.DataAnnotations;

namespace GameReviews.API.DTOs.IntermediateDTOs
{
    public class UserCredentailsToChangeDTO
    {
        [Required]
        [EmailAddress]
        public string OldEmail { get; set; }
        [Required]
        public string OldPassword { get; set; }

        [EmailAddress]
        public string? NewEmail { get; set; }

        public string? NewPassword { get; set; }
        public IFormFile? NewProfilePicture { get; set; }
    }
}
