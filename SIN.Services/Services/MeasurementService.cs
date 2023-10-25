using SIN.Domain.Entities;
using SIN.Domain.Repositories.Interfaces;
using SIN.Services.Services.Interfaces;

namespace SIN.Services.Services
{
    public class MeasurementService : IMeasurementService
    {
        private readonly IMeasurementRepository repository;

        private readonly IJsonConverterService jsonConverterService;

        private readonly ICsvConverterService csvConverterService;

        public MeasurementService(IMeasurementRepository repository,
                                  IJsonConverterService JsonConverterService,
                                  ICsvConverterService csvConverterService)
        {
            this.repository = repository;
            this.jsonConverterService = JsonConverterService;
            this.csvConverterService = csvConverterService;
        }

        public async Task<IEnumerable<Measurement>> GetMeasurements()
        {
            return await this.repository.GetAllAsync();
        }

        public async Task<byte[]> GetMeasurementsJson()
        {
            return this.jsonConverterService.ConvertArrayToJson(await this.repository.GetAllAsync());
        }

        public async Task<byte[]> GetMeasurementsCsv()
        {
            return this.csvConverterService.ConvertArrayToCsv(await this.repository.GetAllAsync());
        }
    }
}
