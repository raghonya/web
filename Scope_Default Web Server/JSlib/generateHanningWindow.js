

function generateHanningWindow(N) {
    if (N <= 0) {
        throw new Error("The number of samples (N) must be a positive integer.");
    }

    const window = [];
    for (let n = 0; n < N; n++) {
        const value = 0.5 * (1 - Math.cos((2 * Math.PI * n) / (N - 1)));
        window.push(value);
    }
    return window;
}