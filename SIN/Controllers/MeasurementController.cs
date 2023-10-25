using Microsoft.AspNetCore.Mvc;
using SIN.Services.Services.Interfaces;

namespace SIN.Controllers
{
    [ApiController]
    [Route("measurements")]
    public class MeasurementController : ControllerBase
    {
        private readonly IMeasurementService service;

        public MeasurementController(IMeasurementService service)
        {
            this.service = service;
        }

        [HttpGet]
        [Route("")]
        public async Task<IActionResult> GetAll()
        {
            return this.Ok(await this.service.GetMeasurements());
        }

        [HttpGet]
        [Route("json")]
        public async Task GetAllJson()
        {
            this.Response.StatusCode = StatusCodes.Status200OK;
            this.Response.ContentType = "text/json ;charset=utf-8";
            this.Response.Headers.Add("Content-Disposition", "attachment; filename = data.json");
            await this.Response.Body.WriteAsync(await this.service.GetMeasurementsJson());
        }

        [HttpGet]
        [Route("csv")]
        public async Task GetAllCsv()
        {
            this.Response.StatusCode = StatusCodes.Status200OK;
            this.Response.ContentType = "text/csv ;charset=utf-8";
            this.Response.Headers.Add("Content-Disposition", "attachment; filename = data.csv");
            await this.Response.Body.WriteAsync(await this.service.GetMeasurementsCsv());
        }
    }
}
