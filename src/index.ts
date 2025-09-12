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
import { isHttpUrl, isFilePath, isPacCode, loadPacFile, loadPacUrl } from "./helper";

class Pacparser {
  private sandbox: any;
  private context: any;
  private pacString: string; // parse pac code
  private pacOriginal: string; // original pac file path or pac code or url
  private pacSourceMap = new Map(); // pac 文件路径 => pac 源代码
  constructor(pac?: string) {
    this.sandbox = this.createSandbox();
    this.context = vm.createContext(this.sandbox);
    this.pacOriginal = pac;
  }

  static create(pac?: string) {
    const pacparser = new Pacparser(pac);
    return pacparser;
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
   * 切换 PAC 脚本
   * */
  public parsePac(pac: string) {
    this.pacOriginal = pac;
    return this;
  }

  /**
   * 获取当前 PAC 脚本
   */
  public getPacCode() {
    return this.pacString;
  }
  /**
   * 获取当前 PAC 来源
   */
  public getPacSource() {
    return this.pacOriginal;
  }

  /**
   *  重新加载 PAC 脚本
   */
  public async reload() {
    await this.parse(this.pacOriginal);
  }

  /**
   * 解析 PAC 脚本
   */
  private async parse(pac: string) {
    if (isHttpUrl(pac)) {
      this.pacString = await loadPacUrl(pac);
    } else if (isFilePath(pac)) {
      this.pacString = await loadPacFile(pac);
    } else if (isPacCode(pac)) {
      this.pacString = pac;
    } else {
      throw new Error("Invalid pac code");
    }
    this.pacSourceMap.set(pac, this.pacString);
    this.compile(this.pacString);
  }

  /**
   * 获取指定 URL 的代理配置
   * @param {string} url - 目标 URL
   * @param {string} [host] - 主机名（可选，默认从 URL 提取）
   * @returns {string} 代理配置（如 "PROXY proxy:port; DIRECT"）
   */
  async findProxy(url: string, host?: string) {
    // if no pac
    if (!this.pacOriginal) {
      throw new Error("PAC script not loaded");
    }

    // if un parse pac or pac string change
    if (
      !this.pacSourceMap.has(this.pacOriginal) ||
      this.pacString !== this.pacSourceMap.get(this.pacOriginal)
    ) {
      await this.parse(this.pacOriginal);
    }

    try {
      // 如果未提供host，从URL解析
      if (!host) {
        try {
          const urlObj = new URL(url);
          host = urlObj.hostname;
        } catch (e) {
          throw new Error(`Invalid url: ${url}`);
        }
      }

      // 调用PAC中的函数
      return this.context.FindProxyForURL(url, host);
    } catch (error) {
      throw new Error(`Failed to call FindProxyForURL: ${error.message}`);
    }
  }

  public cleanup() {
    this.sandbox = null;
    this.context = null;
    this.pacString = null;
    this.pacOriginal = null;
    this.pacSourceMap.clear();
  }
}

export * from "./builtins";

export default Pacparser;
