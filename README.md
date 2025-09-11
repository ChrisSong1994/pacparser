<h1 style="color: #0969da;">Pacparser</h1>

A library to parse proxy auto-config (PAC) files in Node.js.

It run pac script in a Node.js vm and execute findProxyForURL method.

## Installation

```bash
npm install pacparser
```

## Usage

```javascript
import Pacparser from "pacparser";
const pacParser = new Pacparser();
pacParser.loadPacFile(path.join(__dirname, "./proxy.pac"));
pacParser.findProxyForURL("https://direct.mozilla.org"); // returns "DIRECT"
```

## API

### `Pacparser`

The main class.

### `pacparser.loadPacFile(path)`

Load a PAC file from a path.

### `pacparser.loadPacScript(script)`

Load a PAC script.

### `pacparser.loadPacUrl(url)`

Load a PAC script from a URL. And returns a promise .

### `pacparser.findProxyForURL(url)`

Find the proxy for a given URL.

## License

[MIT](LICENSE.md)
