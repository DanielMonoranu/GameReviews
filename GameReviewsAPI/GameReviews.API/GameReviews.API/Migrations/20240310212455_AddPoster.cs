using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GameReviews.API.Migrations
{
    /// <inheritdoc />
    public partial class AddPoster : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<byte[]>(
                name: "Poster",
                table: "Games",
                type: "varbinary(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Poster",
                table: "Games");
        }
    }
}
