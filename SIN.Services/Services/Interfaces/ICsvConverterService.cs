using SIN.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SIN.Services.Services.Interfaces
{
    public interface ICsvConverterService
    {
        byte[] ConvertArrayToCsv(IEnumerable<Measurement> values);
    }
}
