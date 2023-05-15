namespace GameReviews.API.DTOs.IntermediateDTOs
{
    public class FrontPageGamesDTO
    {
        public List<GameDTO> ReleasedGames { get; set; }
        public List<GameDTO> UpcomingGames { get; set; }
    }
}
