using LifeFace_WebApp.Models;
using LifeFace_WebApp.Models.AuthModel;
using LifeFace_WebApp.Models.Common;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;

namespace LifeFace_WebApp.Services
{
    public class BaseService
    {
        private static readonly HttpClient httpClient = new HttpClient();

        public static async Task<TResponse> GetListAsync<TResponse>(string url)
        {
            string responseBody = "";
            try
            {
                // Thiết lập các Header nếu cần
                httpClient.DefaultRequestHeaders.Add("Accept", "text/html,application/xhtml+xml+json");

                HttpResponseMessage response = await httpClient.GetAsync(url);
                response.EnsureSuccessStatusCode();

                responseBody = await response.Content.ReadAsStringAsync();

                // responseBody = await client.GetStringAsync(uri);

                return JsonConvert.DeserializeObject<TResponse>(responseBody);
            }
            catch (HttpRequestException e)
            {
                Console.WriteLine("\nException Caught!");
                Console.WriteLine("Message :{0} ", e.Message);
            }
            return JsonConvert.DeserializeObject<TResponse>(responseBody);
        }

        public static async Task<TResponse> Post<TResponse, TRequest>(string url, TRequest request)
        {
            string responseBody = "";
            try
            {
                //var httpRequestMessage = new HttpRequestMessage();
                //httpRequestMessage.Method = HttpMethod.Post;
                //httpRequestMessage.RequestUri = new Uri(url);

                //// Tạo StringContent
                //string jsoncontent = JsonConvert.SerializeObject(request);
                //var httpContent = new StringContent(jsoncontent, Encoding.UTF8, "application/json");
                //httpRequestMessage.Content = httpContent;

                //var response = await httpClient.SendAsync(httpRequestMessage);
                //responseBody = await response.Content.ReadAsStringAsync();

                httpClient.BaseAddress = new Uri(url);
                httpClient.DefaultRequestHeaders.Accept.Clear();

                HttpContent httpContent = new StringContent(JsonConvert.SerializeObject(request), Encoding.UTF8);
                httpContent.Headers.ContentType = new MediaTypeHeaderValue("application/json");

                var response = await httpClient.PostAsync("/register", httpContent);
                responseBody = await response.Content.ReadAsStringAsync();

                return JsonConvert.DeserializeObject<TResponse>(responseBody);
            }
            catch (HttpRequestException e)
            {
                Console.WriteLine("\nException Caught!");
                Console.WriteLine("Message :{0} ", e.Message);
            }
            return JsonConvert.DeserializeObject<TResponse>(responseBody);
        }

        public static async Task<string> PostBasic(string url, RegisterModel request)
        {
            string responseBody = "";
            try
            {
                httpClient.BaseAddress = new Uri(url);
                httpClient.DefaultRequestHeaders.Accept.Clear();

                HttpContent httpContent = new StringContent(JsonConvert.SerializeObject(request), Encoding.UTF8);
                //httpContent.Headers.ContentType = new MediaTypeHeaderValue("application/json");

                var response = await httpClient.PostAsync("/register", httpContent);
                responseBody = await response.Content.ReadAsStringAsync();

                //return JsonConvert.DeserializeObject<ResultApi>(responseBody);
                return responseBody;
            }
            catch (HttpRequestException e)
            {
                Console.WriteLine("\nException Caught!");
                Console.WriteLine("Message :{0} ", e.Message);
            }
            //return JsonConvert.DeserializeObject<ResultApi>(responseBody);
            return responseBody;
        }
    }
}