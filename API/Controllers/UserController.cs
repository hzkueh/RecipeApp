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
    public class UserController(IMemberRepository memberRepository,
        IPhotoService photoService) : BaseApiController
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

        [HttpPost("add-photo")]
        public async Task<ActionResult<MemberPhoto>> AddMemberPhoto([FromForm] IFormFile file)
        {
            var member = await memberRepository.GetMemberForUpdate(User.GetMemberId());

            if (member == null) return BadRequest("Cannot update member");

            var result = await photoService.UploadPhotoAsync(file);

            if (result.Error != null) return BadRequest(result.Error.Message);

            var photo = new MemberPhoto
            {
                Url = result.SecureUrl.AbsoluteUri,
                PublicId = result.PublicId,
                MemberId = User.GetMemberId()
            };

            if (member.ImageUrl == null)
            {
                member.ImageUrl = photo.Url;
                member.User.ImageUrl = photo.Url;
            }
            ;

            member.MemberPhotos.Add(photo);

            if (await memberRepository.SaveAllAsync()) return photo;
            return BadRequest("Problem adding photo");
        }

        [HttpPut("set-main-photo/{photoId}")]
        public async Task<ActionResult> SetMainPhoto(int photoId)
        {
            var member = await memberRepository.GetMemberForUpdate(User.GetMemberId());

            if (member == null) return BadRequest("Cannot get member from token");

            var photo = member.MemberPhotos.SingleOrDefault(x => x.Id == photoId);

            if (member.ImageUrl == photo?.Url || photo == null) return BadRequest("Cannot set this as main image");

            member.ImageUrl = photo.Url;
            member.User.ImageUrl = photo.Url;

            if (await memberRepository.SaveAllAsync()) return NoContent();

            return BadRequest("Problem to set main image");
        }

        [HttpDelete("delete-photo/{photoId}")]
        public async Task<ActionResult> DeleteUserPhoto(int photoId)
        {
            var member = await memberRepository.GetMemberForUpdate(User.GetMemberId());

            if (member == null) return BadRequest("Cannot get member from token");

            var photo = member.MemberPhotos.SingleOrDefault(x => x.Id == photoId);

            if (photo == null || photo.Url == member.ImageUrl)
            {
                return BadRequest("Cannot remove the set photo");
            }

            if (photo.PublicId != null)
            {
                var result = await photoService.DeletePhotoAsync(photo.PublicId);
                if (result.Error != null) return BadRequest(result.Error.Message);
            }

            member.MemberPhotos.Remove(photo);

            if (await memberRepository.SaveAllAsync()) return Ok();

            return BadRequest("Problem deleting photos");
        }
    }
}
