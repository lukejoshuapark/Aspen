using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Aspen.Data.Database.Migrations
{
    /// <inheritdoc />
    public partial class AddLikesToPosts : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "Likes",
                schema: "Aspen",
                table: "Post",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Likes",
                schema: "Aspen",
                table: "Post");
        }
    }
}
