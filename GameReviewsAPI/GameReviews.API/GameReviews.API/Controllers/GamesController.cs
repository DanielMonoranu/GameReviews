using AutoMapper;
using GameReviews.API.Helpers;
using GameReviews.API.DTOs;
using GameReviews.API.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using GameReviews.API.DTOs.IntermediateDTOs;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System.Net.Http;
using Newtonsoft.Json.Linq;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.Identity.Client;

namespace GameReviews.API.Controllers

{
    [Route("[controller]")]
    [ApiController]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Policy = "isAdmin")]
    public class GamesController : ControllerBase
    {
        private readonly ILogger<GamesController> _logger;
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;
        private readonly IFileStorageService _fileStorageService;
        private readonly UserManager<ApplicationUser> _userManager;
        private string container = "gameposters";
        public GamesController(ILogger<GamesController> logger, ApplicationDbContext context, IMapper mapper, IFileStorageService fileStorageService, UserManager<ApplicationUser> userManager)
        {
            _logger = logger;
            _context = context;
            _mapper = mapper;
            _fileStorageService = fileStorageService;
            _userManager = userManager;
        }
        [HttpGet("{id:int}")]
        [AllowAnonymous]
        public async Task<ActionResult<GameDTO>> Get(int id)
        {
            var game = await _context.Games
                .Include(x => x.GamesGenres).ThenInclude(x => x.Genre)
                .Include(x => x.GamesPlatforms).ThenInclude(x => x.Platform)
                .Include(x => x.GamesDevelopers).ThenInclude(x => x.Developer)
                .FirstOrDefaultAsync(x => x.Id == id);
            if (game == null) { return NotFound(); }

            var averageScoreCritics = 0.0;
            var averageScoreUsers = 0.0;
            var userScore = 0;
            var userType = "NotLoggedIn";

            if (await _context.Ratings.AnyAsync(x => x.GameId == id))
            {
                try
                {
                    averageScoreCritics = await _context.Ratings.Where(x => x.GameId == id && x.User.Type == "Critic")
                        .AverageAsync(x => x.Score);
                }
                catch { }
                try
                {
                    averageScoreUsers = await _context.Ratings.Where(x => x.GameId == id && x.User.Type == "User")
                    .AverageAsync(x => x.Score);
                }
                catch { }

                /*if (HttpContext.User.Identity.IsAuthenticated)
                {
                    var email = HttpContext.User.Claims.FirstOrDefault(x => x.Type == "email").Value;
                    var user = await _userManager.FindByNameAsync(email);
                    var userId = user.Id;
                    userType = user.Type;
                    var ratingTable = await _context.Ratings.FirstOrDefaultAsync(x => x.GameId == id && x.UserId == userId);
                    if (ratingTable != null)
                    {
                        userScore = ratingTable.Score;
                    }
                }*/
            }
            if (HttpContext.User.Identity.IsAuthenticated)
            {
                var email = HttpContext.User.Claims.FirstOrDefault(x => x.Type == "email").Value;
                var user = await _userManager.FindByNameAsync(email);
                var userId = user.Id;
                userType = user.Type;
                var ratingTable = await _context.Ratings.FirstOrDefaultAsync(x => x.GameId == id && x.UserId == userId);
                if (ratingTable != null)
                {
                    userScore = ratingTable.Score;
                }
            }
            var gameDto = _mapper.Map<GameDTO>(game);
            gameDto.AverageScoreCritics = averageScoreCritics;
            gameDto.AverageScoreUsers = averageScoreUsers;
            gameDto.UserScore = userScore;
            gameDto.UserType = userType;
            return gameDto;
        }

        [HttpGet("GetAllGamesAttributes")]
        public async Task<ActionResult<GamesAttributesDTO>> Get()
        {
            var genres = await _context.Genres.OrderBy(u => u.Name).ToListAsync();
            var platforms = await _context.Platforms.OrderBy(u => u.Name).ToListAsync();
            var developers = await _context.Developers.OrderBy(u => u.Name).ToListAsync();

            var genresDTO = _mapper.Map<List<GenreDTO>>(genres);
            var platfomrsDTO = _mapper.Map<List<PlatformDTO>>(platforms);
            var developersDTO = _mapper.Map<List<DeveloperDTO>>(developers);

            return new GamesAttributesDTO() { Developers = developersDTO, Platforms = platfomrsDTO, Genres = genresDTO };
        }

        [HttpGet("GetFrontPageGames")]
        [AllowAnonymous]
        public async Task<ActionResult<FrontPageGamesDTO>> GetFrontPageGames()
        {
            var today = DateTime.Now;
            var entries = 6;
            var upcomingGames = await _context.Games.Where(x => x.ReleaseDate > today)
                .OrderBy(x => x.ReleaseDate).Take(entries).ToListAsync();

            var releasedGames = await _context.Games.Where(x => x.ReleaseDate < today)
                .OrderBy(x => x.ReleaseDate).Take(entries).ToListAsync();
            var frontPageGamesDto = new FrontPageGamesDTO();

            frontPageGamesDto.UpcomingGames = _mapper.Map<List<GameDTO>>(upcomingGames);
            frontPageGamesDto.ReleasedGames = _mapper.Map<List<GameDTO>>(releasedGames);
            return Ok(frontPageGamesDto);

        }

        [HttpGet("GetGameToEdit/{id:int}")]
        public async Task<ActionResult<GameToEditDTO>> GetGameToEdit(int id)
        {
            var gameToEditActionResult = await Get(id);
            if (gameToEditActionResult.Result is NotFoundResult) { return NotFound(); }
            var gameToEdit = gameToEditActionResult.Value;

            var genresSelectedIds = gameToEdit.Genres.Select(x => x.Id).ToList();
            var allGenres = await _context.Genres.ToListAsync();
            var allGenresDto = _mapper.Map<List<GenreDTO>>(allGenres);

            var developerSelectedIds = gameToEdit.Developers.Select(x => x.Id).ToList();
            var allDevelopers = await _context.Developers.ToListAsync();
            var allDevelopersDto = _mapper.Map<List<DeveloperDTO>>(allDevelopers);

            var platformsSelectedIds = gameToEdit.Platforms.Select(x => x.Id).ToList();
            var allPlatforms = await _context.Platforms.ToListAsync();
            var allPlatformsDto = _mapper.Map<List<PlatformDTO>>(allPlatforms);

            var response = new GameToEditDTO();
            response.Game = gameToEdit;
            response.SelectedGenres = gameToEdit.Genres;
            response.allGenres = allGenresDto;
            response.SelectedDevelopers = gameToEdit.Developers;
            response.allDevelopers = allDevelopersDto;
            response.SelectedPlatforms = gameToEdit.Platforms;
            response.allPlatforms = allPlatformsDto;
            return response;
        }


        [HttpPut("{id:int}")]
        public async Task<ActionResult> Put(int id, [FromForm] GameCreationDTO gameCreationDTO)
        {
            var game = await _context.Games
                     .Include(x => x.GamesGenres)
                     .Include(x => x.GamesPlatforms)
                     .Include(x => x.GamesDevelopers)
                     .FirstOrDefaultAsync(x => x.Id == id);
            if (game == null) { return NotFound(); }

            game = _mapper.Map(gameCreationDTO, game);

            if (gameCreationDTO.Poster != null)
            {
                game.Poster = await _fileStorageService.EditFile(container, gameCreationDTO.Poster, game.Poster);

            }
            await _context.SaveChangesAsync();
            return Ok(game);
        }



        [HttpPost]
        public async Task<ActionResult<int>> Post([FromForm] GameCreationDTO gameCreationDTO)
        {
            var game = _mapper.Map<Game>(gameCreationDTO);
            if (gameCreationDTO.Poster != null)
            {
                game.Poster = await _fileStorageService.SaveFile(container, gameCreationDTO.Poster);
            }
            try
            {
                _context.Add(game);
                await _context.SaveChangesAsync();
                return Ok(game.Id);
            }
            catch (Exception ex)
            {
                var response = new List<string>();
                response.Add("The poster field is required");
                return BadRequest(response);
            }
        }

        [HttpDelete("{id:int}")]
        public async Task<ActionResult> Delete(int id)
        {
            var game = await _context.Games.FirstOrDefaultAsync(x => x.Id == id);
            if (game == null)
            {
                return NotFound();
            }
            _context.Remove(game);
            await _context.SaveChangesAsync();
            await _fileStorageService.DeleteFile(game.Poster, container);
            return Ok();
        }

        [HttpGet("filter")]
        [AllowAnonymous]
        public async Task<ActionResult<List<GameDTO>>> Filter([FromQuery] FilterGamesDTO filterGamesDTO)
        {
            var gamesQueryable = _context.Games.AsQueryable();
            if (!string.IsNullOrEmpty(filterGamesDTO.Name))
            {
                gamesQueryable = gamesQueryable.Where(x => x.Name.Contains(filterGamesDTO.Name));
            }
            if (filterGamesDTO.Multiplayer)
            {
                gamesQueryable = gamesQueryable.Where(x => x.Multiplayer);
            }
            if (filterGamesDTO.UpcomingRelease)
            {
                var today = DateTime.Today;
                gamesQueryable = gamesQueryable.Where(x => x.ReleaseDate > today);
            }
            if (filterGamesDTO.Released)
            {
                var today = DateTime.Today;
                gamesQueryable = gamesQueryable.Where(x => x.ReleaseDate < today);
            }
            if (filterGamesDTO.GenreId != 0)
            {
                gamesQueryable = gamesQueryable.Where(x => x.GamesGenres.Select(y => y.GenreId).Contains(filterGamesDTO.GenreId));
            }
            if (filterGamesDTO.DeveloperId != 0)
            {
                gamesQueryable = gamesQueryable.Where(x => x.GamesDevelopers.Select(y => y.DeveloperId).Contains(filterGamesDTO.DeveloperId));
            }
            if (filterGamesDTO.PlatformId != 0)
            {
                gamesQueryable = gamesQueryable.Where(x => x.GamesPlatforms.Select(y => y.PlatformId).Contains(filterGamesDTO.PlatformId));
            }

            await HttpContext.InsertParametersPaginationInHeader(gamesQueryable);
            var games = await gamesQueryable.OrderBy(x => x.Name).Paginate(filterGamesDTO.PaginationDto).ToListAsync();

            return _mapper.Map<List<GameDTO>>(games);

        }

        [HttpGet("GetSteamGameInfo")]
        [AllowAnonymous]
        public async Task<ActionResult<GameInfoSteamDTO>> getSteamGameInfo([FromQuery] string gameName)
        {
            var gameInfo = new GameInfoSteamDTO();
            HttpClient _httpClient = new HttpClient();
            try
            {
                HttpResponseMessage response = await _httpClient.GetAsync("http://api.steampowered.com/ISteamApps/GetAppList/v0002/");

                response.EnsureSuccessStatusCode(); // Ensure the response is successful (status code 2xx)

                string jsonResponse = await response.Content.ReadAsStringAsync();

                JObject json = JObject.Parse(jsonResponse);
                JToken appList = json["applist"];
                JToken apps = appList["apps"];

                foreach (JToken app in apps)
                {
                    string appName = app["name"].ToString();

                    //contains or equal mai vad!!!
                    if (appName.Equals(gameName, StringComparison.OrdinalIgnoreCase))
                    {
                        string gameId = app["appid"].ToString();
                        var gamePrice = await getsSteamGamePrice(gameId);
                        if (gamePrice != null)
                        {
                            gameInfo.Price = gamePrice.ToString();
                            gameInfo.GameId = gameId;
                            return Ok(gameInfo);
                        }
                        else
                        {
                            gameInfo.GameId = "NoGame";
                            gameInfo.Price = "NoPrice";
                        }
                    }
                    else
                    {
                        gameInfo.GameId = "NoGame";
                        gameInfo.Price = "NoPrice";
                    }
                }
                return Ok(gameInfo);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        private async Task<string> getsSteamGamePrice([FromQuery] string gameId)
        {
            HttpClient _httpClient = new HttpClient();
            try
            {
                HttpResponseMessage response = await _httpClient.GetAsync($"https://store.steampowered.com/api/appdetails?appids={gameId}");

                response.EnsureSuccessStatusCode();

                string jsonResponse = await response.Content.ReadAsStringAsync();
                JObject json = JObject.Parse(jsonResponse);
                JToken appDetails = json[$"{gameId}"]["data"];

                if (appDetails != null)
                {
                    JToken price = appDetails?["price_overview"]["final_formatted"];
                    string gamePrice = price?.ToString() ?? "NoPrice";

                    return gamePrice;
                }
                return "NoPrice";
            }
            catch (Exception ex)
            {
                return "NoPrice";
            }
        }
    }
}
