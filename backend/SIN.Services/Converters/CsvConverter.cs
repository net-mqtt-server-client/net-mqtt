using System.Globalization;
using System.Text;
using SIN.Domain.Entities;
using SIN.Services.Converters.Interfaces;

namespace SIN.Services.Converters
{
    /// <summary>
    /// Converter implementing <see cref="ICsvConverter"/>.
    /// </summary>
    public class CsvConverter : ICsvConverter
    {
        /// <inheritdoc/>
        public byte[] ConvertCollectionToCsv(IEnumerable<Measurement> values)
        {
            var builder = new StringBuilder();

            builder.AppendLine("id,location,sensor,value");
            var floatSeparator = new NumberFormatInfo
            {
                NumberDecimalSeparator = ".",
            };

            foreach (var value in values)
            {
                builder.AppendLine($"{value.Id},{value.Location},{value.Sensor},{value.Value.ToString("00.00", floatSeparator)}");
            }

            return Encoding.ASCII.GetBytes(builder.ToString());
        }
    }
}
