// Signal Analysis Functions

function calculateRMS(signal) { 
    let dcOffset = calculateDCOffset(signal);
    let sumOfSquares = signal.reduce((sum, value) => sum + (value - dcOffset) ** 2, 0);
    return Math.sqrt(sumOfSquares / signal.length);
}

function calculateFrequencyAutocorrelation(signal, samplingRate) {
    let n = signal.length;
    let autocorr = new Array(n).fill(0);

    // Compute autocorrelation
    for (let lag = 0; lag < n; lag++) {
        for (let i = 0; i < n - lag; i++) {
            autocorr[lag] += signal[i] * signal[i + lag];
        }
    }

    // Find the first peak (not at lag=0)
    let peakLag = 1;
    for (let i = 1; i < n - 1; i++) {
        if (autocorr[i] > autocorr[i - 1] && autocorr[i] > autocorr[i + 1]) {
            peakLag = i;
            break;
        }
    }

    // Calculate frequency
    let period = peakLag / samplingRate;
    let frequency = 1 / period;
    
    return frequency;
}

function calculateDCOffset(signal) {
    let sum = signal.reduce((total, value) => total + value, 0);
    let offset = sum / signal.length;
    return offset;
}

function calculateAmplitude(signal) {
    if (signal.length < 2) return 0;

    let maxVal = Math.max(...signal);
    let minVal = Math.min(...signal);
    let amplitude = (maxVal - minVal) / 2; // Peak Amplitude

    return amplitude;
}

function formatValue(value) {
    const prefixes = [
        { factor: 1e-6, suffix: "µ" },
        { factor: 1e-3, suffix: "m" },
        { factor: 1, suffix: "" },
        { factor: 1e3, suffix: "k" },
        { factor: 1e6, suffix: "M" },
        { factor: 1e9, suffix: "G" }
    ];

    for (let i = prefixes.length - 1; i >= 0; i--) {
        if (Math.abs(value) >= prefixes[i].factor) {
            return (value / prefixes[i].factor).toFixed(2) + " " + prefixes[i].suffix;
        }
    }
    return value.toFixed(2);
}

function analyzeSignal(signal, samplingRate) {
    const amplitude = formatValue(calculateAmplitude(signal));
    const frequency = formatValue(calculateFrequencyAutocorrelation(signal, samplingRate));
    const dcOffset = formatValue(calculateDCOffset(signal));
    const rms = formatValue(calculateRMS(signal));

    const result = `Amplitude: ${amplitude}, Frequency: ${frequency}, DC Offset: ${dcOffset}, RMS: ${rms}`;
    return result;
}
