using AutoMapper;
using DatingApp.Data;
using DatingApp.DTOs;
using DatingApp.Entities;
using DatingApp.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace DatingApp.Controllers
{
    [Authorize]
    public class UsersController : BaseApiController
    {
        private readonly IUserRepository _repository;
        private readonly IMapper _mapper;

        public UsersController(IUserRepository repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<MemberDTO>>> GetUsers() => Ok(await _repository.GetMembersAsync());  //moramo da wrappujemo u Ok


        [HttpGet("{username}")]
        public async Task<ActionResult<MemberDTO>> GetUsers(string username) => await _repository.GetMemberAsync(username); //vracamo memberDTO direktno iz repozitorijuma
        
        [HttpPut]
        public async Task<ActionResult> UpdateUser(MemberUpdateDTO memberUpdateDTO)
        {
            var username = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;    //username iz tokena koji api koristi za autentifikaciju korisnika
            var user = await _repository.GetUserByUsernameAsync(username);
            _mapper.Map(memberUpdateDTO, user);     //umesto da manuelno mapiramo sve propertie
            _repository.Update(user);
            if (await _repository.SaveAllAsync()) return NoContent();
            return BadRequest("Failed to update profile.");
        }

    }
}
