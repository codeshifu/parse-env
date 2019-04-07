import { resolve } from "path";
import { readFileSync } from "fs";

const DEFAULT_ENV_PATH = resolve(process.cwd(), ".env");
const NEWLINE = "\n";

interface Options {
  emptyLines: boolean;
}

interface EnvObject {
  [key: string]: any;
}

const parseEnv = (
  path?: string,
  opts: Options = { emptyLines: false }
): EnvObject => {
  try {
    const env = readFileSync(path || DEFAULT_ENV_PATH, {
      encoding: "UTF-8"
    });
    const obj: EnvObject = {};
    let newlineCount = 0;
    env
      .split(NEWLINE)
      .map(
        (line): string[] => {
          if (line) {
            return line.split("=").map(kv =>
              kv
                .trim()
                .replace(/^("|')/, "")
                .replace(/("|')$/, "")
            );
          } else if (opts.emptyLines) {
            newlineCount++;
            return [`__EMPTYLINE_${newlineCount}__`, ""];
          } else return [""];
        }
      )
      .filter(item => item.length > 1)
      .forEach(item => {
        obj[item[0]] = item[1];
      });
    return obj;
  } catch (error) {
    throw new Error(error);
  }
};

export default parseEnv;