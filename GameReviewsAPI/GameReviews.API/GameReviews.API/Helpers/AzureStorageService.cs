using Azure.Storage.Blobs;
using Microsoft.IdentityModel.Tokens;

namespace GameReviews.API.Helpers
{
    public class AzureStorageService : IFileStorageService
    {
        private string connectionString;
        public AzureStorageService(IConfiguration configuration)
        {
            connectionString = configuration.GetConnectionString("AzureStorageConnection");
        }
        public async Task<string> SaveFile(string containerName, IFormFile file)
        {
            var client = new BlobContainerClient(connectionString, containerName);
            await client.CreateIfNotExistsAsync();
            client.SetAccessPolicy(Azure.Storage.Blobs.Models.PublicAccessType.Blob);
            var extension = Path.GetExtension(file.FileName);
            var filename = $"{Guid.NewGuid()}{extension}";
            var blob = client.GetBlobClient(filename);
            await blob.UploadAsync(file.OpenReadStream());

            return blob.Uri.ToString();
        }
        public async Task DeleteFile(string pathName, string containerName)
        {
            if (string.IsNullOrEmpty(pathName)) return;
            var client = new BlobContainerClient(connectionString, containerName);
            await client.CreateIfNotExistsAsync();
            var filename = Path.GetFileName(pathName);
            var blob = client.GetBlobClient(filename);
            await blob.DeleteIfExistsAsync();
        }
        public async Task<string> EditFile(string containerName, IFormFile file, string pathName)
        {
            await DeleteFile(pathName, containerName);
            return await SaveFile(containerName, file);
        }
    }
}
