import dnsLookupSync from "dns-lookup-sync";

/**
 * 使用同步 DNS 解析（Node.js 需 v10+，或用 dns.lookupSync）
 */
export function dnsResolve(host): string | null {
  try {
    // @ts-ignore
    const result = dnsLookupSync(host, { family: 4 });
    return result?.address;
  } catch (e) {
    return null;
  }
}
