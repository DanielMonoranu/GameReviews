using Azure.Core;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.VisualStudio.TestPlatform.Utilities.Helpers;
using SendGrid;
using SendGrid.Helpers.Mail;

namespace GameReviews.API.Services
{
    public class EmailSender : IEmailSender
    {
        public readonly string SendGridSecret;
        public EmailSender(IConfiguration configuration)
        {
            SendGridSecret = configuration.GetConnectionString("SendGridApiKey");

        }


        public async Task<string> SendEmailAsync(string email, string text, List<string> adminsAccounts, IFormFile? picture)
        {
            var apiKey = SendGridSecret;
            var client = new SendGridClient(apiKey);

            var from = new EmailAddress("monoranudani@gmail.com", "Starry Reviews");

            try
            {
                foreach (var adminEmail in adminsAccounts)
                {
                    var to = new EmailAddress(adminEmail, "Admin");
                    var subject = "Critic Account";
                    var plainTextContent = "Requesting Critic Account";
                    var htmlContent = $"<strong>User {email} is requesting Critic account.Their message:</strong> <br><br>" + text; ;

                    var message = MailHelper.CreateSingleEmail(from, to, subject, plainTextContent, htmlContent);

                    if (picture != null)
                    {
                        var attachment = new Attachment();
                        var photoContent = ConvertImageToBase64(picture);
                        attachment.Content = photoContent;
                        attachment.Type = "image/jpeg";
                        attachment.Filename = "userIdentication";
                        message.AddAttachment(attachment);
                    }

                    var response = await client.SendEmailAsync(message);

                }
                return "Email sent succesfully";
            }
            catch (Exception ex)
            {
                return ex.Message;
            }
        }

        public string ConvertImageToBase64(IFormFile picture)
        {
            using (var memoryStream = new MemoryStream())
            {
                picture.CopyTo(memoryStream);
                byte[] fileBytes = memoryStream.ToArray();
                string base64String = Convert.ToBase64String(fileBytes);
                return base64String;
            }
        }

    }
}
