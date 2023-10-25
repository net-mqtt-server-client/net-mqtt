using Newtonsoft.Json;
using SIN.Services.Services.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SIN.Services.Services
{
    public class JsonConverterService : IJsonConverterService
    {
        public byte[] ConvertArrayToJson<T>(IEnumerable<T> values)
        {
            return Encoding.ASCII.GetBytes(JsonConvert.SerializeObject(values, Formatting.Indented));
        }
    }
}
