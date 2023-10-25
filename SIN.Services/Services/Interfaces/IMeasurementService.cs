using SIN.Domain.Entities;

namespace SIN.Services.Services.Interfaces
{
    public interface IMeasurementService
    {
        Task<IEnumerable<Measurement>> GetMeasurements();

        Task<byte[]> GetMeasurementsJson();

        Task<byte[]> GetMeasurementsCsv();
    }
}
