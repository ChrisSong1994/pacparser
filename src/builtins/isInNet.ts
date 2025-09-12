import { isValidIpAddress } from "../helper";
import { dnsResolve } from "./dnsResolve";
import { convert_addr } from "./convert_addr";
export function isInNet(ip: string, pattern: string, maskstr: string) {
  if (!isValidIpAddress(pattern) || !isValidIpAddress(maskstr)) {
    return false;
  }
  if (!isValidIpAddress(ip)) {
    ip = dnsResolve(ip);
    if (ip == null) {
      return false;
    }
  }
  const host = convert_addr(ip);
  const pat = convert_addr(pattern);
  const mask = convert_addr(maskstr);
  return (host & mask) == (pat & mask);
}
