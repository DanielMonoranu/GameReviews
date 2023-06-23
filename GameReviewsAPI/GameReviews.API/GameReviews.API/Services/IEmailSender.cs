using static System.Net.Mime.MediaTypeNames;

namespace GameReviews.API.Services
{
    public interface IEmailSender
    {
        public Task<string> SendEmailAsync(string email, string text, List<string> adminsAccounts, IFormFile? picture);
    }
}
