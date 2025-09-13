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
  const builtinCmd = program.command("builtin").description("builtin functions");

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

  builtinCmd
    .option("-f, --function <function>", "builtin function")
    .option("-i, --input <input>", "function input", (value) => value.split(","))
    .option("-l, --list", "list all builtin functions")
    .action(async (options) => {
      if (options.list) {
        console.log(Object.keys(builtins));
        process.exit(0);
      }
      if (options.function) {
        const func = builtins[options.function];
        if (!func) {
          console.error("function is not exist");
          process.exit(1);
        }
        try {
          if (func.length !== (options?.input?.length ?? 0)) {
            console.error("input length is not match");
            process.exit(1);
          }
          const result = func(...(options?.input ?? []));
          console.log(result);
        } catch (e) {
          console.error(e);
        } finally {
          process.exit(0);
        }
      }
    });

  program.parse(process.argv);
}
