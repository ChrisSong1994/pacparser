import { lookupSync } from "../helper";

/**
 * 使用同步 DNS 解析（Node.js 需 v10+，或用 dns.lookupSync）
 */
export function dnsResolve(host): string | null {
  try {
    const addresses = lookupSync(host, { family: 4 });
    return addresses;
  } catch (e) {
    return null;
  }
}
