using SIN.Domain.Entities;

namespace SIN.Services.Converters
{
    /// <summary>
    /// Interface for converting data to JSON format.
    /// </summary>
    public interface IJsonConverter
    {
        /// <summary>
        /// Converts collection of <see cref="Measurement"/> to byte array representing collection data in JSON format.
        /// </summary>
        /// <param name="values">Collection of measurement.</param>
        /// <returns>Byte array represting JSON file.</returns>
        byte[] ConvertCollectionToJson(IEnumerable<Measurement> values);
    }
}
