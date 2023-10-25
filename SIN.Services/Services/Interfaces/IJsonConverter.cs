using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SIN.Services.Services.Interfaces
{
    public interface IJsonConverterService
    {
        byte[] ConvertArrayToJson<T>(IEnumerable<T> values);
    }
}
