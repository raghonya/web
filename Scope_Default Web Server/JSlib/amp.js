class AmplitudeAndLevels {
    constructor(waveform) {
      this.waveform = waveform;
    }
  
    // Helper function to calculate the amplitude and state levels
    calculateAmplitude(stateSetting, histogramSize = 10) {
      // Determine state levels based on method selected
      let highStateLevel, lowStateLevel;
  
      switch (stateSetting) {
        case 0: // Histogram
          [highStateLevel, lowStateLevel] = this.histogramMethod(histogramSize);
          break;
        case 1: // Peak
          [highStateLevel, lowStateLevel] = this.peakMethod();
          break;
        case 2: // Auto Select
          [highStateLevel, lowStateLevel] = this.autoSelectMethod(histogramSize);
          break;
        default:
          throw new Error("Invalid stateSetting value. Use 0, 1, or 2.");
      }
  
      // Calculate the amplitude
      const amplitude = highStateLevel - lowStateLevel;
  
      return {
        amplitude,
        highStateLevel,
        lowStateLevel
      };
    }
  
    // Histogram method: Finds the upper and lower 40% of the peak-to-peak range
    histogramMethod(histogramSize) {
      const waveformMin = Math.min(...this.waveform);
      const waveformMax = Math.max(...this.waveform);
      const peakToPeakRange = waveformMax - waveformMin;
      const upperRegionThreshold = waveformMin + 0.6 * peakToPeakRange;
      const lowerRegionThreshold = waveformMin + 0.4 * peakToPeakRange;
  
      // Find the maximum and minimum in the upper and lower regions
      const upperRegion = this.waveform.filter(value => value >= upperRegionThreshold);
      const lowerRegion = this.waveform.filter(value => value <= lowerRegionThreshold);
  
      const highStateLevel = Math.max(...upperRegion);
      const lowStateLevel = Math.min(...lowerRegion);
  
      return [highStateLevel, lowStateLevel];
    }
  
    // Peak method: Finds the absolute maximum and minimum values of the waveform
    peakMethod() {
      const highStateLevel = Math.max(...this.waveform);
      const lowStateLevel = Math.min(...this.waveform);
  
      return [highStateLevel, lowStateLevel];
    }
  
    // Auto Select method: Selects histogram if possible, otherwise uses peak method
    autoSelectMethod(histogramSize) {
      const histogramResult = this.histogramMethod(histogramSize);
      const [highStateLevel, lowStateLevel] = histogramResult;
  
      // If the histogram provides valid levels (i.e., both levels are within the waveform's range),
      // return the result, otherwise fall back to peak method
      if (highStateLevel !== undefined && lowStateLevel !== undefined) {
        return [highStateLevel, lowStateLevel];
      } else {
        return this.peakMethod();
      }
    }
  }