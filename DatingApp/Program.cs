using DatingApp.Data;
using DatingApp.Entities;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DatingApp
{
    //ova klasa se menja periodicno od strane MS
    public class Program
    {
        //public static void Main(string[] args)
        public static async Task Main(string[] args)
        {
            //CreateHostBuilder(args).Build().Run();    //necemo odmah da run-ujemo treba nam da iskonfigurisemo kreiranje baze
            var host = CreateHostBuilder(args).Build();
            using var scope = host.Services.CreateScope();  //kreiramo scope za servise koje cemo kreirati u ovom delu?
            var services = scope.ServiceProvider;
            //global exception handler koji smo napravili nema pristup ovom delu koda, pa moramo rucno odraditi try-catch
            try
            {
                var context = services.GetRequiredService<DataContext>();
                var userManager = services.GetRequiredService<UserManager<AppUser>>();

                var roleManager = services.GetRequiredService<RoleManager<AppRole>>();
                await context.Database.MigrateAsync();  //kreira bazu ako ne postoji
                await Seed.SeedUsers(userManager, roleManager);  //staticka metoda Seed klase koja popunjava bazu user-ima iz UserSeedData.json
                await Seed.CleanAllConnections(context);
            }
            catch (Exception ex)
            {
                var logger = services.GetRequiredService<ILogger<Program>>();
                logger.LogError(ex, "An error occurred during migration.");
            }

            await host.RunAsync();
        }

        public static IHostBuilder CreateHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args)
                .ConfigureWebHostDefaults(webBuilder =>
                {
                    webBuilder.UseStartup<Startup>();
                });
    }
}
