using SIN.Domain.Entities;

namespace SIN.Services.Services.Interfaces
{
    /// <summary>
    /// Interface for <see cref="Measurement"/> service.
    /// </summary>
    public interface IMeasurementService
    {
        /// <summary>
        /// Asynchronically gets all measurements from database.
        /// </summary>
        /// <param name="location">Location filter.</param>
        /// <param name="sensor">Sensor filter.</param>
        /// <param name="orderBy">Which column to sort by.</param>
        /// <param name="order">Sorting order.</param>
        /// <param name="number">How many objects to take.</param>
        /// <returns>List of measurements.</returns>
        Task<IEnumerable<Measurement>> GetMeasurements(string location, string sensor, string orderBy, string order, string number);

        /// <summary>
        /// Asynchronically returns all measurements from database as .json file.
        /// </summary>
        /// <param name="location">Location filter.</param>
        /// <param name="sensor">Sensor filter.</param>
        /// <param name="orderBy">Which column to sort by.</param>
        /// <param name="order">Sorting order.</param>
        /// <param name="number">How many objects to take.</param>
        /// <returns>File as byte array.</returns>
        Task<byte[]> GetMeasurementsJson(string location, string sensor, string orderBy, string order, string number);

        /// <summary>
        /// Asynchronically returns all measurements from database as .csv file.
        /// </summary>
        /// <param name="location">Location filter.</param>
        /// <param name="sensor">Sensor filter.</param>
        /// <param name="orderBy">Which column to sort by.</param>
        /// <param name="order">Sorting order.</param>
        /// <param name="number">How many objects to take.</param>
        /// <returns>File as byte array.</returns>
        Task<byte[]> GetMeasurementsCsv(string location, string sensor, string orderBy, string order, string number);
    }
}
