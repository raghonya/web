function convertToByteArray(arr1, arr2) {
	//if (arr1.length !== arr2.length) {
	//    throw new Error("Both arrays must have the same length.");

	//  }// Merge both DBL arrays into a single array
	const rows = arr1.length;
	// Create a Float32Array with two columns per row.
	const floatArray = new Float32Array(rows * 2);
	console.log(`arrays are  ${arr1.slice(0, 10)} and ${arr2.slice(0, 10)}`)

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
	console.log(`result is ${pythonByteArray}`)
	console.error(`result is ${pythonByteArray}`)
	return pythonByteArray;
}
/**
 * Parses a Python bytes literal string (e.g. "b'B\\xaf\\xcc4\\x00'")
 * and returns a Uint8Array representing the actual bytes.
 */
function parsePythonBytesLiteral(pyStr) {
	// Remove the leading "b'" (or b") and trailing quote.
	if ((pyStr.startsWith("b'") && pyStr.endsWith("'")) ||
		(pyStr.startsWith('b"') && pyStr.endsWith('"'))) {
	  pyStr = pyStr.slice(2, -1);
	} else {
	  console.log(`Invalid first #${pystr.slice(0, 10)}# and invalid last  #${pystr.slice(-10, -1)}#`);
	  throw new Error(``);
	}
	
	const bytes = [];
	for (let i = 0; i < pyStr.length; i++) {
	  const ch = pyStr[i];
	  if (ch === '\\') {
		i++; // Move to the character after the backslash.
		if (i >= pyStr.length) {
		  throw new Error("Incomplete escape sequence in string");
		}
		const next = pyStr[i];
		if (next === 'x') {
		  // Handle hex escape: expect exactly two hex digits.
		  if (i + 2 >= pyStr.length) {
			throw new Error("Incomplete hex escape sequence");
		  }
		  const hex = pyStr.substring(i + 1, i + 3);
		  const byteVal = parseInt(hex, 16);
		  if (isNaN(byteVal)) {
			throw new Error("Invalid hex escape sequence");
		  }
		  bytes.push(byteVal);
		  i += 2; // Skip the two hex digits.
		} else if (next === '\\') {
		  bytes.push('\\'.charCodeAt(0));
		} else if (next === "'") {
		  bytes.push("'".charCodeAt(0));
		} else if (next === '"') {
		  bytes.push('"'.charCodeAt(0));
		} else if (next === 'n') {
		  bytes.push('\n'.charCodeAt(0));
		} else if (next === 'r') {
		  bytes.push('\r'.charCodeAt(0));
		} else if (next === 't') {
		  bytes.push('\t'.charCodeAt(0));
		} else {
		  // For any other escape, simply add the character code.
		  bytes.push(next.charCodeAt(0));
		}
	  } else {
		// Regular character – add its code.
		bytes.push(ch.charCodeAt(0));
	  }
	}
	return new Uint8Array(bytes);
  }
  
  /**
   * Given a Python bytes literal string representing a 2D array of float32 values
   * (with two floats per row in little-endian order), this function returns a
   * Float32Array that concatenates the first and second columns with a separator between.
   *
   * @param {string} str - Python bytes literal string (e.g. "b'B\\xaf\\xcc4\\x00...'").
   * @param {number} separator - A numeric separator to insert between the two columns.
   * @returns {Float32Array} - A typed array of floats.
   */
  function convertToFloatArrays(str, separator) {
	// Convert the Python-style byte literal string to a Uint8Array.
	const byteArray = parsePythonBytesLiteral(str);
	
	// Create a Float32Array view over the same buffer.
	// (Assumes the environment uses little-endian storage.)
	const floatArray = new Float32Array(
	  byteArray.buffer, 
	  byteArray.byteOffset, 
	  byteArray.length / 4
	);
	
	const channel0 = [];
	const channel1 = [];
	// Iterate row by row (each row has 2 float32 numbers).
	for (let i = 0; i < floatArray.length; i += 2) {
	  channel0.push(floatArray[i]);     // First column value.
	  channel1.push(floatArray[i + 1]);   // Second column value.
	}
	
	// Combine the two channels with the separator in between.
	const returnFloatArray = new Float32Array(channel0.concat([separator]).concat(channel1));
	// Convert the combined array into a typed Float32Array.
	return (returnFloatArray);
  }