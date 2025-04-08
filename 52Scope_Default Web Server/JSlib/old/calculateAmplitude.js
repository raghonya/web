function calculateAmplitude(signal) {
    if (signal.length < 2) return 0;

    let maxVal = Math.max(...signal);
    let minVal = Math.min(...signal);
    let amplitude = (maxVal - minVal) / 2; // Peak Amplitude

    return amplitude;
}