function twoFloat32ArraysToPythonByteLiteralLittleEndian(arr1, arr2) {
    if (arr1.length !== arr2.length) {
      throw new Error("Both arrays must have the same length.");
    }
    
    const rows = arr1.length;
    const cols = 2; // two columns
    // Each float32 takes 4 bytes.
    const buffer = new ArrayBuffer(rows * cols * 4);
    const view = new DataView(buffer);
    
    // Write the floats into the buffer row by row.
    // For each row, the first element is from arr1 and the second from arr2.
    for (let i = 0; i < rows; i++) {
      view.setFloat32((i * cols + 0) * 4, arr1[i], true); // little-endian
      view.setFloat32((i * cols + 1) * 4, arr2[i], true); // little-endian
    }
    
    // Create the Python-style byte literal.
    const bytes = new Uint8Array(buffer);
    let result = "b'";
    for (let byte of bytes) {
      // Append as a printable ASCII character if possible.
      if (byte >= 32 && byte <= 126 && byte !== 92 && byte !== 39) {
        result += String.fromCharCode(byte);
      } else {
        // Otherwise, use a hex escape sequence.
        result += "\\x" + byte.toString(16).padStart(2, '0');
      }
    }
    result += "'";
    return result;
  }  

function convertToByteArray(array1, array2) {
    //if (arr1.length !== arr2.length) {
    //    throw new Error("Both arrays must have the same length.");
    //  }// Merge both DBL arrays into a single array
    const rows = arr1.length;
    const cols = 2; // two columns
    // Each float32 takes 4 bytes.
    const buffer = new ArrayBuffer(rows * cols * 4);
    const view = new DataView(buffer);
    
    // Write the floats into the buffer row by row.
    // For each row, the first element is from arr1 and the second from arr2.
    for (let i = 0; i < rows; i++) {
      view.setFloat32((i * cols + 0) * 4, arr1[i], true); // little-endian
      view.setFloat32((i * cols + 1) * 4, arr2[i], true); // little-endian
    }
    
    // Create the Python-style byte literal.
    const bytes = new Uint8Array(buffer);
    let pythonByteArray = "b'";
    for (let byte of bytes) {
      // Append as a printable ASCII character if possible.
      if (byte >= 32 && byte <= 126 && byte !== 92 && byte !== 39) {
        pythonByteArray += String.fromCharCode(byte);
      } else {
        // Otherwise, use a hex escape sequence.
        pythonByteArray += "\\x" + byte.toString(16).padStart(2, '0');
      }
    }
    pythonByteArray += "'";
    return pythonByteArray;
}

function reverseByteArrayToDoubles(byteArrayString) {
    let dblArray = [];
    let bytePairs = byteArrayString.match(/\\x([a-f0-9]{2})/g); // Match each byte in the format \xXX

    if (bytePairs) {
        // Process the byte pairs 4 bytes at a time (since we're using Float32)
        for (let i = 0; i < bytePairs.length; i += 4) {
            let hexBytes = bytePairs.slice(i, i + 4).map(pair => pair.substring(2, 4));  // Get 4 bytes at a time
            let hexString = hexBytes.join('');
            let intRepresentation = parseInt(hexString, 16); // Convert from hex to decimal

            // Convert back to float using DataView (32-bit float)
            let buffer = new ArrayBuffer(4);
            let view = new DataView(buffer);
            view.setUint32(0, intRepresentation, true); // Write the integer value as 32-bit integer to the buffer
            let dblValue = view.getFloat32(0, true); // Read the 32-bit float from the buffer

            dblArray.push(dblValue);  // Add the float back to the array
        }
    }

    // Automatically determine rows and columns
    const cols = 3; // Set this to the number of columns you want (based on the structure of your input)
    const rows = dblArray.length / cols;

    // Convert flat array back to a 2D array of the calculated shape (rows x cols)
    let result2DArray = [];
    for (let i = 0; i < rows; i++) {
        result2DArray.push(dblArray.slice(i * cols, (i + 1) * cols));
    }

    // Return two 1D arrays in a JSON object
    let row1 = result2DArray[0] || [];
    let row2 = result2DArray[1] || [];

    let out = JSON.stringify({ row1, row2 });
    return out ;
}
//function processByteArray(byteArray) {
//    const ByteArray = convertToAsciiByteArray(byteArray);
//    const result =`Converted byte array: ${ByteArray}`;
//    return result;
//}