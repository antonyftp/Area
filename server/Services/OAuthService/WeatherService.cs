using Microsoft.AspNetCore.Builder;
using Newtonsoft.Json;
using Area.Models;
using Microsoft.AspNetCore.Mvc;
namespace Area.Services.OAuthService;
    public class WeatherService
    {
        private readonly UserService _userService;
        static HttpClient Client = new HttpClient();

        public class WeatherDataGet
        {
            public string key { get; set; } = "344359470f5a42c0bf2152826212212";
            public string q { get; set; }
            public string value { get; set; }
        }

        public class WeatherData
        {
            public string key { get; set; }
            public string q { get; set; }
            public string aqi { get; set; } = "yes";

        }

        public class current
        {
            public string temp_c { get; set; }
            public string win_kph { get; set; }
            public string precip_mm { get; set; }
            public string humidity { get; set; }
            public string cloud { get; set; }
            public string uv { get; set; }
            public condition _condition { get; set; }
            
        }

        public class condition
        {
            public string text { get; set; }
        }

        public class air_quality
        {
            public string co { get; set; }
        }

        public class WeatherResponse
        {
            public current _current { get; set; }
            public air_quality _air_quality { get; set; }
        }
        public WeatherService(UserService userService)
        {
            _userService = userService;
        }

        public async Task<WeatherResponse> GetData(WeatherDataGet data)
        {
            var response = new HttpResponseMessage();
            var mydata = new WeatherData();

            mydata.key = data.key;
            mydata.q = data.q;
            using (
                var request = new HttpRequestMessage(HttpMethod.Get, "http://api.weatherapi.com/v1/current.json"))
            {
                var myjson = JsonConvert.SerializeObject(mydata);
                using (var stringContent = new StringContent(myjson, System.Text.Encoding.UTF8, "application/json"))
                {
                    request.Content = stringContent;
                    response = await Client.SendAsync(request);
                }

                if (response.IsSuccessStatusCode)
                {
                    string responseBody = await response.Content.ReadAsStringAsync();
                    var json = JsonConvert.DeserializeObject<WeatherResponse>(responseBody);
                    return json;
                }

                return null;
            }
        }
        public bool getTemp(WeatherDataGet data)
        {
            var result = GetData(data).Result;

            if (Int32.Parse(result._current.temp_c) < Int32.Parse(data.value))
            {
                return true;
            }
            return false;
        }
        public bool getWind(WeatherDataGet data)
        {
            var result = GetData(data).Result;

            if (Int32.Parse(result._current.win_kph) < Int32.Parse(data.value))
            {
                return true;
            }
            return false;
        }
        public bool getPrecip(WeatherDataGet data)
        {
            var result = GetData(data).Result;

            if (Int32.Parse(result._current.precip_mm) < Int32.Parse(data.value))
            {
                return true;
            }
            return false;
        }
        public bool getHumidity(WeatherDataGet data)
        {
            var result = GetData(data).Result;

            if (Int32.Parse(result._current.humidity) < Int32.Parse(data.value))
            {
                return true;
            }
            return false;
        }
        public bool getCloud(WeatherDataGet data)
        {
            var result = GetData(data).Result;

            if (Int32.Parse(result._current.cloud) < Int32.Parse(data.value))
            {
                return true;
            }
            return false;
        }
        
        public bool getUV(WeatherDataGet data)
        {
            var result = GetData(data).Result;

            if (Int32.Parse(result._current.uv) < Int32.Parse(data.value))
            {
                return true;
            }
            return false;
        }
        public string? getcondition(WeatherDataGet data, string? stocked)
        {
            
            var result = GetData(data).Result;

            if (stocked == null || result._current._condition.text != stocked)
            {
                return result._current._condition.text;
            }
            return null;
        }
        public bool geto2(WeatherDataGet data)
        {
            var result = GetData(data).Result;

            if (Int32.Parse(result._air_quality.co) > Int32.Parse(data.value))
            {
                return true;
            }
            return false;
        }
    }
