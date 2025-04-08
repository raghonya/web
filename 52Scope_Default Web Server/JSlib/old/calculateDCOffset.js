function calculateDCOffset(signal) {
    let sum = signal.reduce((total, value) => total + value, 0);
    let offset = sum / signal.length;
    return offset;
}