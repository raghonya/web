function convertToPythonByteArray(array1, array2) {
    // Merge both arrays into a 2D array, then flatten
    const flattenedArray = [...array1, ...array2];

    // Convert to Float32Array
    const float32Array = new Float32Array(flattenedArray);

    // Create a byte array from the Float32Array
    const byteArray = new Uint8Array(float32Array.buffer);

    // Convert to a Python-compatible bytearray string
    const pythonByteArray = "b'" + Array.from(byteArray)
        .map(byte => `\\x${byte.toString(16).padStart(2, '0')}`)
        .join('') + "'";

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