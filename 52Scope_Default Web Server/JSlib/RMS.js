function calculateRMS(values) {
    const n = values.length;
    if (n === 0) {
        return 0; // Handl empty list case
    }

    const squareSum = values.reduce((sum, x) => sum + x ** 2, 0); // Sum of squares of each element
    const rms = Math.sqrt(squareSum / n); // Calculate RMS value

    return rms;
}