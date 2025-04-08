function calculateMean(numbers) {
    if (numbers.length === 0) return 0; // Handle empty array

    // Calculate the sum of all numbers
    const sum = numbers.reduce((accumulator, currentValue) => accumulator + currentValue, 0);

    // Calculate the mean
    const mean = sum / numbers.length;
    
    return mean;
}