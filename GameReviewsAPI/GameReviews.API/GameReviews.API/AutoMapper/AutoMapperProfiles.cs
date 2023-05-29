using AutoMapper;
using GameReviews.API.DTOs;
using GameReviews.API.DTOs.IntermediateDTOs;
using GameReviews.API.Entities;
using GameReviews.API.Entities.IntermediateEntities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GameReviews.API.AutoMapper
{
    public class AutoMapperProfiles : Profile
    {
        public AutoMapperProfiles()
        {
            CreateMap<GenreDTO, Genre>().ReverseMap();
            CreateMap<GenreCreationDTO, Genre>();

            CreateMap<DeveloperDTO, Developer>().ReverseMap();
            CreateMap<DeveloperCreationDTO, Developer>();

            CreateMap<PlatformDTO, Platform>().ReverseMap();
            CreateMap<PlatformCreationDTO, Platform>();

            CreateMap<GameCreationDTO, Game>()
                .ForMember(x => x.Poster, options => options.Ignore())
                .ForMember(x => x.GamesGenres, options => options.MapFrom(MapCreationGameGenres))
                .ForMember(x => x.GamesPlatforms, options => options.MapFrom(MapCreationGamePlatforms))
                .ForMember(x => x.GamesDevelopers, options => options.MapFrom(MapCreationGameDevelopers));

            CreateMap<Game, GameDTO>()
                .ForMember(x => x.Genres, options => options.MapFrom(MapGameGenres))
                .ForMember(x => x.Platforms, options => options.MapFrom(MapGamePlatforms))
                .ForMember(x => x.Developers, options => options.MapFrom(MapGameDeveloper));

            CreateMap<Review, ReviewDTO>();
            CreateMap<ReviewCreationDTO, Review>();

            CreateMap<ApplicationUser, UserDTO>();
            CreateMap<Rating, RatingDTO>();
        }

        private List<GenreDTO> MapGameGenres(Game game, GameDTO gameDto)
        {
            var result = new List<GenreDTO>();
            if (game.GamesGenres != null)
            {
                foreach (var genre in game.GamesGenres)
                {
                    result.Add(new GenreDTO() { Id = genre.GenreId, Name = genre.Genre.Name });
                }
            }
            return result;
        }
        private List<PlatformDTO> MapGamePlatforms(Game game, GameDTO gameDto)
        {
            var result = new List<PlatformDTO>();
            if (game.GamesPlatforms != null)
            {
                foreach (var platform in game.GamesPlatforms)
                {
                    result.Add(new PlatformDTO() { Id = platform.PlatformId, Name = platform.Platform.Name });
                }
            }
            return result;
        }
        private List<DeveloperDTO> MapGameDeveloper(Game game, GameDTO gameDto)
        {
            var result = new List<DeveloperDTO>();
            if (game.GamesDevelopers != null)
            {
                foreach (var developer in game.GamesDevelopers)
                {
                    result.Add(new DeveloperDTO() { Id = developer.DeveloperId, Name = developer.Developer.Name });
                }
            }
            return result;
        }
        private List<GamesGenres> MapCreationGameGenres(GameCreationDTO gameCreationDTO, Game game)
        {
            var result = new List<GamesGenres>();
            if (gameCreationDTO.GenresIds == null) { return result; }

            foreach (var id in gameCreationDTO.GenresIds)
            {
                result.Add(new GamesGenres() { GenreId = id });
            }
            return result;
        }
        private List<GamesPlatforms> MapCreationGamePlatforms(GameCreationDTO gameCreationDTO, Game game)
        {
            var result = new List<GamesPlatforms>();
            if (gameCreationDTO.PlatformsIds == null) { return result; }

            foreach (var id in gameCreationDTO.PlatformsIds)
            {
                result.Add(new GamesPlatforms() { PlatformId = id });
            }
            return result;
        }
        private List<GamesDevelopers> MapCreationGameDevelopers(GameCreationDTO gameCreationDTO, Game game)
        {
            var result = new List<GamesDevelopers>();
            if (gameCreationDTO.DeveloperId == null) { return result; }
            foreach (var id in gameCreationDTO.DeveloperId)
            {
                result.Add(new GamesDevelopers() { DeveloperId = id });
            }

            return result;
        }

    }
}
