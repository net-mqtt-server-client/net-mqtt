using System.Text;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using MQTTnet;
using MQTTnet.Client;
using SIN.Domain.Entities;
using SIN.Domain.Repositories.Interfaces;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using System.Globalization;

namespace SIN.Services.Services
{
    /// <summary>
    /// Service for handling MQTT messages.
    /// </summary>
    public class MqttSubscriberService : IDisposable, IHostedService
    {
        private readonly IMqttClient client;
        private readonly MqttClientOptions options;
        private readonly string[] topics;
        private readonly IMeasurementRepository measurementRepository;
        private readonly IConfiguration configuration;
        private readonly ILogger logger;

        /// <summary>
        /// Initializes a new instance of the <see cref="MqttSubscriberService"/> class.
        /// </summary>
        /// <param name="serviceProvider">Service provider to inject <see cref="IMeasurementRepository"/>.</param>
        /// <param name="configuration">Configuration object.</param>
        /// <param name="logger">Logger.</param>
        public MqttSubscriberService(IConfiguration configuration,
                                     ILogger<MqttSubscriberService> logger,
                                     IServiceProvider serviceProvider)
        {
            this.client = new MqttFactory().CreateMqttClient();
            this.client.ConnectedAsync += this.ConnectionHandler;
            this.client.DisconnectedAsync += this.DisconnectionHandler;
            this.client.ApplicationMessageReceivedAsync += this.MessageReceivedHandler;
            this.options = new MqttClientOptionsBuilder().WithTcpServer("localhost", 1883).WithClientId("client1").Build();
            using (var scope = serviceProvider.CreateScope())
            {
                this.measurementRepository = scope.ServiceProvider.GetService<IMeasurementRepository>()!;
            }
            this.configuration = configuration;
            this.topics = this.configuration.GetSection("topics").Get<string[]>() ?? throw new InvalidDataException("There are no topics in the configuration");
            this.logger = logger;
        }

        /// <inheritdoc/>
        public void Dispose()
        {
            this.client.Dispose();
        }

        /// <inheritdoc/>
        public async Task StartAsync(CancellationToken cancellationToken)
        {
            try
            {
                await this.client.ConnectAsync(this.options, cancellationToken);
            }
            catch
            {
               this.logger.LogInformation($"Connecting to MQTT broker failed.");
            }
        }

        /// <inheritdoc/>
        public async Task StopAsync(CancellationToken cancellationToken)
        {
            await this.client.DisconnectAsync(cancellationToken: cancellationToken);
        }

        /// <summary>
        /// Handler for connection event.
        /// </summary>
        /// <param name="args">Arguments for event.</param>
        /// <returns>Async void.</returns>
        private async Task ConnectionHandler(MqttClientConnectedEventArgs args)
        {
            var subscribeOptions = new MqttClientSubscribeOptionsBuilder();
            foreach (var topic in this.topics)
            {
                subscribeOptions.WithTopicFilter(new MqttTopicFilterBuilder().WithTopic(topic).Build());
            }

            await this.client.SubscribeAsync(subscribeOptions.Build());
            this.logger.LogInformation($"Connected to MQTT broker.");
        }

        /// <summary>
        /// Handler for disconnection event.
        /// </summary>
        /// <param name="args">Arguments for event.</param>
        /// <returns>Async void.</returns>
        private async Task DisconnectionHandler(MqttClientDisconnectedEventArgs args)
        {
            await Task.Delay(TimeSpan.FromSeconds(5));
            try
            {
                await this.client.ConnectAsync(this.options, CancellationToken.None);
            }
            catch
            {
                this.logger.LogInformation($"Reconnecting to MQTT broker failed.");
            }

            this.logger.LogInformation($"Disconnected from MQTT broker.");
        }

        /// <summary>
        /// Handler for message receive event.
        /// </summary>
        /// <param name="args">Arguments for event.</param>
        /// <returns>Async void.</returns>
        private async Task MessageReceivedHandler(MqttApplicationMessageReceivedEventArgs args)
        {
            if (!float.TryParse(Encoding.UTF8.GetString(args.ApplicationMessage.PayloadSegment), CultureInfo.InvariantCulture, out float value))
            {
                throw new InvalidDataException("value is not float");
            }

            var location = args.ApplicationMessage.Topic.Split('_')[1].Split('/')[0];
            var sensor = args.ApplicationMessage.Topic.Split('_')[1].Split('/')[1];

            await this.measurementRepository.SaveMeasurementAsync(new Measurement { Id = Guid.NewGuid(), Location = location, Sensor = sensor, Value = value });
            this.logger.LogInformation($"Received message on topic '{args.ApplicationMessage.Topic}': {Encoding.UTF8.GetString(args.ApplicationMessage.PayloadSegment)}");
        }
    }
}
