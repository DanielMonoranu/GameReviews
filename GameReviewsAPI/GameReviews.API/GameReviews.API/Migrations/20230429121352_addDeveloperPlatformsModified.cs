using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GameReviews.API.Migrations
{
    /// <inheritdoc />
    public partial class addDeveloperPlatformsModified : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_GamesDevelopers_GameId",
                table: "GamesDevelopers");

            migrationBuilder.CreateIndex(
                name: "IX_GamesDevelopers_GameId",
                table: "GamesDevelopers",
                column: "GameId",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_GamesDevelopers_GameId",
                table: "GamesDevelopers");

            migrationBuilder.CreateIndex(
                name: "IX_GamesDevelopers_GameId",
                table: "GamesDevelopers",
                column: "GameId");
        }
    }
}
