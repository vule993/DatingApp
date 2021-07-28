using AutoMapper;
using DatingApp.Data;
using DatingApp.DTOs;
using DatingApp.Entities;
using DatingApp.Extensions;
using DatingApp.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
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
        private readonly IPhotoService _photoService;

        public UsersController(IUserRepository repository, IMapper mapper, IPhotoService photoService)
        {
            _repository = repository;
            _mapper = mapper;
            _photoService = photoService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<MemberDTO>>> GetUsers() => Ok(await _repository.GetMembersAsync());  //moramo da wrappujemo u Ok


        [HttpGet("{username}", Name ="GetUser")]
        public async Task<ActionResult<MemberDTO>> GetUsers(string username) => await _repository.GetMemberAsync(username); //vracamo memberDTO direktno iz repozitorijuma
        
        [HttpPut]
        public async Task<ActionResult> UpdateUser(MemberUpdateDTO memberUpdateDTO)
        {
            //User.GetUsername() iz tokena koji api koristi za autentifikaciju korisnika
            var user = await _repository.GetUserByUsernameAsync(User.GetUsername());
            _mapper.Map(memberUpdateDTO, user);     //umesto da manuelno mapiramo sve propertie
            _repository.Update(user);
            if (await _repository.SaveAllAsync()) return NoContent();
            return BadRequest("Failed to update profile.");
        }

        [HttpPost("add-photo")]
        public async Task<ActionResult<PhotoDTO>> AddPhoto(IFormFile file)
        {
            var user = await _repository.GetUserByUsernameAsync(User.GetUsername());

            var result = await _photoService.AddPhotoAsync(file);

            if(result.Error != null) return BadRequest(result.Error.Message);

            var photo = new Photo
            {
                Url = result.SecureUrl.AbsoluteUri,
                PublicId = result.PublicId
            };

            if(user.Photos.Count == 0)
                photo.IsMain = true;
            

            user.Photos.Add(photo);

            if (await _repository.SaveAllAsync()) 
            {
                //return _mapper.Map<PhotoDTO>(photo);
                //return CreatedAtRoute("GetUser",_mapper.Map<PhotoDTO>(photo));
                //ovo GetUser setovao sam u get metodi za user-a preko username-a i to predstavlja lokaciju gde se slika nalazi
                //pri kreiranju resursa po PS je da se posalje lokacija kreiranog resursa i da se vrati resurs kao i da je status 201 -> Created
                return CreatedAtRoute("GetUser", new { username = user.UserName },_mapper.Map<PhotoDTO>(photo));
            }

            return BadRequest("Problem adding photo.");

            
        }

        [HttpPut("set-main-photo/{photoId}")]
        public async Task<ActionResult> SetMainPhoto(int photoId)
        {
            //eager loading -> uzima ne samo objekat user-a nego i objekte vezane za njega fotografije u ovom slucaju
            var user = await _repository.GetUserByUsernameAsync(User.GetUsername());
            //ovo nije asinhrono jer vec imamo user-a u memoriji pa ne idemo u bazu podataka
            var photo = user.Photos.FirstOrDefault(x => x.Id == photoId);

            if (photo.IsMain) return BadRequest("This is already your main photo.");

            var currentMain = user.Photos.FirstOrDefault(x => x.IsMain);
            if (currentMain != null) currentMain.IsMain = false;

            photo.IsMain = true;

            if (await _repository.SaveAllAsync()) return NoContent();

            return BadRequest("Failed to set main photo.");
        }

        [HttpDelete("delete-photo/{photoId}")]
        public async Task<ActionResult> DeletePhoto(int photoId)
        {
            var user = await _repository.GetUserByUsernameAsync(User.GetUsername());
            var photo = user.Photos.FirstOrDefault(x => x.Id == photoId);

            if (photo == null) return NotFound("Photo not found.");

            if (photo.IsMain) return BadRequest("You cannot delete your main photo.");

            if(photo.PublicId != null)  //tada stoji na cloud-u
            {
                var result = await _photoService.DeletePhotoAsync(photo.PublicId); 
                if (result.Error != null) return BadRequest(result.Error.Message);  //ako ne uspe da je obrise sa cloud-a
            }

            user.Photos.Remove(photo);


            if (await _repository.SaveAllAsync()) return Ok();

            return BadRequest("Failed to delete the photo.");

        }

    }
}
