namespace GameReviews.API.Helpers
{
    public interface IFileStorageService
    {
        Task DeleteFile(string pathName, string containerName);
        Task<String> SaveFile(string containerName, IFormFile file);
        Task<String> EditFile(string containerName, IFormFile file, string pathName);
    }
}
