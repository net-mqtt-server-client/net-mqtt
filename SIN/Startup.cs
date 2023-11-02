using SIN.Hubs;
using SIN.Infrastructure.Context;
using SIN.Infrastructure.Context.Interfaces;
using SIN.Infrastructure.Repositories;
using SIN.Infrastructure.Repositories.Interfaces;
using SIN.Services.Converters;
using SIN.Services.Services;
using SIN.Services.Services.Interfaces;
using SIN.Subscribers;

namespace SIN
{
    /// <summary>
    /// Start up class.
    /// </summary>
    public class Startup
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="Startup"/> class.
        /// </summary>
        /// <param name="configuration">Configuration object.</param>
        public Startup(IConfiguration configuration)
        {
            this.Configuration = configuration;
        }

        /// <summary>
        /// Gets configuration for solution.
        /// </summary>
        public IConfiguration Configuration { get; }

        /// <summary>
        /// Configures services for entire application.
        /// </summary>
        /// <param name="services">Collection of services to configure.</param>
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddSingleton<IApplicationContext, ApplicationContext>();
            services.AddScoped<IMeasurementRepository, MeasurementRepository>();
            services.AddScoped<IMeasurementService, MeasurementService>();
            services.AddScoped<IJsonConverter, JsonConverter>();
            services.AddScoped<ICsvConverter, CsvConverter>();
            services.AddHostedService<MqttSubscriber>();
            services.AddControllers();
            services.AddCors();
            services.AddLogging();
            services.AddSignalR();
        }

        /// <summary>
        /// Main application configuration.
        /// </summary>
        /// <param name="app">Application builder.</param>
        /// <param name="env">Application environment.</param>
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            app.UseHttpsRedirection();
            app.UseCors(x => x.AllowAnyHeader().AllowAnyMethod().WithOrigins(this.Configuration.GetSection("CORS").Get<string>() ?? throw new InvalidDataException("frontend link not found")));

            app.UseRouting();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapHub<HubClient>(this.Configuration.GetSection("Hub:Endpoint").Get<string>());
                endpoints.MapControllerRoute(
                    name: "default",
                    pattern: "{controller}/{action=Index}/{id?}");
            });
        }
    }
}
