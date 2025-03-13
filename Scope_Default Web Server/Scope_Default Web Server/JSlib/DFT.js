function DFT(inputArray) {
    const N = inputArray.length;
    const outputArray = [];
    const twoPi = 2 * Math.PI;

    for (let k = 0; k < N; k++) {
        let real = 0;
        let imag = 0;
        for (let n = 0; n < N; n++) {
            const angle = (twoPi * k * n) / N;
            real += inputArray[n] * Math.cos(angle);
            imag -= inputArray[n] * Math.sin(angle);
        }
        outputArray[k] = { real: real, imag: imag };
    }
    return outputArray;
}