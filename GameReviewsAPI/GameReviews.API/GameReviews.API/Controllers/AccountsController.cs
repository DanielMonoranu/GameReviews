using GameReviews.API.DTOs.IntermediateDTOs;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
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
        private readonly UserManager<IdentityUser> _userManager;
        private readonly SignInManager<IdentityUser> _signInManager;
        private readonly IConfiguration _configuration;
        public AccountsController(UserManager<IdentityUser> userManager, SignInManager<IdentityUser> signInManager, IConfiguration configuration)
        {
            _configuration = configuration;
            _userManager = userManager;
            _signInManager = signInManager;
        }
        [HttpPost("create")]
        public async Task<ActionResult<AuthenticationResponseDTO>> Create([FromBody] UserCredentialsDTO userCredentials)
        {
            var user = new IdentityUser { UserName = userCredentials.Email, Email = userCredentials.Email };
            var result = await _userManager.CreateAsync(user, userCredentials.Password);
            if (result.Succeeded)
            {
                return BuildToken(userCredentials);
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
                return BuildToken(userCredentials);
            }
            else
            {
                return BadRequest("Incorrect Login");
            }

        }



        private AuthenticationResponseDTO BuildToken(UserCredentialsDTO userCredentialsDTO)
        {
            var claims = new List<Claim>()
            {
                new Claim("email",userCredentialsDTO.Email)
            };
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["jwtkey"]));
            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
            //var expiration = DateTime.UtcNow.AddYears(1);
            var expiration = DateTime.UtcNow.AddHours(2);  ///aici de modificat daca nu vreau un an
            var token = new JwtSecurityToken(issuer: null, audience: null, claims: claims, expires: expiration, signingCredentials: credentials);
            return new AuthenticationResponseDTO()
            {
                Token = new JwtSecurityTokenHandler().WriteToken(token),
                ExpirationDate = expiration
            };
        }

    }
}
