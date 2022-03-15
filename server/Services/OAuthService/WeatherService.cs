using System.Net.Http.Headers;
using Area.Controllers;
using Area.Database;
using Microsoft.AspNetCore.Builder;
using Newtonsoft.Json;
using Area.Models;
using Area.Utils;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;

namespace Area.Services.OAuthService;
    public class WeatherService
    {
        private readonly UserService _userService;
        private string _key { get; set; }
        private readonly ActionReactionService _arService;
        private static HttpClient Client;

        public class WeatherDataGet
        {
            
            public string key { get; set; }
            public string q { get; set; }
            public string value { get; set; }
        }

        public class WeatherResponse
        {
            public class Condition
            {
                public string text { get; set; }
            }

            public class AirQuality
            {
                public string co { get; set; }
            }

            public class Current
            {
                public string temp_c { get; set; }
                public string win_kph { get; set; }
                public string precip_mm { get; set; }
                public string humidity { get; set; }
                public string cloud { get; set; }
                public string uv { get; set; }
                public Condition condition { get; set; }
                public AirQuality air_quality { get; set; }
            }

            public Current current { get; set; }
        }
        public WeatherService(UserService userService, ActionReactionService ar, IOptions<WeatherSettings>Weather)
        {
            _userService = userService;
            _arService = ar;
            Client = new HttpClient();
            Client.BaseAddress = new Uri("http://api.weatherapi.com/v1/");
            Client.DefaultRequestHeaders.Accept.Clear();
            Client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
            _key = Weather.Value.ApiKey;

        }

        public async Task<WeatherResponse> GetData(WeatherDataGet data)
        {
            try
            {
                data.key = _key;
                HttpResponseMessage response = await Client.GetAsync($"current.json?key={data.key}&q={data.q}&aqi=yes");
                return await response.Content.ReadAsAsync<WeatherResponse>();
            } catch (Exception e) {
                Console.WriteLine(e.Message);
                throw new Exception("Failed to fetch Weather data");
            }
        }
        public bool GetTemp(WeatherDataGet data, ActionReaction i)
        {
            var result = GetData(data).Result;
            var State = i.Data.GetValueOrDefault("State");
            UpdateActionReactionToUserBody temp = new UpdateActionReactionToUserBody();
            temp.ActionReactionId = i.Id;
            temp.Name = i.Name;
            temp.ParamsAction = i.ParamsAction;
            temp.ParamsReaction = i.ParamsReaction;
            temp.Data = i.Data;

            if (State == null)
            {
                if (float.Parse(result.current.temp_c) >= float.Parse(data.value))
                {
                    temp.Data?.Add("State", "Above");
                }
                if (float.Parse(result.current.temp_c) < float.Parse(data.value))
                {
                    temp.Data?.Add("State", "Below");
                }
                _arService.Update(temp, i.UserId);
            }
            else
            {
                if (State == "Below" && float.Parse(result.current.temp_c) >= float.Parse(data.value))
                {
                    temp.Data?.Remove("State");
                    temp.Data?.Add("State", "Above");
                    _arService.Update(temp, i.UserId);
                    return false;
                }
                if (State == "Above" && float.Parse(result.current.temp_c) < float.Parse(data.value))
                {
                    temp.Data?.Remove("State");
                    temp.Data?.Add("State", "Below");
                    _arService.Update(temp, i.UserId);
                    return true;
                }
            }
            return false;
        }
        public bool GetWind(WeatherDataGet data, ActionReaction i)
        {
            var result = GetData(data).Result;
            var State = i.Data.GetValueOrDefault("State");
            UpdateActionReactionToUserBody temp = new UpdateActionReactionToUserBody();
            temp.ActionReactionId = i.Id;
            temp.Name = i.Name;
            temp.ParamsAction = i.ParamsAction;
            temp.ParamsReaction = i.ParamsReaction;
            temp.Data = i.Data;

            if (State == null)
            {
                if (float.Parse(result.current.win_kph) >= float.Parse(data.value))
                {
                    temp.Data?.Add("State", "Above");
                }
                if (float.Parse(result.current.win_kph) < float.Parse(data.value))
                {
                    temp.Data?.Add("State", "Below");
                }
                _arService.Update(temp, i.UserId);
            }
            else
            {
                if (State == "Below" && float.Parse(result.current.win_kph) >= float.Parse(data.value))
                {
                    temp.Data?.Remove("State");
                    temp.Data?.Add("State", "Above");
                    _arService.Update(temp, i.UserId);
                    return false;
                }
                if (State == "Above" && float.Parse(result.current.win_kph) < float.Parse(data.value))
                {
                    temp.Data?.Remove("State");
                    temp.Data?.Add("State", "Below");
                    _arService.Update(temp, i.UserId);
                    return true;
                }
            }
            return false;
        }
        public bool GetPrecip(WeatherDataGet data, ActionReaction i)
        {
            var result = GetData(data).Result;
            var State = i.Data.GetValueOrDefault("State");
            UpdateActionReactionToUserBody temp = new UpdateActionReactionToUserBody();
            temp.ActionReactionId = i.Id;
            temp.Name = i.Name;
            temp.ParamsAction = i.ParamsAction;
            temp.ParamsReaction = i.ParamsReaction;
            temp.Data = i.Data;

            if (State == null)
            {
                if (float.Parse(result.current.precip_mm) >= float.Parse(data.value))
                {
                    temp.Data?.Add("State", "Above");
                }
                if (float.Parse(result.current.precip_mm) < float.Parse(data.value))
                {
                    temp.Data?.Add("State", "Below");
                }
                _arService.Update(temp, i.UserId);
            }
            else
            {
                if (State == "Below" && float.Parse(result.current.precip_mm) >= float.Parse(data.value))
                {
                    temp.Data?.Remove("State");
                    temp.Data?.Add("State", "Above");
                    _arService.Update(temp, i.UserId);
                    return false;
                }
                if (State == "Above" && float.Parse(result.current.precip_mm) < float.Parse(data.value))
                {
                    temp.Data?.Remove("State");
                    temp.Data?.Add("State", "Below");
                    _arService.Update(temp, i.UserId);
                    return true;
                }
            }
            return false;
        }
        public bool GetHumidity(WeatherDataGet data, ActionReaction i)
        {
            var result = GetData(data).Result;
            var State = i.Data.GetValueOrDefault("State");
            UpdateActionReactionToUserBody temp = new UpdateActionReactionToUserBody();
            temp.ActionReactionId = i.Id;
            temp.Name = i.Name;
            temp.ParamsAction = i.ParamsAction;
            temp.ParamsReaction = i.ParamsReaction;
            temp.Data = i.Data;

            if (State == null)
            {
                if (float.Parse(result.current.humidity) >= float.Parse(data.value))
                {
                    temp.Data?.Add("State", "Above");
                }
                if (float.Parse(result.current.humidity) < float.Parse(data.value))
                {
                    temp.Data?.Add("State", "Below");
                }
                _arService.Update(temp, i.UserId);
            }
            else
            {
                if (State == "Below" && float.Parse(result.current.humidity) >= float.Parse(data.value))
                {
                    temp.Data?.Remove("State");
                    temp.Data?.Add("State", "Above");
                    _arService.Update(temp, i.UserId);
                    return false;
                }
                if (State == "Above" && float.Parse(result.current.humidity) < float.Parse(data.value))
                {
                    temp.Data?.Remove("State");
                    temp.Data?.Add("State", "Below");
                    _arService.Update(temp, i.UserId);
                    return true;
                }
            }
            return false;
        }
        public bool GetCloud(WeatherDataGet data, ActionReaction i)
        {
            var result = GetData(data).Result;
            var State = i.Data.GetValueOrDefault("State");
            UpdateActionReactionToUserBody temp = new UpdateActionReactionToUserBody();
            temp.ActionReactionId = i.Id;
            temp.Name = i.Name;
            temp.ParamsAction = i.ParamsAction;
            temp.ParamsReaction = i.ParamsReaction;
            temp.Data = i.Data;

            if (State == null)
            {
                if (float.Parse(result.current.cloud) >= float.Parse(data.value))
                {
                    temp.Data?.Add("State", "Above");
                }
                if (float.Parse(result.current.cloud) < float.Parse(data.value))
                {
                    temp.Data?.Add("State", "Below");
                }
                _arService.Update(temp, i.UserId);
            }
            else
            {
                if (State == "Below" && float.Parse(result.current.cloud) >= float.Parse(data.value))
                {
                    temp.Data?.Remove("State");
                    temp.Data?.Add("State", "Above");
                    _arService.Update(temp, i.UserId);
                    return false;
                }
                if (State == "Above" && float.Parse(result.current.cloud) < float.Parse(data.value))
                {
                    temp.Data?.Remove("State");
                    temp.Data?.Add("State", "Below");
                    _arService.Update(temp, i.UserId);
                    return true;
                }
            }
            return false;
        }


        public bool GetCondition(WeatherDataGet data, ActionReaction i)
        {

            var result = GetData(data).Result;
            var State = i.Data.GetValueOrDefault("State");
            UpdateActionReactionToUserBody temp = new UpdateActionReactionToUserBody();
            temp.ActionReactionId = i.Id;
            temp.Name = i.Name;
            temp.ParamsAction = i.ParamsAction;
            temp.ParamsReaction = i.ParamsReaction;
            temp.Data = i.Data;

            if (State == null)
            {
                temp.Data?.Add("State", result.current.condition.text);
                _arService.Update(temp, i.UserId);
            }
            else
            {
                if (State != "Rainy" && (result.current.condition.text.Contains("rain") || result.current.condition.text.Contains("Rain")))
                {
                    temp.Data?.Remove("State");
                    temp.Data?.Add("State", "Rainy");
                    _arService.Update(temp, i.UserId);
                    return true;
                }
            }
            return false;
        }
        public bool GetO2(WeatherDataGet data, ActionReaction i)
        {
            var result = GetData(data).Result;
            var State = i.Data.GetValueOrDefault("State");
            UpdateActionReactionToUserBody temp = new UpdateActionReactionToUserBody();
            temp.ActionReactionId = i.Id;
            temp.Name = i.Name;
            temp.ParamsAction = i.ParamsAction;
            temp.ParamsReaction = i.ParamsReaction;
            temp.Data = i.Data;

            if (State == null)
            {
                if (float.Parse(result.current.air_quality.co) >= float.Parse(data.value))
                {
                    temp.Data?.Add("State", "Above");
                }
                if (float.Parse(result.current.air_quality.co) < float.Parse(data.value))
                {
                    temp.Data?.Add("State", "Below");
                }
                _arService.Update(temp, i.UserId);
            }
            else
            {
                if (State == "Below" && float.Parse(result.current.air_quality.co) >= float.Parse(data.value))
                {
                    temp.Data?.Remove("State");
                    temp.Data?.Add("State", "Above");
                    _arService.Update(temp, i.UserId);
                    return false;
                }
                if (State == "Above" && float.Parse(result.current.air_quality.co) < float.Parse(data.value))
                {
                    temp.Data?.Remove("State");
                    temp.Data?.Add("State", "Below");
                    _arService.Update(temp, i.UserId);
                    return true;
                }
            }
            return false;
        }
    }
