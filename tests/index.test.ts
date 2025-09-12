import { describe, expect, test } from "vitest";
import path from "path";
import Pacparser from "../src";
import { demo1, demo2, demo3 } from "./pac_demos";

describe("pacparser tests", () => {
  test("pacparser pacfile", async () => {
    const pacPath = path.join(__dirname, "./proxy.pac");
    const pacParser = new Pacparser(pacPath);
    const proxy = await pacParser.findProxy("https://direct.mozilla.org");
    expect(proxy).toBe("DIRECT");
    expect(pacParser.getPacSource()).toBe(pacPath);
  });

  test("pacparser pacString", async () => {
    const pacParser = new Pacparser();
    pacParser.parsePac(demo1);
    const proxy1 = await pacParser.findProxy("https://www.google.com");
    expect(proxy1).toBe("PROXY w3proxy.mozilla.org:8080; DIRECT");
    expect(pacParser.getPacCode()).toBe(demo1);
    expect(pacParser.getPacSource()).toBe(demo1);

    const proxy2 = await pacParser.parsePac(demo2).findProxy("https://www.google.com");
    expect(proxy2).toBe("DIRECT");

    const proxy3 = await pacParser.parsePac(demo3).findProxy("https://www.google.com");
    console.log(proxy3);
    expect(proxy3).toBe("DIRECT");

    pacParser.cleanup();
    // pacParser.findProxy("https://www.google.com")
    await expect(() => pacParser.findProxy("https://www.google.com")).rejects.toThrowError(
      "PAC script not loaded"
    );

    // reload empty pac source
    await expect(() => pacParser.reload()).rejects.toThrowError("Invalid pac code");
  });
});
