using GameReviews.API.Helpers;
using GameReviews.API.Validations;
using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;

namespace GameReviews.API.DTOs
{
    public class GameCreationDTO
    {
        [Required(ErrorMessage = "The field with name {0} is required")]
        [StringLength(75)]
        [FirstLetterUppercase]
        public string Name { get; set; }
        public bool Multiplayer { get; set; }
        public string Trailer { get; set; }
        public DateTime ReleaseDate { get; set; }
        public string Description { get; set; }
        public IFormFile? Poster { get; set; }

        [ModelBinder(binderType: typeof(TypeBinder<List<int>>))]
        public List<int> GenresIds { get; set; }

        [ModelBinder(binderType: typeof(TypeBinder<List<int>>))]

        public List<int> DeveloperId { get; set; }

        [ModelBinder(binderType: typeof(TypeBinder<List<int>>))]
        public List<int> PlatformsIds { get; set; }



    }
}
