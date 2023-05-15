namespace GameReviews.API.Entities.IntermediateEntities
{
    public class GamesPlatforms
    {
        public int PlatformId { get; set; }
        public int GameId { get; set; }
        public Platform Platform { get; set; }
        public Game Game { get; set; }
    }
}
