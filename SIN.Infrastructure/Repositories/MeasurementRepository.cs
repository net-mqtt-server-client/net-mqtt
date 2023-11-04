using MongoDB.Driver;
using MongoDB.Driver.Linq;
using SIN.Domain.Entities;
using SIN.Infrastructure.Context.Interfaces;
using SIN.Infrastructure.Repositories.Interfaces;

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
        public async Task<IEnumerable<Measurement>> GetByFiltersAsync(string location, string sensor, string orderBy, string order, string number)
        {
            var measurements = this.context.Measurements.AsQueryable();
            if (!string.IsNullOrEmpty(location))
            {
                measurements = measurements.Where(m => m.Location == location);
            }

            if (!string.IsNullOrEmpty(sensor))
            {
                measurements = measurements.Where(m => m.Sensor == sensor);
            }

            if (!string.IsNullOrEmpty(orderBy))
            {
                if (string.IsNullOrEmpty(order) || order == "asc")
                {
                    if (orderBy == "location")
                    {
                        measurements = measurements.OrderBy(m => m.Location);
                    }
                    else if (orderBy == "sensor")
                    {
                        measurements = measurements.OrderBy(m => m.Sensor);
                    }
                    else if (orderBy == "timestamp")
                    {
                        measurements = measurements.OrderBy(m => m.TimeStamp);
                    }
                    else if (orderBy == "value")
                    {
                        measurements = measurements.OrderBy(m => m.Value);
                    }
                }
                else if (order == "desc")
                {
                    if (orderBy == "location")
                    {
                        measurements = measurements.OrderByDescending(m => m.Location);
                    }
                    else if (orderBy == "sensor")
                    {
                        measurements = measurements.OrderByDescending(m => m.Sensor);
                    }
                    else if (orderBy == "timestamp")
                    {
                        measurements = measurements.OrderByDescending(m => m.TimeStamp);
                    }
                    else if (orderBy == "value")
                    {
                        measurements = measurements.OrderByDescending(m => m.Value);
                    }
                }
            }

            if (!string.IsNullOrEmpty(number))
            {
                int.TryParse(number, out int num);
                measurements = measurements.Take(num);
            }

            return await measurements.ToListAsync();
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
