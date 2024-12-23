using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TimeCheckScheduleReact.Server.Migrations
{
    /// <inheritdoc />
    public partial class MakeProjectNameOptional : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ProjectName",
                table: "TaskItems",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ProjectName",
                table: "TaskItems");
        }
    }
}
