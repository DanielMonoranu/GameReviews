using AutoMapper;
using GameReviews.API.DTOs.IntermediateDTOs;
using GameReviews.API.Entities;
using GameReviews.API.Helpers;
using GameReviews.API.Services;
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
        private readonly IReviewsService _reviewsService;
        private readonly IMapper _mapper;
        private readonly IEmailSender _emailSender;
        private string container = "userspictures";
        private string userType = "User";
        private string pictureString = "https://gamereviewsapi.blob.core.windows.net/userspictures/d06e8f56-16ec-47b2-978a-03dcda797947.png";

        public AccountsController(UserManager<ApplicationUser> userManager, SignInManager<ApplicationUser> signInManager, IEmailSender emailSender,
            IConfiguration configuration, IFileStorageService fileStorageService, ApplicationDbContext context, IMapper mapper, IReviewsService reviewsService)
        {
            _configuration = configuration;
            _userManager = userManager;
            _signInManager = signInManager;
            _fileStorageService = fileStorageService;
            _context = context;
            _mapper = mapper;
            _reviewsService = reviewsService;
            _emailSender = emailSender;
        }
        [HttpPost("create")]
        public async Task<ActionResult<AuthenticationResponseDTO>> Create([FromForm] UserCreationDTO userCreation)
        {
            var user = new ApplicationUser { UserName = userCreation.Email, Email = userCreation.Email };
            user.Type = userType;
            var result = await _userManager.CreateAsync(user, userCreation.Password);
            var userCredentials = new UserCredentialsDTO() { Email = userCreation.Email, Password = userCreation.Password };
            if (result.Succeeded)
            {
                if (userCreation.ProfilePicture != null)
                {
                    user.ProfilePicture = await _fileStorageService.SaveFile(container, userCreation.ProfilePicture);
                }
                else
                {
                    user.ProfilePicture = pictureString;
                }
                await _userManager.UpdateAsync(user);

                var claimToSend = new Claim("type", "User");
                return BuildToken(user.Email, user.ProfilePicture, claimToSend);
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
                if (claims.Count() != 0)
                {
                    foreach (var claim in claims)
                    {
                        if (claim.Value == "admin")
                        {
                            claimToSend = new Claim("role", "admin");
                        }
                    }
                }
                else
                {
                    var type = user.Type;
                    claimToSend = new Claim("type", type);
                }
                return BuildToken(user.Email, user.ProfilePicture, claimToSend);
            }
            else
            {
                return BadRequest("Incorrect Login");
            }
        }

        [HttpPost("changeCredentials")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public async Task<ActionResult<AuthenticationResponseDTO>> ChangeDetails([FromForm] UserCredentailsToChangeDTO userCredentials)
        {
            var result = await _signInManager.PasswordSignInAsync(userCredentials.OldEmail,
                userCredentials.OldPassword, isPersistent: false, lockoutOnFailure: false);
            if (result.Succeeded)
            {
                var user = await _userManager.FindByEmailAsync(userCredentials.OldEmail);
                if (userCredentials.NewEmail != null)
                {
                    try
                    {
                        user.Email = userCredentials.NewEmail;
                        user.UserName = userCredentials.NewEmail;
                        var resultEmail = await _userManager.UpdateAsync(user);
                    }
                    catch (Exception e)
                    {
                        return BadRequest(e.Message);
                    }
                }
                if (userCredentials.NewPassword != null)
                {
                    var resultPassword = await _userManager.ChangePasswordAsync(user, userCredentials.OldPassword, userCredentials.NewPassword);
                    if (resultPassword.Succeeded == false)
                    {
                        return BadRequest(resultPassword.Errors);
                    }
                }
                if (userCredentials.NewProfilePicture != null)
                {
                    try
                    {
                        if (user.ProfilePicture != pictureString)
                        {
                            await _fileStorageService.DeleteFile(user.ProfilePicture, container);
                        }
                        user.ProfilePicture = await _fileStorageService.SaveFile(container, userCredentials.NewProfilePicture);
                        var resultPicture = await _userManager.UpdateAsync(user);
                    }
                    catch (Exception e)
                    {
                        return BadRequest(e.Message);
                    }
                }
                var claims = await _userManager.GetClaimsAsync(user);
                Claim claimToSend = new Claim("", "");
                if (claims.Count() != 0)
                {
                    foreach (var claim in claims)
                    {
                        if (claim.Value == "admin")
                        {
                            claimToSend = new Claim("role", "admin");
                        }
                    }
                }
                else
                {
                    var type = user.Type;
                    claimToSend = new Claim("type", type);
                }
                return BuildToken(user.Email, user.ProfilePicture, claimToSend);
            }
            else
            {
                return BadRequest("Incorrect Password");
            }
        }

        [HttpGet("")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Policy = "isAdmin")]
        public async Task<ActionResult<List<UserDTO>>> Get([FromQuery] PaginationDTO paginationDTO)
        {
            var queryable = _userManager.Users.AsQueryable();
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
            if (user is null) return NotFound();
            await _userManager.AddClaimAsync(user, new Claim("role", "admin"));
            user.Type = "Admin";
            await _context.SaveChangesAsync();
            return Ok();
        }

        [HttpPost("removeAdmin")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Policy = "isAdmin")]
        public async Task<ActionResult> RemoveAdmin([FromBody] string id)
        {
            var user = await _userManager.FindByIdAsync(id);
            if (user is null) return NotFound();
            await _userManager.RemoveClaimAsync(user, new Claim("role", "admin"));
            user.Type = "User";
            await _context.SaveChangesAsync();
            return Ok();
        }


        [HttpPost("makeCritic")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Policy = "isAdmin")]
        public async Task<ActionResult> MakeCritic([FromBody] string id)
        {
            var user = await _userManager.FindByIdAsync(id);
            if (user is null) return NotFound();
            user.Type = "Critic";
            await _context.SaveChangesAsync();
            return Ok();
        }

        [HttpPost("removeCritic")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Policy = "isAdmin")]
        public async Task<ActionResult> RemoveCritic([FromBody] string id)
        {
            var user = await _userManager.FindByIdAsync(id);
            if (user is null) return NotFound();
            user.Type = "User";
            await _context.SaveChangesAsync();
            return Ok();
        }

        [HttpPost("deleteAccount")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Policy = "isAdmin")]
        public async Task<ActionResult> Delete([FromBody] string id)
        {
            var user = await _userManager.FindByIdAsync(id);
            var reviewToDelete = await _context.Reviews.Where(x => x.UserId == id).Select(r => r.Id).ToListAsync();
            foreach (var review in reviewToDelete)
            {
                try
                {
                    await _reviewsService.DeleteListOfReview(review);
                }
                catch { }
            }
            if (user is null) return NotFound();
            await _userManager.DeleteAsync(user);
            if (user.ProfilePicture != null && user.ProfilePicture != pictureString)
            {

                await _fileStorageService.DeleteFile(user.ProfilePicture, container);
            }
            return Ok();
        }

        [HttpDelete( )]
        public async Task<ActionResult> DeleteAccount([FromBody] UserCredentialsDTO userCredentials)
        {
            var result = await _signInManager.PasswordSignInAsync(userCredentials.Email,
               userCredentials.Password, isPersistent: false, lockoutOnFailure: false);
            if (result.Succeeded)
            {
                var user = await _userManager.FindByEmailAsync(userCredentials.Email);
                await Delete(user.Id);
            return Ok();
            }
            else
            {
                return BadRequest("Incorrect Login");
            }
        }

        [HttpPost("sendEmail")]
        public async Task<ActionResult> SendEmail([FromForm] SendEmailDTO sendEmailDTO)
        {
            var admins = await _userManager.Users.Where(x => x.Type == "Admin").Select(x => x.Email).ToListAsync();
            var response = await _emailSender.SendEmailAsync(sendEmailDTO.Email, sendEmailDTO.Text, admins, sendEmailDTO.Image);
            return Ok(response);
        }
        private AuthenticationResponseDTO BuildToken(string email, string? profilePicture, Claim? claim = null)
        {
            var claims = new List<Claim>()
            {
                new Claim("email",email),
            };

            claims.Add(claim);
            if (profilePicture != null)
            {
                claims.Add(new Claim("profilePicture", profilePicture));
            }
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["jwtkey"]));
            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
            var expiration = DateTime.UtcNow.AddHours(2);  ///aici de modificat timpul!!
            var token = new JwtSecurityToken(issuer: null, audience: null, claims: claims, expires: expiration, signingCredentials: credentials);
            return new AuthenticationResponseDTO()
            {
                Token = new JwtSecurityTokenHandler().WriteToken(token),
                ExpirationDate = expiration
            };
        }

    }
}
