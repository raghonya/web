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
