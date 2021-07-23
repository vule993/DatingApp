using DatingApp.Extensions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DatingApp.Entities
{
    public class AppUser
    {
        public int Id { get; set; }
        public string UserName { get; set; }
        public byte[] PasswordHash { get; set; }
        public byte[] PasswordSalt { get; set; }
        public DateTime DateOfBirth { get; set; }
        public string KnownAs { get; set; }
        public DateTime Created { get; set; } = DateTime.Now;
        public DateTime LastActive { get; set; } = DateTime.Now;
        public string Gender { get; set; }
        public string Introduction { get; set; }
        public string LookingFor { get; set; }
        public string Interests { get; set; }
        public string City { get; set; }
        public string Country { get; set; }
        public ICollection<Photo> Photos { get; set; }

        //ako bismo ostavili ovu metodu imacemo problem oko optimizacije upita ka bazi, bez obzira sto smo pravili automapper i projektovali u userRpository klasi
        //povlacice se kompletan AppUser iz baze a to nam nije memorijski efikasno. Uklonicemo ovu metodu(zakomentarisati) ali cemo rucno dodati novi ForMember unutar
        //automapper klase kako bi mapper znao kako da mapira polje int Age
        //public int GetAge()
        //{
        //    return DateOfBirth.CalculateAge();
        //}
    }
}
