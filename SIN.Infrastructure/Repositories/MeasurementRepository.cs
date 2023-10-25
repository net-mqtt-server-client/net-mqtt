using MongoDB.Driver;
using SIN.Infrastructure.Context.Interfaces;
using SIN.Domain.Entities;
using SIN.Domain.Repositories.Interfaces;

namespace SIN.Infrastructure.Repositories
{
    /// <summary>
    /// Repository implementing <see cref="IMeasurementRepository"/>.
    /// </summary>
    public class MeasurementRepository : IMeasurementRepository
    {
        private readonly IApplicationContext context;

        /// <summary>
        /// Initializes a new instance of the <see cref="MeasurementRepository"/> class.
        /// </summary>
        /// <param name="context">Application context.</param>
        public MeasurementRepository(IApplicationContext context)
        {
            this.context = context;
        }

        /// <inheritdoc/>
        public async Task<IEnumerable<Measurement>> GetAllAsync()
        {
            return await this.context.Measurements.Find(_ => true).ToListAsync();
        }

        /// <inheritdoc/>
        public async Task<Measurement> GetByIdAsync(Guid id)
        {
            return await this.context.Measurements.Find(m => m.Id == id).FirstOrDefaultAsync();
        }

        /// <inheritdoc/>
        public async Task SaveMeasurementAsync(Measurement measurement)
        {
            await this.context.Measurements.InsertOneAsync(measurement);
        }
    }
}
