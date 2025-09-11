
/**
 * 如果字符串匹配指定的 Shell 表达式则返回 true。
 * str 任何要比较的字符串（如 URL 或主机名）。
 * shexp 要用来对比的 Shell 表达式。
 */
export function shExpMatch(str: string, shexp: string) {
  let regex = shexp
    .replace(/\./g, "\\.")
    .replace(/\*/g, ".*")
    .replace(/\?/g, ".")
    .replace(/\//g, "\\/");
  return new RegExp(`^${regex}$`).test(str);
}
