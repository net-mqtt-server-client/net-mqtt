namespace SIN.Domain.Entities
{
    /// <summary>
    /// Entity representing sensor measurement in specified location.
    /// </summary>
    public class Measurement
    {
        /// <summary>
        /// Gets or sets measurement id.
        /// </summary>
        public Guid Id { get; set; }

        /// <summary>
        /// Gets or sets location of sensor.
        /// </summary>
        required public string Location { get; set; }

        /// <summary>
        /// Gets or sets sensor type.
        /// </summary>
        required public string Sensor { get; set; }

        /// <summary>
        /// Gets or sets measurement value.
        /// </summary>
        public float Value { get; set; }

        /// <summary>
        /// Gets or sets measurement datetime.
        /// </summary>
        public DateTime TimeStamp { get; set; }
    }
}