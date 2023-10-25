using SIN.Domain.Entities;
using SIN.Services.Services.Interfaces;
using System;
using System.Collections.Generic;
using System.Diagnostics.Metrics;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SIN.Services.Services
{
    public class CsvConverterService : ICsvConverterService
    {
        public byte[] ConvertArrayToCsv(IEnumerable<Measurement> values)
        {
            var builder = new StringBuilder();

            builder.AppendLine("id,location,sensor,value");
            var floatSeparator = new NumberFormatInfo();
            floatSeparator.NumberDecimalSeparator = ".";

            foreach ( var value in values )
            {
                builder.AppendLine($"{value.Id},{value.Location},{value.Sensor},{value.Value.ToString("00.00", floatSeparator)}");
            }

            return Encoding.ASCII.GetBytes(builder.ToString());
        }
    }
}
