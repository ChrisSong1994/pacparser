import fs from "fs";
import path from "path";
import { program } from "commander";
import Pacparser from "../index";
import * as builtins from "../builtins";

import { __dirname } from "./helper";
export async function loadCli() {
  // git program info
  const pkg = JSON.parse(fs.readFileSync(path.join(__dirname(), "../../package.json"), "utf-8"));

  // command
  program
    .name("pacparser")
    .usage("[options]")
    .description("parse pac file")
    .version(pkg.version, "-v, --version", "output the version number");

  const execCmd = program.command("exec").description("execute parse pac file");
  const buildinCmd = program.command("builtin").description("builtin functions");

  execCmd
    .requiredOption("-p, --pac <pac>", "pac file path or pac code")
    .requiredOption("-f, --findproxy <url,host>", "find proxy", (value) => value.split(","))
    .action(async (options) => {
      if (!options.pac) {
        console.error("pac file path or pac code is required");
        process.exit(1);
      }
      if (!options.findproxy) {
        console.error("url is required");
        process.exit(1);
      }
      const pac = await Pacparser.create(options.pac);
      const result = await pac.findProxy(options.findproxy?.[0], options.findproxy?.[1]);
      console.log(result);
    });

  buildinCmd
    .requiredOption("-f, --function <function>", "builtin function")
    .option("-i, --input <input>", "function input", (value) => value.split(","))
    .action(async (options) => {
      if (!options.function) {
        console.error("function is required");
        process.exit(1);
      }
      const func = builtins[options.function];
      if (!func) {
        console.error("function is not exist");
        process.exit(1);
      }

      const result = func(...(options?.input ?? []));
      console.log(result);
    });

  program.parse(process.argv);
}
