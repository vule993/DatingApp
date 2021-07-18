using DatingApp.Data;
using DatingApp.DTOs;
using DatingApp.Entities;
using DatingApp.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace DatingApp.Controllers
{
    public class AccountController : BaseApiController
    {
        private readonly DataContext _dataContext;
        private readonly ITokenService _tokenService;

        public AccountController(DataContext dataContext, ITokenService tokenService)
        {
            _dataContext = dataContext;
            _tokenService = tokenService;
        }

        [HttpPost("register")]
        public async Task<ActionResult<UserDTO>> Register(RegisterDTO registerDTO)
        {
            if (await UserExists(registerDTO.UserName)) return BadRequest("Username is taken.");

            using var hmac = new HMACSHA512();
            var user = new AppUser()
            {
                UserName = registerDTO.UserName.ToLower(),
                PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(registerDTO.Password)),
                PasswordSalt = hmac.Key
            };

            _dataContext.Users.Add(user);
            await _dataContext.SaveChangesAsync();

            return new UserDTO 
            { 
                UserName = user.UserName,
                Token = _tokenService.CreateToken(user)
            };
        }

        private async Task<bool> UserExists(string username) => await _dataContext.Users.AnyAsync(user=>user.UserName == username.ToLower());
        

        [HttpPost("login")]
        public async Task<ActionResult<AppUser>> Login(LoginDTO loginDTO)
        {
            var user = await _dataContext.Users.SingleOrDefaultAsync(user => user.UserName == loginDTO.UserName);

            if (user == null) return Unauthorized("Invalid username.");

            var hmac = new HMACSHA512(user.PasswordSalt);

            if (!hmac.ComputeHash(Encoding.UTF8.GetBytes(loginDTO.Password)).SequenceEqual(user.PasswordHash)) return BadRequest("Invalid password.");

            return user;
        }
    }
}
