import { dnsResolve } from "./dnsResolve";
/**
 * Tries to resolve the hostname. Returns true if succeeds.
 *
 * @param {String} host is the hostname from the URL.
 * @return {Boolean}
 */
export function isResolvable(host: string) {
  try {
    return dnsResolve(host) != null;
  } catch (e) {
    return false;
  }
}
