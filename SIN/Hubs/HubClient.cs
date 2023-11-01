using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Logging;

namespace SIN.Services.Hubs
{
    /// <summary>
    /// SignalR client.
    /// </summary>
    public class HubClient : Hub
    {
        /// <summary>
        /// Logger.
        /// </summary>
        private readonly ILogger logger;

        /// <summary>
        /// Initializes a new instance of the <see cref="HubClient"/> class.
        /// </summary>
        /// <param name="logger">Logger object.</param>
        public HubClient(ILogger<HubClient> logger)
        {
            this.logger = logger;
        }

        /// <inheritdoc/>
        public override async Task OnConnectedAsync()
        {
            await Task.Run(() => this.logger.LogInformation($"Client ${this.Context.ConnectionId} connected."));
        }
    }
}
