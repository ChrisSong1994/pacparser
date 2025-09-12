import dns from "dns";
import fs from "node:fs/promises";
import deasync from "deasync";
import { GMT } from "./types";
import { IP_REGEXP } from "./constants";

export const lookupSync = deasync(dns.lookup);

export function isValidIpAddress(ip: string) {
  const matches = IP_REGEXP.exec(ip);
  if (matches == null) {
    return false;
  } else if (
    Number(matches[1]) > 255 ||
    Number(matches[2]) > 255 ||
    Number(matches[3]) > 255 ||
    Number(matches[4]) > 255
  ) {
    return false;
  }
  return true;
}

/**
 * 将IP地址转换为整数
 */
export function ipToInt(ip: string) {
  if (!isValidIpAddress(ip)) {
    throw new Error("Invalid IP address");
  }
  const match = ip.match(IP_REGEXP);
  const octets = match.slice(1).map(Number);
  const result = octets
    .map((octet, index, arr) => {
      return octet * Math.pow(256, arr.length - index - 1);
    })
    .reduce((prev, curr) => {
      return prev + curr;
    });

  return result;
}

/**
 * 是否是GMT
 * */
export function isGMT(v?: string): v is GMT {
  return v === "GMT";
}

/**
 * is http url
 */
export function isHttpUrl(url: string) {
  return /^https?:\/\//.test(url);
}

export function isWinPath(path: string) {
  return /^(?<ParentPath>(?:[a-zA-Z]\:|\\\\[\w\s\.]+\\[\w\s\.$]+)\\(?:[\w\s\.]+\\)*)(?<BaseName>[\w\s\.]*?)$/.test(
    path
  );
}

export function isUnixPath(path: string) {
  return /^(.+)\/([^\/]+)$/.test(path);
}

/**
 * is local path
 */
export function isFilePath(path: string) {
  return isWinPath(path) || isUnixPath(path);
}

/**
 * is  pac code
 * */
export function isPacCode(code: string) {
  const reg = /function\s+FindProxyForURL\s*\(\s*[^)]*\s*\)\s*\{/;
  return reg.test(code);
}

/**
 * load pac file
 */
export async function loadPacFile(pacPath: string) {
  const pac = await fs.readFile(pacPath, { encoding: "utf-8" });
  return pac;
}

/**
 * load pac url
 */
export async function loadPacUrl(url: string) {
  const pac = await fetch(url).then((res) => res.text());
  return pac;
}
