using Microsoft.Extensions.Configuration;
using MongoDB.Driver;
using SIN.Domain.Entities;
using SIN.Infrastructure.Context.Interfaces;

namespace SIN.Infrastructure.Context
{
    /// <summary>
    /// Application context implementing <see cref="IApplicationContext"/>.
    /// </summary>
    public class ApplicationContext : IApplicationContext
    {
        private readonly IMongoDatabase db;

        private readonly IConfiguration configuration;

        /// <summary>
        /// Initializes a new instance of the <see cref="ApplicationContext"/> class.
        /// </summary>
        /// <param name="config">Mongo DB connection configs.</param>
        public ApplicationContext(IConfiguration config)
        {
            this.configuration = config;
            var connectionString = this.configuration.GetConnectionString("MongoDB");
            var dbName = this.configuration.GetSection("MongoDB:Database").Get<string>();
            this.db = new MongoClient(connectionString).GetDatabase(dbName);
            this.Measurements = this.db.GetCollection<Measurement>("Measurements");
        }

        /// <inheritdoc/>
        public IMongoCollection<Measurement> Measurements { get; set; }
    }
}
