import * as commander from "commander";
import * as path from "path";
import { generate, Options } from "./generate";
import { watch } from "./watch";

const ROOT = path.join(__dirname, "..", "..", "..", "..");
const FOLDER = path.join(ROOT, "shared", "locales", "en");
const OUT = path.join(ROOT, "app", "src", "i18next_types.ts");

console.log(process.cwd(), __dirname);

// generate({
//   inFolder: FOLDER,
//   outFile: OUT
// });

watch({ inFolder: FOLDER }, () =>
  generate({
    inFolder: FOLDER,
    outFile: OUT,
  })
);

const withOptions = (command: commander.Command) => {
  return command
    .option(
      "-i, --in <inFolder>",
      "Path to a folder with your translation files"
    )
    .option("-o, --out <outFile>", "Path to the output file")
    .option(
      "--default-namespace <defaultNamespace>",
      "Default Namespace in your i18next configuration",
      "translation"
    )
    .option("--indent <indent>", "Indentation level of output file", "2")
    .option(
      "-t, --type-name, <typeName>",
      "Exported type name in the generated file"
    )
    .option("--quote-char", "Character to use to quote strings", `'`)
    .option(
      "-c, --config",
      "Path to config file",
      "i18next-typescript.config.json"
    );
};

const parseOptions = (opts: any): Options => {
  return {
    inFolder: "",
    outFile: "",
  };
};

withOptions(commander.command("generate").alias("g")).action(async (c) => {
  const options = parseOptions(c.opts());
  await generate(options);
});

withOptions(commander.command("watch").alias("w")).action((c) => {
  const options = parseOptions(c.opts());
  watch({ inFolder: options.inFolder }, () => generate(options));
});

commander.parse(process.argv);
