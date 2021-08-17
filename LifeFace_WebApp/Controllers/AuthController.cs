using LifeFace_WebApp.Models.AuthModel;
using LifeFace_WebApp.Models.Common;
using LifeFace_WebApp.Services;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LifeFace_WebApp.Controllers
{
    public class AuthController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }

        public IActionResult Register()
        {
            return View();
        }

        [HttpPost]
        public async Task<IActionResult> RegisterUser([FromBody] RegisterModel request)
        {
            var result = await BaseService.PostBasic("http://localhost:3000", request);
            return Json(result);
        }
    }
}