namespace GameReviews.API.DTOs
{
    public class GameDTO
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public bool Multiplayer { get; set; }
        public string Trailer { get; set; }
        public DateTime ReleaseDate { get; set; }
        public string Description { get; set; }
        public string Poster { get; set; }
        public List<GenreDTO> Genres { get; set; }
        public List<DeveloperDTO> Developers { get; set; }
        public List<PlatformDTO> Platforms { get; set; }
        public double AverageScoreCritics { get; set; }
        public double AverageScoreUsers { get; set; }
        public int UserScore { get; set; }

        public string UserType { get; set; }
    }
}
