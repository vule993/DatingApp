using DatingApp.Helpers;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DatingApp.Controllers
{
    [ServiceFilter(typeof(LogUserActivity))]    //atribut koji poziva LogUserActivity klasu kada god se trigeruje bilo koji kontroler
    [ApiController]
    [Route("api/[controller]")]
    public class BaseApiController : ControllerBase
    {
    }
}
