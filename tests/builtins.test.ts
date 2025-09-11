import { describe, expect, test, beforeEach, afterEach, vi } from "vitest";
import {
  isPlainHostName,
  convert_addr,
  isResolvable,
  localHostOrDomainIs,
  dnsResolve,
  myIpAddress,
  dnsDomainLevels,
  shExpMatch,
  weekdayRange,
  dateRange,
  timeRange,
  isInNet,
  dnsDomainIs,
} from "../src";
import { isValidIpAddress } from "../src/helper";

describe("builtin_funcs tests", () => {
  // 在每个测试前设置假定时器
  beforeEach(() => {
    vi.useFakeTimers();
  });

  // 在每个测试后恢复真实定时器
  afterEach(() => {
    vi.useRealTimers();
  });

  test("isPlainHostName", () => {
    expect(isPlainHostName("www")).toBe(true);
    expect(isPlainHostName("www.google.com")).toBe(false);
  });

  test("dnsDomainIs", () => {
    expect(dnsDomainIs("www", ".netscape.com")).toBe(false);
    expect(dnsDomainIs("www.netscape.com", ".netscape.com")).toBe(true);
    expect(dnsDomainIs("www.mozilla.com", ".netscape.com")).toBe(false);
  });

  test("localHostOrDomainIs", () => {
    expect(localHostOrDomainIs("www.mozilla.org", "www.mozilla.org")).toBe(true);
    expect(localHostOrDomainIs("www", "www.google.com")).toBe(true);
    expect(localHostOrDomainIs("www.google.com", "www.mozilla.org")).toBe(false);
    expect(localHostOrDomainIs("home.mozilla.org", "www.mozilla.org")).toBe(false);
  });

  test("isResolvable", () => {
    expect(isResolvable("www.mozilla.org")).toBe(true);
    expect(isResolvable("www.google.com")).toBe(true);
    expect(isResolvable("www.xxxxxxxxxxx.com")).toBe(false);
  });

  test("dnsResolve", () => {
    expect(isValidIpAddress(dnsResolve("www.mozilla.org") as string)).toBe(true);
    expect(isValidIpAddress(dnsResolve("www.google.com") as string)).toBe(true);
    expect(dnsResolve("www.xxxxxxxxxxx.com")).toBe(null);
  });

  test("convert_addr", () => {
    expect(convert_addr("104.16.41.2")).toBe(1745889538);
    expect(convert_addr("192.168.1.1")).toBe(3232235777);
    expect(convert_addr("8.8.8.8")).toBe(134744072);
    expect(convert_addr("127.0.0.1")).toBe(2130706433);
  });

  test("myIpAddress", () => {
    expect(isValidIpAddress(myIpAddress())).toBe(true);
  });

  test("dnsDomainLevels", () => {
    expect(dnsDomainLevels("www.google.com")).toBe(2);
    expect(dnsDomainLevels("google.com")).toBe(1);
    expect(dnsDomainLevels("com")).toBe(0);
  });

  test("shExpMatch", () => {
    expect(shExpMatch("http://home.netscape.com/people/ari/index.html", "*/ari/*")).toBe(true);
    expect(shExpMatch("http://home.netscape.com/people/montulli/index.html", "*/ari/*")).toBe(
      false
    );
  });

  test("isInNet", () => {
    expect(isInNet("198.95.249.79", "198.95.249.79", "255.255.255.255")).toBe(true);
    expect(isInNet("198.95.6.9", "198.95.0.0", "255.255.0.0")).toBe(true); // match   198.95.*.*.
    expect(isInNet("198.95.125.9", "198.95.0.0", "255.255.0.0")).toBe(true); // match   198.95.*.*.
  });

  test("weekdayRange", () => {
    vi.setSystemTime(new Date(Date.UTC(2025, 8, 10, 20, 30, 50))); // 2025-9-10T12:30:50Z WED
    expect(weekdayRange("WED", "GMT")).toBe(true);
    expect(weekdayRange("MON", "FRI")).toBe(true);
    expect(weekdayRange("MON", "FRI", "GMT")).toBe(true);
  });

  test("timeRange", () => {
    vi.setSystemTime(new Date(Date.UTC(2025, 8, 10, 12, 30, 50))); // 2025-9-10T12:30:50Z WED
    expect(timeRange(12, "GMT")).toBe(true);
    expect(timeRange(20)).toBe(true);
    expect(timeRange(20, 23)).toBe(true);
    expect(timeRange(12, 25, 12, 31, "GMT")).toBe(true);
    expect(timeRange(12, 25, 0, 13, 0, 0, "GMT")).toBe(true);
  });

  test("dateRange", () => {
    vi.setSystemTime(new Date(Date.UTC(2025, 8, 10, 12, 30, 50))); // 2025-9-10T12:30:50Z WED
    expect(dateRange(10, "GMT")).toBe(true);
    expect(dateRange(10)).toBe(true);
    expect(dateRange(10, 11)).toBe(true);
    expect(dateRange("SEP", "OCT")).toBe(true);
    expect(dateRange("SEP")).toBe(true);
    expect(dateRange(2025, 2026)).toBe(true);
    expect(dateRange(2025)).toBe(true);
    expect(dateRange("SEP", 2025, "OCT", 2025)).toBe(true);
    expect(dateRange(9, "SEP", 2025, 11, "SEP", 2025)).toBe(true);
  });
});
