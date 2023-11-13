using SIN.Domain.Entities;
using SIN.Infrastructure.Repositories.Interfaces;
using SIN.Services.Converters.Interfaces;
using SIN.Services.Services.Interfaces;

namespace SIN.Services.Services
{
    /// <summary>
    /// Service implementing <see cref="IMeasurementService"/>.
    /// </summary>
    public class MeasurementService : IMeasurementService
    {
        private readonly IMeasurementRepository repository;

        private readonly IJsonConverter jsonConverter;

        private readonly ICsvConverter csvConverter;

        /// <summary>
        /// Initializes a new instance of the <see cref="MeasurementService"/> class.
        /// </summary>
        /// <param name="repository">Repository for <see cref="Measurement"/>.</param>
        /// <param name="jsonConverter">Converter to json format.</param>
        /// <param name="csvConverter">Converter to csv format.</param>
        public MeasurementService(
            IMeasurementRepository repository,
            IJsonConverter jsonConverter,
            ICsvConverter csvConverter)
        {
            this.repository = repository;
            this.jsonConverter = jsonConverter;
            this.csvConverter = csvConverter;
        }

        /// <inheritdoc/>
        public async Task<IEnumerable<Measurement>> GetMeasurements(string location, string sensor, string orderBy, string order, string number)
        {
            return await this.repository.GetByFiltersAsync(location, sensor, orderBy, order, number);
        }

        /// <inheritdoc/>
        public async Task<byte[]> GetMeasurementsJson(string location, string sensor, string orderBy, string order, string number)
        {
            return this.jsonConverter.ConvertCollectionToJson(await this.repository.GetByFiltersAsync(location, sensor, orderBy, order, number));
        }

        /// <inheritdoc/>
        public async Task<byte[]> GetMeasurementsCsv(string location, string sensor, string orderBy, string order, string number)
        {
            return this.csvConverter.ConvertCollectionToCsv(await this.repository.GetByFiltersAsync(location, sensor, orderBy, order, number));
        }
    }
}
