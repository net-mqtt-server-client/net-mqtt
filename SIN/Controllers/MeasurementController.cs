using Microsoft.AspNetCore.Mvc;
using SIN.Domain.Entities;
using SIN.Services.Services.Interfaces;

namespace SIN.Controllers
{
    /// <summary>
    /// Controller for requests connected with <see cref="Measurement"/>.
    /// </summary>
    [ApiController]
    [Route("api/measurements")]
    public class MeasurementController : ControllerBase
    {
        private readonly IMeasurementService service;

        /// <summary>
        /// Initializes a new instance of the <see cref="MeasurementController"/> class.
        /// </summary>
        /// <param name="service">Service for <see cref="Measurement"/>.</param>
        public MeasurementController(IMeasurementService service)
        {
            this.service = service;
        }

        /// <summary>
        /// Gets all measurements using given filters.
        /// </summary>
        /// <param name="location">Location filter.</param>
        /// <param name="sensor">Sensor filter.</param>
        /// <param name="orderBy">Which column to sort by.</param>
        /// <param name="order">Sorting order.</param>
        /// <param name="number">How many objects to take.</param>
        /// <returns>List of sorted and filterd measurements.</returns>
        [HttpGet]
        [Route("")]
        public async Task<IActionResult> GetAll(
            [FromQuery(Name = "location")] string location = "",
            [FromQuery(Name = "sensor")] string sensor = "",
            [FromQuery(Name = "orderBy")] string orderBy = "",
            [FromQuery(Name = "order")] string order = "",
            [FromQuery(Name = "number")] string number = "")
        {
            return this.Ok(await this.service.GetMeasurements(location, sensor, orderBy, order, number));
        }

        /// <summary>
        /// Gets all measurements using given filters as JSON file.
        /// </summary>
        /// <param name="location">Location filter.</param>
        /// <param name="sensor">Sensor filter.</param>
        /// <param name="orderBy">Which column to sort by.</param>
        /// <param name="order">Sorting order.</param>
        /// <param name="number">How many objects to take.</param>
        /// <returns>JSON file with sorted and filterd measurements.</returns>
        [HttpGet]
        [Route("json")]
        public async Task GetAllJson(
            [FromQuery(Name = "location")] string location = "",
            [FromQuery(Name = "sensor")] string sensor = "",
            [FromQuery(Name = "orderBy")] string orderBy = "",
            [FromQuery(Name = "order")] string order = "",
            [FromQuery(Name = "number")] string number = "")
        {
            this.Response.StatusCode = StatusCodes.Status200OK;
            this.Response.ContentType = "text/json ;charset=utf-8";
            this.Response.Headers.Add("Content-Disposition", "attachment; filename = data.json");
            await this.Response.Body.WriteAsync(await this.service.GetMeasurementsJson(location, sensor, orderBy, order, number));
        }

        /// <summary>
        /// Gets all measurements using given filters as CSV file.
        /// </summary>
        /// <param name="location">Location filter.</param>
        /// <param name="sensor">Sensor filter.</param>
        /// <param name="orderBy">Which column to sort by.</param>
        /// <param name="order">Sorting order.</param>
        /// <param name="number">How many objects to take.</param>
        /// <returns>CSV file with sorted and filterd measurements.</returns>
        [HttpGet]
        [Route("csv")]
        public async Task GetAllCsv(
            [FromQuery(Name = "location")] string location = "",
            [FromQuery(Name = "sensor")] string sensor = "",
            [FromQuery(Name = "orderBy")] string orderBy = "",
            [FromQuery(Name = "order")] string order = "",
            [FromQuery(Name = "number")] string number = "")
        {
            this.Response.StatusCode = StatusCodes.Status200OK;
            this.Response.ContentType = "text/csv ;charset=utf-8";
            this.Response.Headers.Add("Content-Disposition", "attachment; filename = data.csv");
            await this.Response.Body.WriteAsync(await this.service.GetMeasurementsCsv(location, sensor, orderBy, order, number));
        }
    }
}
