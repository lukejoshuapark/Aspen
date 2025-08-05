using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Aspen.Data.Database.Migrations
{
    /// <inheritdoc />
    public partial class AddedPublishedToPost : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "Published",
                schema: "Aspen",
                table: "Post",
                type: "bit",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Published",
                schema: "Aspen",
                table: "Post");
        }
    }
}
