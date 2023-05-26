using Microsoft.AspNetCore.Identity;

namespace GameReviews.API.Entities
{
    public class ApplicationUser : IdentityUser
    {
        public string ProfilePicture { get; set; }
    }
}
