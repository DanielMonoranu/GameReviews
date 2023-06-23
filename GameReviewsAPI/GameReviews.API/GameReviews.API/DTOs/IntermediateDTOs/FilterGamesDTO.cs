namespace GameReviews.API.DTOs.IntermediateDTOs
{
    public class FilterGamesDTO
    {
        public int Page { get; set; }
        public int RecordsPerPage { get; set; }
        public PaginationDTO PaginationDto
        {
            get { return new PaginationDTO() { Page = Page, RecordsPerPage = RecordsPerPage }; }
        }
        public string? Name { get; set; }
        public int GenreId { get; set; }
        public int DeveloperId { get; set; }
        public int PlatformId { get; set; }
        public bool Multiplayer { get; set; }
        public bool UpcomingRelease { get; set; }

        public bool Released { get; set; }
        public bool OnlySearch { get; set; } 


    }
}
