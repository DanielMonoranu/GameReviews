using GameReviews.API.Entities.IntermediateEntities;
using GameReviews.API.Validations;
using System.ComponentModel.DataAnnotations;

namespace GameReviews.API.Entities
{
    public class Game
    {
        public int Id { get; set; }
        [Required(ErrorMessage = "The field with name {0} is required")]
        [StringLength(75)]
        [FirstLetterUppercase]
        public string Name { get; set; }
        public bool Multiplayer { get; set; }
        public string Trailer { get; set; }
        public DateTime ReleaseDate { get; set; }
        public string Description { get; set; }
        public string Poster { get; set; }
        public List<GamesGenres> GamesGenres { get; set; }
        public List<GamesDevelopers> GamesDevelopers { get; set; }
        public List<GamesPlatforms> GamesPlatforms { get; set; }

    }
}
