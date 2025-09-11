import { ipToInt } from "../helper";

/**
 * 将 IP 地址转换为 32 位整数地址。
 * */
export function convert_addr(ip: string) {
  return ipToInt(ip);
}
