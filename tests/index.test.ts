import { describe, expect, test } from "vitest";
import path from "path";
import Pacparser from "../src";
import { demo1 } from "./pac_demos";

describe("pacparser tests", () => {
  test("pacparser pacfile", () => {
    const pacParser = new Pacparser();
    pacParser.loadPacFile(path.join(__dirname, "./proxy.pac"));

    expect(pacParser.findProxyForURL("https://direct.mozilla.org")).toBe("DIRECT");
  });

  test("pacparser pacString", () => {
    const pacParser = new Pacparser();
    pacParser.loadPacString(demo1);
    console.log(pacParser.findProxyForURL("https://www.google.com"));
    expect(pacParser.findProxyForURL("https://www.google.com")).toBe(
      "PROXY w3proxy.mozilla.org:8080; DIRECT"
    );
  });
});
