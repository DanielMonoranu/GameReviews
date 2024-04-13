using Microsoft.AspNetCore.Identity;

namespace GameReviews.API.Entities
{
    public class ApplicationUser : IdentityUser
    {
        public byte[]? ProfilePicture { get; set; }
        public string Type { get; set; }

    }
}
