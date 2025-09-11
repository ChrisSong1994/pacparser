/**
 * 当且仅当主机名中没有域名时为真（没有分隔域名的点）
 */
export function isPlainHostName(host: string) {
  return host === host.replace(/\..*/, "");
}
