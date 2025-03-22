using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace LinkExtensionBackend.Migrations
{
    /// <inheritdoc />
    public partial class RecreateUsersTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    email = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    displayName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    friends = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    friendRequests = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    friendRequestsSent = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.email);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Users");
        }
    }
}
