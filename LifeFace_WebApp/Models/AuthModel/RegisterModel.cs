using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LifeFace_WebApp.Models.AuthModel
{
    public class RegisterModel
    {
        public string firstName { get; set; }
        public string middleName { get; set; }
        public string lastName { get; set; }
        public DateTime? doB { get; set; }
        public string userName { get; set; }
        public string passWord { get; set; }
        public string email { get; set; }
    }
}