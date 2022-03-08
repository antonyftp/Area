using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Area.Services.OAuthService;
using Newtonsoft.Json;
using System.Net.Http.Headers;
using Area.Services.OAuthService;

namespace Area.Controllers
{
    public class WeatherController : Controller
    {
        private readonly WeatherService _weatherservice;
        public WeatherController(WeatherService weatherservice)
        {
            _weatherservice = weatherservice;
        }

        [HttpGet]
        [Route("weather/gettemp")]
        public ActionResult getTemp(WeatherService.WeatherDataGet data)
        {
            var result = _weatherservice.GetData(data).Result;

            if (Int32.Parse(result._current.temp_c) < Int32.Parse(data.value))
            {
                return Ok(true);
            }
            return Ok(false);
        }

        [HttpGet]
        [Route("weather/getwind")]
        public ActionResult getWind(WeatherService.WeatherDataGet data)
        {
            var result = _weatherservice.GetData(data).Result;

            if (Int32.Parse(result._current.win_kph) < Int32.Parse(data.value))
            {
                return Ok(true);
            }
            return Ok(false);
        }

        [HttpGet]
        [Route("weather/getprecip")]
        public ActionResult getPrecip(WeatherService.WeatherDataGet data)
        {
            var result = _weatherservice.GetData(data).Result;

            if (Int32.Parse(result._current.precip_mm) < Int32.Parse(data.value))
            {
                return Ok(true);
            }
            return Ok(false);
        }

        [HttpGet]
        [Route("weather/gethumidity")]
        public ActionResult getHumidity(WeatherService.WeatherDataGet data)
        {
            var result = _weatherservice.GetData(data).Result;

            if (Int32.Parse(result._current.humidity) < Int32.Parse(data.value))
            {
                return Ok(true);
            }
            return Ok(false);
        }

        [HttpGet]
        [Route("weather/getcloud")]
        public ActionResult getCloud(WeatherService.WeatherDataGet data)
        {
            var result = _weatherservice.GetData(data).Result;

            if (Int32.Parse(result._current.cloud) < Int32.Parse(data.value))
            {
                return Ok(true);
            }
            return Ok(false);
        }
    }
}
