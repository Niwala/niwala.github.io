using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace ShaderFunctionBuilder
{
    [Serializable]
    public struct ShaderFunction
    {
        [JsonConverter(typeof(EmptyStringConverter))] public string name;
        [JsonConverter(typeof(EmptyStringConverter))] public string tags;
        [JsonConverter(typeof(EmptyStringConverter))] public string description;
        [JsonConverter(typeof(EmptyStringConverter))] public string indexDescription;
        [JsonConverter(typeof(EmptyStringConverter))] public string indexShader;

        public ShaderExample[] examples;
    }

    [Serializable]
    public struct ShaderExample
    {
        [JsonConverter(typeof(EmptyStringConverter))] public string name;
        [JsonConverter(typeof(EmptyStringConverter))] public string description;
        [JsonConverter(typeof(EmptyStringConverter))] public string shader;
        [JsonConverter(typeof(EmptyStringConverter))] public string code;

        public ShaderProperty[] properties;
    }

    [Serializable]
    public struct ShaderProperty
    {
        [JsonConverter(typeof(EmptyStringConverter))] public string name;
        [JsonConverter(typeof(EmptyStringConverter))] public string id;
        [JsonConverter(typeof(EmptyStringConverter))] public string type;
        [JsonConverter(typeof(EmptyStringConverter))] public string value;
        [JsonConverter(typeof(EmptyStringConverter))] public string min;
        [JsonConverter(typeof(EmptyStringConverter))] public string max;
    }

    [Serializable]
    public struct FunctionCollection
    {
        public FunctionInfo[] functions;
    }

    public struct FunctionInfo
    {
        [JsonConverter(typeof(EmptyStringConverter))] public string filename;
        [JsonConverter(typeof(EmptyStringConverter))] public string name;
        [JsonConverter(typeof(EmptyStringConverter))] public string tags;
        [JsonConverter(typeof(EmptyStringConverter))] public string description;
        [JsonConverter(typeof(EmptyStringConverter))] public string previewShader;
    }

    public class EmptyStringConverter : JsonConverter
    {
        public override void WriteJson(JsonWriter writer, object value, JsonSerializer serializer)
        {
            if (value == null)
            {
                writer.WriteValue("");
            }
            else
            {
                writer.WriteValue(value);
            }
        }

        public override object ReadJson(JsonReader reader, Type objectType, object existingValue, JsonSerializer serializer)
        {
            return reader.Value?.ToString() ?? "";
        }

        public override bool CanConvert(Type objectType)
        {
            return objectType == typeof(string);
        }
    }
}
