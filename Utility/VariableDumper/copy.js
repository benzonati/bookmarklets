function copySafe(str, space = 2) {
  const el = document.createElement('textarea');
  el.value = str;
  document.body.appendChild(el);
  el.select();
  try {
    document.execCommand('copy');
    console.log('Copied dump to clipboard!');
  } catch (err) {
    console.error('Failed to copy:', err);
  }
  document.body.removeChild(el);
}

function dumpVariable(obj, visited = new WeakSet(), path = '', depth = 0) {
  if (obj === null) return 'null';
  if (obj === undefined) return 'undefined';
  if (typeof obj !== 'object') return JSON.stringify(obj);
  
  if (visited.has(obj)) {
    return `[Circular: ${path || 'root'}]`;
  }
  
  visited.add(obj);
  
  const indent = '  '.repeat(depth);
  let result = Array.isArray(obj) ? '[\n' : '{\n';
  
  try {
    const properties = Object.getOwnPropertyNames(obj);
    
    for (const key of properties) {
      if (key === 'vardump') continue;
      
      try {
        const value = obj[key];
        const fullPath = path ? `${path}.${key}` : key;
        const valueDump = dumpVariable(value, visited, fullPath, depth + 1);
        
        if (Array.isArray(obj)) {
          result += `${indent}  ${valueDump},\n`;
        } else {
          result += `${indent}  ${key}: ${valueDump},\n`;
        }
      } catch (e) {
        if (Array.isArray(obj)) {
          result += `${indent}  [Error: ${e.message}],\n`;
        } else {
          result += `${indent}  ${key}: [Error: ${e.message}],\n`;
        }
      }
    }
  } catch (e) {
    result += `${indent}  [Error: ${e.message}],\n`;
  }
  
  result += `${indent}}`;
  if (Array.isArray(obj)) {
    result = result.replace('{', '[').replace('}', ']');
  }
  
  visited.delete(obj);
  return result;
}

function dump(obj) {
  console.log(`Dumping variable: ${obj?.constructor?.name || typeof obj}`);
  copySafe(dumpVariable(obj));
  console.log("Copied dump to clipboard!");
}

window.vardump = dump;
console.log("Variable dumper loaded!\nUsage:\nvardump('variable');");
