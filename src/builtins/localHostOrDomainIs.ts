/**
 * 完整域名匹配或主机名（如www）匹配时返回 true。
 * host 从 URL 中得到的主机名。
 * hostdom 完整域名
 */
export function localHostOrDomainIs(host: string, hostdom: string) {
  const parts = host.split(".");
  const domparts = hostdom.split(".");
  let matches = true;

  for (let i = 0; i < parts.length; i++) {
    if (parts[i] !== domparts[i]) {
      matches = false;
      break;
    }
  }

  return matches;
}
