namespace GameReviews.API.DTOs.IntermediateDTOs
{
    public class GameToEditDTO
    {
        public GameDTO Game { get; set; }
        public List<GenreDTO> SelectedGenres { get; set; }
        public List<GenreDTO> allGenres { get; set; }
        public List<DeveloperDTO> SelectedDevelopers { get; set; }
        public List<DeveloperDTO> allDevelopers { get; set; }
        public List<PlatformDTO> SelectedPlatforms { get; set; }
        public List<PlatformDTO> allPlatforms { get; set; }

    }
}
