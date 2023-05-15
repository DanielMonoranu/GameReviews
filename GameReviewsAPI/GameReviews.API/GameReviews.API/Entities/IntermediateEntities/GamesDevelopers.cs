namespace GameReviews.API.Entities.IntermediateEntities
{
    public class GamesDevelopers
    {
        public int DeveloperId { get; set; }
        public int GameId { get; set; }
        public Developer Developer { get; set; }
        public Game Game { get; set; }
    }
}
