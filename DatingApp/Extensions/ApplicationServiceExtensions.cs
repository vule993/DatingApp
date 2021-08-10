using DatingApp.Data;
using DatingApp.Helpers;
using DatingApp.Interfaces;
using DatingApp.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DatingApp.Extensions
{
    public static class ApplicationServiceExtensions
    {
        public static IServiceCollection AddApplicationServices(this IServiceCollection services, IConfiguration config)
        {
            //za rad sa cloudinary fotografijama
            services.Configure<CloundinarySettings>(config.GetSection("CloudinarySettings"));
            services.AddScoped<IPhotoService, PhotoService>();
            //za rad sa tokenima
            services.AddScoped<ITokenService, TokenService>();
            //za rad sa user repoom
            services.AddScoped<IUserRepository, UserRepository>();
            //da vodi racuna o last active polju korisnika
            services.AddScoped<LogUserActivity>();

            //za automatsko mapiranje klasa
            services.AddAutoMapper(typeof(AutoMapperProfiles).Assembly);    //da mozemo da injektujemo ovo moramo dodati u servise
            //koji konekcioni string koristimo za kontekst nase aplikacije
            services.AddDbContext<DataContext>(options =>
            {
                options.UseSqlServer(config.GetConnectionString("OfficeConnectionServer"));
            });

            return services;
        }
    }
}
