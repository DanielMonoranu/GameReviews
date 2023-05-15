namespace GameReviews.API.Entities.IntermediateEntities
{
    public class GamesGenres
    {
        public int GenreId { get; set; }
        public int GameId { get; set; }
        public Genre Genre { get; set; }
        public Game Game { get; set; }

    }
}
