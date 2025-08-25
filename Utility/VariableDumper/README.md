# Variable Dumper

Use the `dump` function on any webpage without modifying the page source.

---

## Quick Copy Bookmarklet
```javascript
javascript:(async()=>{
     const code = await fetch('https://github.com/benzonati/bookmarklets/raw/refs/heads/main/Utility/VariableDumper/main.js').then(r=>r.text());
     eval(code);
 })();
```
## Then run the following in console
```javascript
dump(window);
```


---

## Usage
1. Create a new bookmark in your browser.
2. Set the bookmark's **URL** to the code above.
3. Click the bookmark on any page. `dump` will be available globally in the console.

---

### Example
To dump `document` instead of `window`:
```javascript
dump(document);
````
