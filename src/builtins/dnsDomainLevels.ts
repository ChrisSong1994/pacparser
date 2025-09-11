/**
 * 返回主机名中 DNS 域名级别的整数数量（域名中包含点的个数）。
 */
export function dnsDomainLevels(host: string): number {
  const match = host.match(/\./g);
  let levels = 0;
  if (match) {
    levels = match.length;
  }
  return levels;
}
