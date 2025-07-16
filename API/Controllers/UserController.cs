using API.Data;
using API.Entities;
using API.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

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
        public async Task<ActionResult<IReadOnlyList<MemberPhoto>>> GetUserPhotos(string id) {
            return Ok(await memberRepository.GetMemberPhotosForMemberAsync(id));
        }
    }
}
