using MongoDB.Driver;
using SIN.Infrastructure.Context.Interfaces;
using SIN.Domain.Entities;
using Microsoft.Extensions.Configuration;

namespace SIN.Infrastructure.Context
{
    /// <summary>
    /// Application context implementing <see cref="IApplicationContext"/>.
    /// </summary>
    public class ApplicationContext : IApplicationContext
    {
        /// <summary>
        /// Database.
        /// </summary>
        private readonly IMongoDatabase db;

        /// <summary>
        /// Configuration.
        /// </summary>
        private readonly IConfiguration configuration;

        /// <summary>
        /// Initializes a new instance of the <see cref="ApplicationContext"/> class.
        /// </summary>
        /// <param name="config">Mongo DB connection configs.</param>
        public ApplicationContext(IConfiguration config)
        {
            this.configuration = config;
            var connectionString = this.configuration.GetConnectionString("MongoDB");
            var dbName = this.configuration.GetSection("MongoDB:Database").Value;
            this.db = new MongoClient(connectionString).GetDatabase(dbName);
            this.Measurements = this.db.GetCollection<Measurement>("Measurements");
        }

        /// <inheritdoc/>
        public IMongoCollection<Measurement> Measurements { get; set; }
    }
}
