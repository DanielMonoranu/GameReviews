using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GameReviews.API.Migrations
{
    /// <inheritdoc />
    public partial class AddedAField : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "Multiplayer",
                table: "Games",
                type: "bit",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Multiplayer",
                table: "Games");
        }
    }
}
