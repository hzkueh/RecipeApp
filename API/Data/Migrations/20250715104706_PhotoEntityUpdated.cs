using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace API.Data.Migrations
{
    /// <inheritdoc />
    public partial class PhotoEntityUpdated : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_MemberPhotos_Members_MemberId",
                table: "MemberPhotos");

            migrationBuilder.AlterColumn<string>(
                name: "MemberId",
                table: "MemberPhotos",
                type: "TEXT",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "TEXT",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_MemberPhotos_Members_MemberId",
                table: "MemberPhotos",
                column: "MemberId",
                principalTable: "Members",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_MemberPhotos_Members_MemberId",
                table: "MemberPhotos");

            migrationBuilder.AlterColumn<string>(
                name: "MemberId",
                table: "MemberPhotos",
                type: "TEXT",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "TEXT");

            migrationBuilder.AddForeignKey(
                name: "FK_MemberPhotos_Members_MemberId",
                table: "MemberPhotos",
                column: "MemberId",
                principalTable: "Members",
                principalColumn: "Id");
        }
    }
}
