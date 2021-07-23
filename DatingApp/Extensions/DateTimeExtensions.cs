using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DatingApp.Extensions
{
    public static class DateTimeExtensions
    {
        public static int CalculateAge(this DateTime dateOfBirdth)
        {
            var today = DateTime.Today;
            var age = today.Year - dateOfBirdth.Year;
            if (dateOfBirdth.Date > today.AddDays(-age)) age--;
            return age;
        }
    }
}
