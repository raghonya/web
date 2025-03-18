function convertToByteArray(array1, array2) {
    //if (arr1.length !== arr2.length) {
    //    throw new Error("Both arrays must have the same length.");
    
    //  }// Merge both DBL arrays into a single array
    const rows = arr1.length;
    // Create a Float32Array with two columns per row.
    const floatArray = new Float32Array(rows * 2);

    // Fill the Float32Array with arr1 values in the first column and arr2 values in the second.
    for (let i = 0; i < rows; i++) {
        floatArray[2 * i] = arr1[i];
        floatArray[2 * i + 1] = arr2[i];
    }

    // Convert the underlying ArrayBuffer into a Uint8Array to access individual bytes.
    const bytes = new Uint8Array(floatArray.buffer);

    // Build a Python-style byte literal.
    let pythonByteArray = "b'";
    for (let byte of bytes) {
        // Append as a character if the byte is a printable ASCII character (excluding backslash and single quote)
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