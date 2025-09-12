<h1 style="color: #0969da;">Pacparser</h1>

A library to parse proxy auto-config (PAC) files in Node.js.

It run pac script in a Node.js vm and execute findProxy method.

## Installation

```bash
npm install pacparser
```

## Usage

You can create a new instance of Pacparser and load a PAC file like this:

```javascript
import Pacparser from "pacparser";
const pacParser = new Pacparser();
pacParser.parsePac("https://proxy.example.com/proxy.pac");
const proxy = await pacParser.findProxy("https://direct.mozilla.org");
```

Or like this:

```javascript
import Pacparser from "pacparser";
const pacParser = Pacparser.create(path.join(__dirname, "./proxy.pac"));
await pacParser.findProxy("https://direct.mozilla.org"); // returns "DIRECT"
```

You can input a pac source (filepath or url or pac script) by

```javascript
new Pacparser(pac); // return a new instance
Pacparser.create(pac); // return a new instance , same as new Pacparser(pac)
pacParser.parsePac(path); // switch pac source by call parsePac() in pacParser instance
```

And then you can find proxy by call findProxy()

```javascript
await pacParser.findProxy(url); // return a promise
await pacParser.findProxy("https://direct.mozilla.org"); // returns "DIRECT"
```

## API

### `Pacparser`

The main class.

### _`static`_ `Pacparser.create(path?string)`

Create a new instance of Pacparser.

### `pacparser.parsePac(pac:string)`: `pacparser instance`

switch pac source (filepath or url or pac script) by call parsePac() in pacParser instance,
it return the pacparser instance, so you can chain call.

```js
pacParser.parsePac(path.join(__dirname, "./proxy.pac")).findProxy("https://direct.mozilla.org");
```

### `pacparser.findProxy(url)` : `Promise<string>`

Find the proxy for a given URL.

### `pacparser.cleanup()`

Cleanup the pacparser instance pac source

### `pacparser.getPacSource()`

Get pac source in pacparser instance

### `pacparser.getPacCode()`

Get pac code in pacparser instance

### `pacparser.reload()`

If pac source is changed,it will reload pac source

## License

[MIT](LICENSE.md)
