import vm from "vm";
import fs from "fs";

import {
  isPlainHostName,
  dnsDomainIs,
  localHostOrDomainIs,
  isResolvable,
  isInNet,
  dnsResolve,
  convert_addr,
  myIpAddress,
  shExpMatch,
  dnsDomainLevels,
  weekdayRange,
  dateRange,
  timeRange,
  alter,
} from "./builtins";
import { isHttpUrl } from "./helper";

class Pacparser {
  private sandbox: any;
  private context: any;
  constructor() {
    this.sandbox = this.createSandbox();
    this.context = vm.createContext(this.sandbox);
  }

  /**
   * create sandbox with pac builtin functions
   */
  createSandbox() {
    return {
      isPlainHostName,
      dnsDomainIs,
      localHostOrDomainIs,
      isResolvable,
      isInNet,
      dnsResolve,
      convert_addr,
      myIpAddress,
      dnsDomainLevels,
      shExpMatch,
      weekdayRange,
      dateRange,
      timeRange,
      alter,
      FindProxyForURL: null,
      console: {
        log: (...args) => console.log("[PAC]", ...args),
        error: (...args) => console.error("[PAC]", ...args),
      },
    };
  }

  /**
   * 根据 pac 内容创建沙箱环境
   */
  compile(pacString: string) {
    try {
      const wrappedCode = `
                (function() {
                    ${pacString}
                    return FindProxyForURL;
                })()
            `;
      const script = new vm.Script(wrappedCode);
      const findProxyFunc = script.runInContext(this.context);

      if (typeof findProxyFunc !== "function") {
        throw new Error("PAC script cannot find FindProxyForURL function");
      }

      this.context.FindProxyForURL = findProxyFunc;
    } catch (error) {
      throw new Error(`PAC script exec fail: ${error.message}`);
    }
  }

  /**
   * 从本机加载 pac 文件
   * @param {string} pacPath - PAC 文件路径
   * */
  loadPacFile(pacPath: string) {
    const pacString = fs.readFileSync(pacPath, "utf-8");
    this.compile(pacString);
    return this;
  }

  /**
   * 从 http  url 加载 pac 文件
   */
  async loadPacUrl(url: string) {
    if (!isHttpUrl(url)) throw new Error("url is not http url");
    const pacString = await fetch(url).then((res) => res.text());
    this.compile(pacString);
    return this;
  }
  /**
   * 解析 PAC 字符串（直接传入 PAC 脚本内容）
   * param {string} pacCode - PAC 脚本字符串
   * */
  loadPacString(pacString) {
    this.compile(pacString);
    return this;
  }

  /**
   * 获取指定 URL 的代理配置
   * @param {string} url - 目标 URL
   * @param {string} [host] - 主机名（可选，默认从 URL 提取）
   * @returns {string} 代理配置（如 "PROXY proxy:port; DIRECT"）
   */
  findProxyForURL(url: string, host?: string) {
    try {
      // 如果未提供host，从URL解析
      if (!host) {
        try {
          const urlObj = new URL(url);
          host = urlObj.hostname;
        } catch (e) {
          throw new Error(`无效的URL: ${url}`);
        }
      }

      // 调用PAC中的函数
      return this.context.FindProxyForURL(url, host);
    } catch (error) {
      throw new Error(`Failed to call FindProxyForURL: ${error.message}`);
    }
  }
}

export * from "./builtins";

export default Pacparser;
