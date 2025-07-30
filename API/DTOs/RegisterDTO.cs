using System;
using System.ComponentModel.DataAnnotations;

namespace API.DTOs;

public class RegisterDTO
{
    [Required]
    public string DisplayName { get; set; } = "";
    [Required]
    [EmailAddress]
    public string Email { get; set; } = "";
    [Required]
    [MinLength(6)]
    public string Password { get; set; } = "";

    [Required]
    public string Gender { get; set; } = "";

    [Required]
    public string City { get; set; } = "";

    [Required]
    public string Country { get; set; } = "";

    [Required]
    public DateOnly DateOfBirth { get; set; }
}
