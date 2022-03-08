using System.Text.Json;
using Newtonsoft.Json.Linq;

namespace Area.Utils;

public class Debug
{
    public static void WriteClass<T>(T object_)
    {
        var options = new JsonSerializerOptions() { WriteIndented = true };
        string jsonString = JsonSerializer.Serialize(object_, options);
        Console.WriteLine(jsonString);
    }

    public static void WriteJson(JObject json)
    {
        Console.WriteLine("{");
        foreach (var keyValuePair in json) {
            Console.WriteLine($"\"{keyValuePair.Key}\": {keyValuePair.Value}");
        }
        Console.WriteLine("}");
    }
}