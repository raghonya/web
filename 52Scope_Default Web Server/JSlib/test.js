function b(signal) {
    if (!Array.isArray(signal)) {
        return 0; //  Ensure it returns 0 instead of undefined or error
    }
    let a = Object.prototype.toString.call(signal);
    return a;

    let maxVal = Math.max(...signal);
    let minVal = Math.min(...signal);
    let amplitude = (maxVal - minVal) / 2; // Peak Amplitude


}