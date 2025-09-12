import { describe, expect, test } from "vitest";
import path from "path";
import Pacparser from "../src";
import { demo1 } from "./pac_demos";

describe("pacparser tests", () => {
  test("pacparser pacfile", async () => {
    const pacPath = path.join(__dirname, "./proxy.pac");
    const pacParser = new Pacparser(pacPath);
    const proxy = await pacParser.findProxy("https://direct.mozilla.org");
    expect(proxy).toBe("DIRECT");
  });

  test("pacparser pacString", async () => {
    const pacParser = new Pacparser();
    await pacParser.parsePac(demo1);

    const proxy = await pacParser.findProxy("https://www.google.com");
    console.log(proxy);
    expect(proxy).toBe("PROXY w3proxy.mozilla.org:8080; DIRECT");
  });
});
