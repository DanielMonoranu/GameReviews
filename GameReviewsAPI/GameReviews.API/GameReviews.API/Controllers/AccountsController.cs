using AutoMapper;
using GameReviews.API.DTOs.IntermediateDTOs;
using GameReviews.API.Entities;
using GameReviews.API.Helpers;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace GameReviews.API.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class AccountsController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly IFileStorageService _fileStorageService;
        private readonly IConfiguration _configuration;
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;
        private string container = "userspictures";
        public AccountsController(UserManager<ApplicationUser> userManager, SignInManager<ApplicationUser> signInManager, IConfiguration configuration, IFileStorageService fileStorageService, ApplicationDbContext context, IMapper mapper)
        {
            _configuration = configuration;
            _userManager = userManager;
            _signInManager = signInManager;
            _fileStorageService = fileStorageService;
            _context = context;
            _mapper = mapper;
        }
        [HttpPost("create")]
        public async Task<ActionResult<AuthenticationResponseDTO>> Create([FromForm] UserCreationDTO userCreation)
        {
            var user = new ApplicationUser { UserName = userCreation.Email, Email = userCreation.Email };
            var result = await _userManager.CreateAsync(user, userCreation.Password);
            var userCredentials = new UserCredentialsDTO() { Email = userCreation.Email, Password = userCreation.Password };
            if (result.Succeeded)
            {
                if (userCreation.ProfilePicture != null)
                {
                    user.ProfilePicture = await _fileStorageService.SaveFile(container, userCreation.ProfilePicture);
                    await _userManager.UpdateAsync(user);
                }
                return BuildToken(userCredentials, user.ProfilePicture);
            }
            else
            {
                return BadRequest(result.Errors);
            }
        }

        [HttpPost("login")]
        public async Task<ActionResult<AuthenticationResponseDTO>> Login([FromBody] UserCredentialsDTO userCredentials)
        {
            var result = await _signInManager.PasswordSignInAsync(userCredentials.Email,
                userCredentials.Password, isPersistent: false, lockoutOnFailure: false);
            if (result.Succeeded)
            {
                var user = await _userManager.FindByEmailAsync(userCredentials.Email);
                var claims = await _userManager.GetClaimsAsync(user);
                Claim claimToSend = new Claim("", "");
                foreach (var claim in claims)
                {
                    if (claim.Value == "admin")
                    {
                        claimToSend = new Claim("role", "admin");
                    }
                }
                return BuildToken(userCredentials, user.ProfilePicture, claimToSend);
            }
            else
            {
                return BadRequest("Incorrect Login");
            }
            return Ok();

        }

        [HttpGet("")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Policy = "isAdmin")]
        public async Task<ActionResult<List<UserDTO>>> Get([FromQuery] PaginationDTO paginationDTO)
        {
            var queryable = _userManager.Users.AsQueryable();
            //var queryable = _context.Users.AsQueryable();
            await HttpContext.InsertParametersPaginationInHeader(queryable);
            var users = await queryable.OrderBy(x => x.Email).Paginate(paginationDTO).ToListAsync();
            var result = _mapper.Map<List<UserDTO>>(users);
            return Ok(result);
        }
        [HttpPost("makeAdmin")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Policy = "isAdmin")]
        public async Task<ActionResult> MakeAdmin([FromBody] string id)
        {
            var user = await _userManager.FindByIdAsync(id);
            await _userManager.AddClaimAsync(user, new Claim("role", "admin"));
            return Ok();
        }
        [HttpPost("removeAdmin")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Policy = "isAdmin")]
        public async Task<ActionResult> RemoveAdmin([FromBody] string id)
        {
            var user = await _userManager.FindByIdAsync(id);
            await _userManager.RemoveClaimAsync(user, new Claim("role", "admin"));
            return Ok();
        }

        private AuthenticationResponseDTO BuildToken(UserCredentialsDTO userCredentialsDTO, string? profilePicture, Claim? claim = null)
        {

            var claims = new List<Claim>()
            {
                new Claim("email",userCredentialsDTO.Email),

            };
            claims.Add(claim);
            if (profilePicture != null)
            {
                claims.Add(new Claim("profilePicture", profilePicture));
            }

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["jwtkey"]));
            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
            //var expiration = DateTime.UtcNow.AddYears(1);
            var expiration = DateTime.UtcNow.AddHours(2);  ///aici de modificat daca nu vreau un an !!
            var token = new JwtSecurityToken(issuer: null, audience: null, claims: claims, expires: expiration, signingCredentials: credentials);
            return new AuthenticationResponseDTO()
            {
                Token = new JwtSecurityTokenHandler().WriteToken(token),
                ExpirationDate = expiration
            };
        }

    }
}
