using DatingApp.Entities;
using DatingApp.Interfaces;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace DatingApp.Services
{
    public class TokenService : ITokenService
    {
        private readonly SymmetricSecurityKey _key;

        public TokenService(IConfiguration config)
        {
            _key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(config["TokenKey"]));
        }
        public string CreateToken(AppUser user)
        {
            //tvrdnje (identitet korisnika)
            var claims = new List<Claim>
            {
                new Claim(JwtRegisteredClaimNames.NameId, user.Id.ToString()), 
                new Claim(JwtRegisteredClaimNames.UniqueName, user.UserName) 
            };

            //kljuc(appsettings.json file, tajni nasumicno generisani kljuc za koji zna samo server) i kriptografski algoritam koji sluzi za
            //generisanje digitalnog potpisa
            var creds = new SigningCredentials(_key, SecurityAlgorithms.HmacSha512Signature);

            //svi atributi tokena
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.Now.AddDays(7),
                SigningCredentials = creds
            };

            //handler koji se koristi za kreiranje jwt tokena
            var tokenHandler = new JwtSecurityTokenHandler();

            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }
    }
}

