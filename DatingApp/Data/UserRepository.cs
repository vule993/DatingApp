using AutoMapper;
using AutoMapper.QueryableExtensions;
using DatingApp.DTOs;
using DatingApp.Entities;
using DatingApp.Helpers;
using DatingApp.Interfaces;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DatingApp.Data
{
    public class UserRepository : IUserRepository
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;

        public UserRepository(DataContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<MemberDTO> GetMemberAsync(string username)
        {
            //Umesto ovoga, kao optimizaciju (da ne vracamo celog user-a pa onda da u memoriji imamo i potrebna i nepotrebna polja, uradicemo to prilikom dobavljanja,
            //izabracemo samo ono sto nam je potrebno. To se moze uraditi na ovaj nacin (rucno) ili na nacin koji ce biti izvrsen)
            //return await _context.Users.Where(x => x.UserName == username).Select(user => new MemberDTO
            //{
            //    Id = user.Id,
            //    Username = user.UserName
            //}).SingleOrDefaultAsync();


            //kada radimo projekciju nema Include jer EF prepoznaje sam u pozadini
            return await _context.Users.Where(x => x.UserName == username)
                                       .ProjectTo<MemberDTO>(_mapper.ConfigurationProvider)
                                       .SingleOrDefaultAsync();
        }

        public async Task<PagedList<MemberDTO>> GetMembersAsync(UserParams userParams)
        {
            var query = _context.Users.AsQueryable();

            query = query.Where(u => u.UserName != userParams.CurrentUsername);
            query = query.Where(u => u.Gender == userParams.Gender);

            var minDob = DateTime.Today.AddYears(-userParams.MaxAge - 1);
            var maxDob = DateTime.Today.AddYears(-userParams.MinAge);

            query = query.Where(u => u.DateOfBirth >= minDob && u.DateOfBirth <= maxDob);

            query = userParams.OrderBy switch
            {
                "created" => query.OrderByDescending(u => u.Created),
                _ => query.OrderByDescending(u => u.LastActive)
            };

            return await PagedList<MemberDTO>.CreateAsync(
                query.ProjectTo<MemberDTO>(_mapper.ConfigurationProvider).AsNoTracking(), 
                userParams.PageNumber, 
                userParams.PageSize);
        }

        public async Task<AppUser> GetUserByIdAsync(int id)
        {
            return await _context.Users.FindAsync(id);
        }

        public async Task<AppUser> GetUserByUsernameAsync(string username)
        {
            return await _context.Users.Include(p => p.Photos).SingleOrDefaultAsync(x => x.UserName == username);
        }

        public async Task<IEnumerable<AppUser>> GetUsersAsync()
        {
            return await _context.Users.Include(p => p.Photos).ToListAsync();
        }

        public async Task<bool> SaveAllAsync()
        {
            return await _context.SaveChangesAsync() > 0;   //save changes returns int, if it is greater than zero something is changed successfullly
        }

        public void Update(AppUser user)
        {
            _context.Entry(user).State = EntityState.Modified;  //onda ga entity sam menja
        }
    }
}
