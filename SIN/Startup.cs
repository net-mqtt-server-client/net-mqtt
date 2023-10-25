using Microsoft.AspNetCore.HttpLogging;
using Microsoft.Extensions.Logging.Console;
using Microsoft.Extensions.Logging.Debug;
using Microsoft.Extensions.Logging.EventSource;
using Microsoft.Extensions.Logging.TraceSource;
using SIN.Domain.Repositories.Interfaces;
using SIN.Infrastructure.Context;
using SIN.Infrastructure.Context.Interfaces;
using SIN.Infrastructure.Repositories;
using SIN.Services.Services;
using SIN.Services.Services.Interfaces;

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
            services.AddScoped<IJsonConverterService, JsonConverterService>();
            services.AddScoped<ICsvConverterService, CsvConverterService>();
            services.AddHostedService<MqttSubscriberService>();
            services.AddControllers();
            services.AddCors();
            services.AddLogging();
            services.AddHttpLogging((logging) =>
            {
                logging.LoggingFields = HttpLoggingFields.All;
                logging.RequestHeaders.Add("sec-ch-ua");
                logging.ResponseHeaders.Add("MyResponseHeader");
                logging.MediaTypeOptions.AddText("application/javascript");
                logging.RequestBodyLogLimit = 4096;
                logging.ResponseBodyLogLimit = 4096;
            });
        }

        /// <summary>
        /// Main application configuration.
        /// </summary>
        /// <param name="app">Application builder.</param>
        /// <param name="env">Application environment.</param>
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            app.UseHttpsRedirection();
            app.UseCors(x => x.AllowAnyHeader().AllowAnyMethod().WithOrigins(this.Configuration.GetSection("Frontend").Value!));

            app.UseAuthentication();
            app.UseRouting();
            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllerRoute(
                    name: "default",
                    pattern: "{controller}/{action=Index}/{id?}");
            });
        }
    }
}
