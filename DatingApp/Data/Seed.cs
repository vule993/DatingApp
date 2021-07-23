using DatingApp.Entities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace DatingApp.Data
{
    //ovu klasu treba pozvati u program.cs
    public class Seed
    {
        /// <summary>
        /// Metoda koja sluzi za generisanje User-a iz UserSeedData.json i njihovo dodavanje u bazu podataka.
        /// </summary>
        /// <param name="context">Database kontekst</param>
        /// <returns>Ne vraca nista</returns>
        public static async Task SeedUsers(DataContext context)
        {
            //ako nema korisnika povuci ih iz seed-a
            if (await context.Users.AnyAsync()) return;

            var userData = await System.IO.File.ReadAllTextAsync("Data/UserSeedData.json");
            var users = JsonSerializer.Deserialize<List<AppUser>>(userData);    //ovo je sada normalna lista user-a
            foreach (var user in users)
            {
                using var hmac = new HMACSHA512();
                user.UserName = user.UserName.ToLower();
                user.PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes("a"));  //svi user-i ce imati ovaj pw po default-u
                user.PasswordSalt = hmac.Key;

                context.Users.Add(user);
            }

            await context.SaveChangesAsync();
        }
    }
}
