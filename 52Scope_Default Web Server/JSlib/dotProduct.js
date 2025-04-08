function dotProduct(X, Y) {
    // Check if both vectors have the same length
    if (X.length !== Y.length) {
      throw new Error('Vectors must be of the same length');
    }
  
    // Initialize the dot product result
    let dotProductResult = 0;
  
    // Compute the dot product
    for (let i = 0; i < X.length; i++) {
      dotProductResult += X[i] * Y[i];
    }
  
    return dotProductResult;
  }