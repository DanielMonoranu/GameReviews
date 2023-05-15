using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GameReviews.API.Migrations
{
    /// <inheritdoc />
    public partial class AddedAFieldForDevelopers : Migration
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
                column: "GameId");
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
                column: "GameId",
                unique: true);
        }
    }
}
