using AutoMapper;
using DatingApp.DTOs;
using DatingApp.Entities;
using DatingApp.Extensions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DatingApp.Helpers
{
    //mapira sa jednog objekta na drugi
    //da mozemo da injektujemo ovo moramo dodati u servise
    //ne moramo mnogo da pricamo automapperu jer prepoznaje iste nazive, cak ce i getAge da radi, imamo getAge koje vraca int i Age tipa int prepoznaje
    //jedino photo url ne skontava jer je to prva iz liste slika koje su vezane za konkretnog user-a

    /// <summary>
    /// Mapira objekat tipa AppUser na MemberDTO, zajedno sa fotografijama
    /// </summary>
    public class AutoMapperProfiles : Profile
    {
        public AutoMapperProfiles()
        {
            //koji properti gadjamo za membera,  koji properti menjamo, opcije - odakle mapiramo, src-izvor iz koga nalazimo sliku koja je main i njen url vracamo
            CreateMap<AppUser, MemberDTO>()
                .ForMember(
                    destination => destination.PhotoUrl, 
                        options => options.MapFrom(src => src.Photos.FirstOrDefault(x => x.IsMain).Url)
                ) 
                .ForMember(
                    destination => destination.Age,
                    options => options.MapFrom(src => src.DateOfBirth.CalculateAge())
                );


            CreateMap<Photo, PhotoDTO>();
            CreateMap<MemberUpdateDTO, AppUser>();
            CreateMap<RegisterDTO, AppUser>();
            CreateMap<Message, MessageDTO>()
                .ForMember(dest => dest.SenderPhotoUrl, opt=>opt.MapFrom(src=>src.Sender.Photos.FirstOrDefault(x=>x.IsMain).Url))
                .ForMember(dest => dest.RecipientPhotoUrl, opt=>opt.MapFrom(src=>src.Recipient.Photos.FirstOrDefault(x=>x.IsMain).Url));

        }
    }
}
