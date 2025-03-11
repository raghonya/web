function calculateRMS(signal) {
    let dcOffset = calculateDCOffset(signal);
    let sumOfSquares = signal.reduce((sum, value) => sum + (value - dcOffset) ** 2, 0);
    return Math.sqrt(sumOfSquares / signal.length);
}