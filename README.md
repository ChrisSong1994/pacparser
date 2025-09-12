<h1 style="color: #0969da;">Pacparser</h1>

A library to parse proxy auto-config (PAC) files in Node.js.

It run pac script in a Node.js vm and execute findProxy method.

## Installation

```bash
npm install pacparser # use in node.js
npm install pacparser -g # use as a command line tool
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

## CLI

### `pacparser exec`

You can use pacparser as a cli tool to parse pac file.

```bash 
pacparser exec --pac './proxy.pac' --findproxy https://www.google.com # DIRECT
# Or use shortcut command
pap exec -p './proxy.pac' -f https://www.google.com # DIRECT

pap exec -p  'function FindProxyForURL(url, host) {
  if (
    (isPlainHostName(host) || dnsDomainIs(host, ".mozilla.org")) &&
    !localHostOrDomainIs(host, "www.mozilla.org") &&
    !localHostOrDomainIs(host, "merchant.mozilla.org") &&
    !localHostOrDomainIs(host, "www.google.com")
  ) {
    return "DIRECT";
  } else {
    return "PROXY w3proxy.mozilla.org:8080; DIRECT";
  }
}' -f https://www.google.com  # PROXY w3proxy.mozilla.org:8080; DIRECT

pap exec -p  http://localhost:3000/proxy.pac -f https://www.google.com  # DIRECT
```

### `pacparser builtin functions`

```bash
pap builtin -f isPlainHostName -i www.google.com  # false
pap builtin -f isResolvable -i www.google.com  # true
pap builtin -f isInNet -i www.google.com,192.168.1.0,255.255.255.0 # false
pap builtin -f isInNet -i "192.168.1.1","192.168.1.0","255.255.255.0" # true
pap builtin -f myIpAddress  # 192.168.1.65
```

## API

### `Pacparser`

The main class.

### `static` `Pacparser.create(path?string)`

Create a new instance of Pacparser.

### `pacparser.parsePac(pac:string)`: `pacparser instance`

switch pac source (filepath or url or pac script) by call parsePac() in pacParser instance,
it return the pacparser instance, so you can chain call.

```js
const pacParser = Pacparser.create();
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

## Builtin functions

Pacparser provides some builtin functions to help you write your pac script.
you can read more about them in [Proxy Auto-Configuration (PAC) file](<[builtin.js](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Proxy_servers_and_tunneling/Proxy_Auto-Configuration_PAC_file#predefined_functions_and_environment)>)

```javascript
import {
  isPlainHostName,
  dnsDomainIs,
  localHostOrDomainIs,
  isResolvable,
  isInNet,
  dnsResolve,
  convert_addr,
  myIpAddress,
  shExpMatch,
  dnsDomainLevels,
  weekdayRange,
  dateRange,
  timeRange,
  alter,
} from "pacparser";

isPlainHostName("www.mozilla.org"); // false
isPlainHostName("www"); // true
dnsDomainIs("www.mozilla.org", ".mozilla.org") // true
localHostOrDomainIs("www.mozilla.org", "www.mozilla.org") // true (exact match)
isResolvable("www.mozilla.org") // true
dateRange(1, "JUN", 1995, 15, "AUG", 1995);
isInNet("192.168.1.1", "192.168.1.0", "255.255.255.0")
convert_addr("192.0.2.172"); // returns the decimal number 1745889538
dnsDomainLevels("www.mozilla.org"); // 2
...
```

## License

[MIT](LICENSE.md)
