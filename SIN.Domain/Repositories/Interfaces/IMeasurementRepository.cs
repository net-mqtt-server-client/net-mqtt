using SIN.Domain.Entities;

namespace SIN.Domain.Repositories.Interfaces
{
    /// <summary>
    /// Interface for <see cref="Measurement"/> repo.
    /// </summary>
    public interface IMeasurementRepository
    {
        /// <summary>
        /// Gets single measurement from database by id.
        /// </summary>
        /// <param name="id">Measurement id to be searched by.</param>
        /// <returns>Task with measurement, null if there is no measurement with such id.</returns>
        Task<Measurement> GetByIdAsync(Guid id);

        /// <summary>
        /// Gets all measurements from database.
        /// </summary>
        /// <returns>task with the list of all measurements.</returns>
        Task<IEnumerable<Measurement>> GetAllAsync();

        /// <summary>
        /// Saves single measurement in database.
        /// </summary>
        /// <param name="measurement">Measurement to be saved.</param>
        /// <returns>A <see cref="Task"/> representing the asynchronous operation.<</returns>
        Task SaveMeasurementAsync(Measurement measurement);
    }
}
