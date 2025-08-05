/**
 * Workaround for Node.js JSON.stringify bug that produces malformed JSON
 * missing commas between properties and array elements
 */
export function fixMalformedJson(malformedJson: string): string {
  // Handle both object properties and array elements
  // Pattern: "value""property": -> "value","property":
  // Pattern: }"{ -> },{
  // Pattern: }] -> }]
  
  let fixed = malformedJson;
  
  // Fix missing commas between object properties
  // Match: "value""property": or null"property": or true"property": or false"property": or number"property":
  fixed = fixed.replace(/("(?:[^"\\]|\\.)*"|null|true|false|\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)("[\w_]+"\s*:)/g, '$1,$2');
  
  // Fix missing commas between array elements (objects)
  // Match: }{ -> },{
  fixed = fixed.replace(/\}\{/g, '},{');
  
  // Fix missing commas between object properties where closing brace is followed by quote
  // Match: }"property": -> },"property":
  fixed = fixed.replace(/\}("[\w_]+"\s*:)/g, '},$1');
  
  return fixed;
}

/**
 * Safe JSON response sender that handles the malformed JSON bug
 */
export function sendJsonResponse(res: any, data: any, statusCode: number = 200): void {
  try {
    const malformedJson = JSON.stringify(data);
    const fixedJson = fixMalformedJson(malformedJson);
    
    res.setHeader('Content-Type', 'application/json');
    res.status(statusCode).send(fixedJson);
  } catch (error) {
    console.error('Error in sendJsonResponse:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
