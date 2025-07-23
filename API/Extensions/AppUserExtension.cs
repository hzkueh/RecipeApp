using System;
using API.DTOs;
using API.Entities;
using API.Interfaces;

namespace API.Extensions;

public static class AppUserExtension
{
    public static UserDTO ToDto(this AppUser user, ITokenService tokenService)
    {
        return new UserDTO
            {
                Id = user.Id,
                DisplayName = user.DisplayName,
                Email = user.Email,
                ImageURL = user.ImageUrl,
                Token = tokenService.CreateToken(user)
            };
    }
}
