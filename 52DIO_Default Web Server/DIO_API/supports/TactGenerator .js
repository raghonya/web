class EdgeDetector {
  constructor(impulseIntervalMs, impulseDurationMs) {
    this.impulseIntervalMs = impulseIntervalMs; // Interval between impulses
    this.impulseDurationMs = impulseDurationMs; // Duration of each impulse
    this.state = false;                         // Initial state (false = low, true = high)
    this.timer = null;                          // Timer object
  }

  // Start the impulse generator
  start() {
    if (this.timer === null) {
      this.timer = setInterval(() => {
        this.triggerImpulse();
      }, this.impulseIntervalMs);
    }
  }

  // Trigger an impulse
  triggerImpulse() {
    // Rising edge
    this.state = true;  // Set state to high
    console.log(true);  // Output true on rising edge
    setTimeout(() => {
      // Falling edge
      this.state = false; // Set state to low
      console.log(false); // Output false on falling edge
    }, this.impulseDurationMs);
  }

  // Stop the impulse generator
  stop() {
    if (this.timer !== null) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }
}