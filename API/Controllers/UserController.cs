using System.Security.Claims;

using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Interfaces;
using Microsoft.AspNetCore.Authorization;

using Microsoft.AspNetCore.Mvc;


namespace API.Controllers
{
    [Authorize]
    public class UserController(IMemberRepository memberRepository) : BaseApiController
    {
        [HttpGet]
        public async Task<ActionResult<IReadOnlyList<Member>>> GetUsers()
        {
            return Ok(await memberRepository.GetMembersAsync());
        }


        [HttpGet("{id}")]
        public async Task<ActionResult<Member>> GetUser(string id)
        {
            var user = await memberRepository.GetMemberByIdAsync(id);
            if (user == null) return NotFound();
            return user;
        }

        [HttpGet("{id}/photos")]
        public async Task<ActionResult<IReadOnlyList<MemberPhoto>>> GetUserPhotos(string id)
        {
            return Ok(await memberRepository.GetMemberPhotosForMemberAsync(id));
        }

        [HttpPut]
        public async Task<ActionResult> UpdateUser(UserUpdateDTO userUpdateDTO)
        {
            var userId = User.GetMemberId();

            var user = await memberRepository.GetMemberForUpdate(userId);

            if (user == null) return BadRequest("Could not get user");

            user.DisplayName = userUpdateDTO.DisplayName ?? user.DisplayName;
            user.Description = userUpdateDTO.Description ?? user.Description;
            user.City = userUpdateDTO.City ?? user.City;
            user.Country = userUpdateDTO.Country ?? user.Country;

            //if user.displayname is updated, return user object with updated display name.
            user.User.DisplayName = userUpdateDTO.DisplayName ?? user.User.DisplayName;


            memberRepository.Update(user); //optional

            if (await memberRepository.SaveAllAsync()) return NoContent();

            return BadRequest("Fail to update user");
        }
    }
}
