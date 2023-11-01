using System.Text;
using Newtonsoft.Json;
using SIN.Domain.Entities;

namespace SIN.Services.Converters
{
    /// <summary>
    /// Converter implementing <see cref="IJsonConverter"/>.
    /// </summary>
    public class JsonConverter : IJsonConverter
    {
        /// <inheritdoc/>
        public byte[] ConvertCollectionToJson(IEnumerable<Measurement> values)
        {
            return Encoding.ASCII.GetBytes(JsonConvert.SerializeObject(values, Formatting.Indented));
        }
    }
}
