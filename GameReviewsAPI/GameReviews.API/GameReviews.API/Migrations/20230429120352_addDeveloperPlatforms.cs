using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GameReviews.API.Migrations
{
    /// <inheritdoc />
    public partial class addDeveloperPlatforms : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "GamesDevelopers",
                columns: table => new
                {
                    DeveloperId = table.Column<int>(type: "int", nullable: false),
                    GameId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GamesDevelopers", x => new { x.DeveloperId, x.GameId });
                    table.ForeignKey(
                        name: "FK_GamesDevelopers_Developers_DeveloperId",
                        column: x => x.DeveloperId,
                        principalTable: "Developers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_GamesDevelopers_Games_GameId",
                        column: x => x.GameId,
                        principalTable: "Games",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "GamesPlatforms",
                columns: table => new
                {
                    PlatformId = table.Column<int>(type: "int", nullable: false),
                    GameId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GamesPlatforms", x => new { x.PlatformId, x.GameId });
                    table.ForeignKey(
                        name: "FK_GamesPlatforms_Games_GameId",
                        column: x => x.GameId,
                        principalTable: "Games",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_GamesPlatforms_Platforms_PlatformId",
                        column: x => x.PlatformId,
                        principalTable: "Platforms",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_GamesDevelopers_GameId",
                table: "GamesDevelopers",
                column: "GameId");

            migrationBuilder.CreateIndex(
                name: "IX_GamesPlatforms_GameId",
                table: "GamesPlatforms",
                column: "GameId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "GamesDevelopers");

            migrationBuilder.DropTable(
                name: "GamesPlatforms");
        }
    }
}
