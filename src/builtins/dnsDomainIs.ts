/**
 * url 和 domain 匹配
 */
export function dnsDomainIs(host: string, domain: string) {
  return host.length >= domain.length && host.substring(host.length - domain.length) == domain;
}
