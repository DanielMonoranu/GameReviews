using GameReviews.API.Entities;
using GameReviews.API.Entities.IntermediateEntities;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GameReviews.API
{
    public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
    {
        public ApplicationDbContext(DbContextOptions options) : base(options) { }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<GamesGenres>()
                .HasKey(x => new { x.GenreId, x.GameId });
            modelBuilder.Entity<GamesPlatforms>()
             .HasKey(x => new { x.PlatformId, x.GameId });
            modelBuilder.Entity<GamesDevelopers>()
             .HasKey(x => new { x.DeveloperId, x.GameId });

            modelBuilder.Entity<Review>()
                .HasOne(r => r.ParentReview)
                .WithMany(r => r.ChildReviews)
                .HasForeignKey(r => r.ParentReviewId)
                .OnDelete(DeleteBehavior.NoAction);

            modelBuilder.Entity<Review>()
                            .HasOne(r => r.Game)
                            .WithMany(g => g.Reviews)
                            .HasForeignKey(r => r.GameId);

            base.OnModelCreating(modelBuilder);
        }

        public DbSet<Genre> Genres { get; set; }
        public DbSet<Developer> Developers { get; set; }
        public DbSet<Platform> Platforms { get; set; }
        public DbSet<Game> Games { get; set; }
        public DbSet<GamesGenres> GamesGenres { get; set; }
        public DbSet<GamesDevelopers> GamesDevelopers { get; set; }
        public DbSet<GamesPlatforms> GamesPlatforms { get; set; }
        public DbSet<Review> Reviews { get; set; }
        public DbSet<Rating> Ratings { get; set; }


    }
}
