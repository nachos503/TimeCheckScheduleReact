using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TimeCheckScheduleReact.Server.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate3344 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ProjectName",
                table: "TaskItems",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
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
