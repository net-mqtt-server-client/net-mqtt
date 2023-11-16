using MongoDB.Driver;
using SIN.Domain.Entities;

namespace SIN.Infrastructure.Context.Interfaces
{
    /// <summary>
    /// Interface for application context.
    /// </summary>
    public interface IApplicationContext
    {
        /// <summary>
        /// Gets or sets measurements collection.
        /// </summary>
        IMongoCollection<Measurement> Measurements { get; set; }
    }
}
