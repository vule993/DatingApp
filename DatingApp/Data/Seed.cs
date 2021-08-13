using DatingApp.Entities;
using Microsoft.AspNetCore.Identity;
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
        public static async Task SeedUsers(UserManager<AppUser> userManager, RoleManager<AppRole> roleManager)
        {
            //ako nema korisnika povuci ih iz seed-a
            if (await userManager.Users.AnyAsync()) return;

            var userData = await System.IO.File.ReadAllTextAsync("Data/UserSeedData.json");
            var users = JsonSerializer.Deserialize<List<AppUser>>(userData);    //ovo je sada normalna lista user-a
            if (users == null) return;

            var roles = new List<AppRole>
            {
                new AppRole{Name = "Member"},
                new AppRole{Name = "Admin"},
                new AppRole{Name = "Moderator"}
            };

            foreach (var role in roles)
            {
                await roleManager.CreateAsync(role);
            }

            foreach (var user in users)
            {
                user.UserName = user.UserName.ToLower();

                await userManager.CreateAsync(user, "aaaa");
                await userManager.AddToRoleAsync(user, "Member");
            }

            var admin = new AppUser { UserName = "admin" };
            await userManager.CreateAsync(admin, "aaaa");
            await userManager.AddToRolesAsync(admin, new[] { "Admin", "Moderator" });

        }
    }
}
