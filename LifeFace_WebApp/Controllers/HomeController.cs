using LifeFace_WebApp.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using LifeFace_WebApp.Services;

namespace LifeFace_WebApp.Controllers
{
    public class HomeController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }

        //[HttpGet]
        //public async Task<IActionResult> GetData()
        //{
        //    var result = await BaseService.GetListAsync<PostRespons>("https://api-nodewithsqlite3.herokuapp.com/products");
        //    if (result != null)
        //    {
        //        return Json(result);
        //    }
        //    else
        //    {
        //        return Json("none");
        //    }
        //}

        //[HttpPost]
        //public JsonResult PostData([FromBody] Products productss)
        //{
        //    return Json(productss);
        //    //var result = await BaseService.Post<Products, Products>("https://jsonplaceholder.typicode.com/posts", _request);
        //    //if (result != null)
        //    //{
        //    //    return Json(_request);
        //    //}
        //    //else
        //    //{
        //    //    return Json("none");
        //    //}
        //}
    }
}