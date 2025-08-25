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
};

function dumpVariable(obj, maxDepth = 3, currentDepth = 0, path = '') {
  if (obj === null) return 'null';
  if (obj === undefined) return 'undefined';
  if (typeof obj !== 'object') return obj.toString();

  if (currentDepth >= maxDepth) return Array.isArray(obj) ? '[Array]' : '[Object]';

  const indent = '  '.repeat(currentDepth);
  let result = Array.isArray(obj) ? '[\n' : '{\n';

  try {
    for (const key in obj) {
      if (obj.hasOwnProperty(key) && key !== 'vardump') {
        try {
          const value = obj[key];
          const fullPath = path ? `${path}.${key}` : key;
          const valueDump = dumpVariable(value, maxDepth, currentDepth + 1, fullPath);

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
    }
  } catch (e) {
    result += `${indent}  [Error accessing properties: ${e.message}],\n`;
  }

  result += `${indent}}`;
  if (Array.isArray(obj)) {
    result = result.replace('{', '[').replace('}', ']');
  }

  return result;
}

function dump(obj, maxDepth = 3) {
  console.log(`Dumping variable: ${obj?.constructor?.name || typeof obj}`);
  copySafe(dumpVariable(obj, maxDepth));
  console.log("Copied dump to clipboard!");
}

window.vardump = dump;
console.log("Variable dumper loaded!\nUsage:\nvardump('variable');");
