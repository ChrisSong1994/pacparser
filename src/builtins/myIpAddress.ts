import os from "os";
import { LOCALHOST_IP} from "../constants"
/**
 * 获取当前 Firefox 所在设备的 IP 地址，并返回为标准格式的 IP 地址字符串。
 */
export function myIpAddress() {
  // 获取所有网络接口
  const interfaces = os.networkInterfaces();

  // 遍历所有网络接口
  for (const interfaceName in interfaces) {
    const iface = interfaces[interfaceName];

    // 遍历接口的所有地址
    for (const alias of iface) {
      // 过滤出IPv4地址，排除环回地址和内部地址
      if (alias.family === "IPv4" && !alias.internal && alias.address !== LOCALHOST_IP) {
        return alias.address;
      }
    }
  }

  // 如果没有找到合适的IP地址，尝试返回环回地址
  return LOCALHOST_IP;
}