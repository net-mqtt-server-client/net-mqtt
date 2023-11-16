using SIN.Domain.Entities;

namespace SIN.Services.Converters.Interfaces
{
    /// <summary>
    /// Interface for converting data to CSV format.
    /// </summary>
    public interface ICsvConverter
    {
        /// <summary>
        /// Converts collection of <see cref="Measurement"/> to byte array representing collection data in CSV format.
        /// </summary>
        /// <param name="values">Collection of measurement.</param>
        /// <returns>Byte array represting CSV file.</returns>
        byte[] ConvertCollectionToCsv(IEnumerable<Measurement> values);
    }
}
