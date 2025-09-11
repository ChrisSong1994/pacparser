export const demo1 = `
function FindProxyForURL(url, host) {
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
}
`;

export const demo2 = `
function FindProxyForURL(url, host) {
  if (isResolvable(host)) return "DIRECT";
  else return "PROXY proxy.mydomain.com:8080";
}
  `;

export const demo3 = `
function FindProxyForURL(url, host) {
  if (
    isPlainHostName(host) ||
    dnsDomainIs(host, ".mydomain.com") ||
    isResolvable(host)
  ) {
    return "DIRECT";
  } else {
    return "PROXY proxy.mydomain.com:8080";
  }
}
  `;

export const demo4 = `
function FindProxyForURL(url, host) {
  if (
    isPlainHostName(host) ||
    dnsDomainIs(host, ".mydomain.com") ||
    isInNet(host, "198.95.0.0", "255.255.0.0")
  ) {
    return "DIRECT";
  } else {
    return "PROXY proxy.mydomain.com:8080";
  }
}
  `;

export const demo5 = `
function FindProxyForURL(url, host) {
  if (isPlainHostName(host) || dnsDomainIs(host, ".mydomain.com"))
    return "DIRECT";
  else if (shExpMatch(host, "*.com"))
    return (
      "PROXY proxy1.mydomain.com:8080; " + "PROXY proxy4.mydomain.com:8080"
    );
  else if (shExpMatch(host, "*.edu"))
    return (
      "PROXY proxy2.mydomain.com:8080; " + "PROXY proxy4.mydomain.com:8080"
    );
  else
    return (
      "PROXY proxy3.mydomain.com:8080; " + "PROXY proxy4.mydomain.com:8080"
    );
}

`;

export const demo6 = `
function FindProxyForURL(url, host) {

  if (url.startsWith("http:"))
    return "PROXY http-proxy.mydomain.com:8080";

  else if (url.startsWith("ftp:"))
    return "PROXY ftp-proxy.mydomain.com:8080";

  else if (url.startsWith(“gopher:"))
    return "PROXY gopher-proxy.mydomain.com:8080";

  else if (url.startsWith("https:") || url.startsWith("snews:"))
    return "PROXY security-proxy.mydomain.com:8080";

  else
    return "DIRECT";

}
`;
