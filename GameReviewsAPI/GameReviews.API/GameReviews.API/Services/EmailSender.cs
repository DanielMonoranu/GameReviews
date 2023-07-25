using Azure.Core;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.VisualStudio.TestPlatform.Utilities.Helpers;
using System.Net;
using System.Net.Mail;

namespace GameReviews.API.Services
{
    public class EmailSender : IEmailSender
    {
        public readonly string password;
        public EmailSender(IConfiguration configuration)
        {
            password = configuration.GetConnectionString("EmailPassword");
        }

        public async Task<string> SendEmailAsync(string email, string text, List<string> adminsAccounts, IFormFile? picture)
        {
            try
            {
                var client = new SmtpClient("smtp.gmail.com", 587)
                {
                    EnableSsl = true,
                    UseDefaultCredentials = false,
                    Credentials = new NetworkCredential("starryreviewsCo@gmail.com", password)
                };
                MailMessage message = new MailMessage();
                message.From = new MailAddress("starryreviewsCo@gmail.com");
                message.Subject = "Critic account";
                message.IsBodyHtml = true;
                if (picture != null)
                {
                    Stream fileStream = picture.OpenReadStream();
                    Attachment attachment = new Attachment(fileStream, "useridentication.jpg");
                    message.Attachments.Add(attachment);
                }

                foreach (var adminAccount in adminsAccounts)
                {
                    var htmlContent = $"<strong>User {email} is requesting Critic account.Their message:</strong> <br><br>" + text;
                    message.To.Clear();
                    message.To.Add(new MailAddress(adminAccount));
                    message.Body = htmlContent;
                    await client.SendMailAsync(message);
                }
                return "Email sent succesfully";
            }
            catch (Exception ex)
            {
                return ex.Message;
            }
        }
    }
}
