using GameReviews.API.Validations;
using System.ComponentModel.DataAnnotations;

namespace GameReviews.API.DTOs
{
    public class PlatformCreationDTO
    {
        [Required(ErrorMessage = "The field with name {0} is required")]
        [StringLength(50)]
        [FirstLetterUppercase]
        public string Name { get; set; }
    }
}
