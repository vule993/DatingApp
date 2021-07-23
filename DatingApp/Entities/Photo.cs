using System.ComponentModel.DataAnnotations.Schema;

namespace DatingApp.Entities
{
    //  1.  postojace tabela, ali necemo je stavljati u data context (dobavljamo ih vezano za user-a i nece biti potrebe izvlaciti ih pojedinacno)
    //  2.  automatski dodaje na klasu photo AppUserId jer prepoznaje relaziju izmedju ta dva entiteta
    //  3.  kada se ovako odradi migracija dobija se problem jer AppUserId moze biti NULL po default i onDelete je setovan da kada se obrise user ne brisu se fotografije
    //      2 opcije, manuelno konfigurisati entitet, koristiti EF konvencije da se ponasa kako nama odgovara, uklanjamo migraciju remove-migration
    [Table("Photos")]
    public class Photo
    {
        public int Id { get; set; }
        public string Url { get; set; }
        public bool IsMain { get; set; }
        public string PublicId { get; set; }
        //rucno postavljamo (fully defining inside photo entity) FIX za gore navedeni problem
        //sada appUser ne moze biti null, i delete je na cascade sto znaci kada se obrise user, brisu se sve njegove slike (nema sirocica)
        public AppUser AppUser { get; set; }
        public int AppUserId { get; set; }
    }
}