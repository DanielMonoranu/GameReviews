using Microsoft.Identity.Client;

namespace GameReviews.API.DTOs.IntermediateDTOs
{
    public class GamesAttributesDTO
    {
        public List<GenreDTO> Genres { get; set; }
        public List<DeveloperDTO> Developers { get; set; }
        public List<PlatformDTO> Platforms { get; set; }
    }
}
