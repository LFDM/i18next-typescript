#!/usr/bin/env node

import * as commander from "commander";
import { generate, Options } from "./generate";
import { readFile } from "./util";
import { watch } from "./watch";

const withOptions = (command: commander.Command) => {
  return command
    .option(
      "-i, --in [inFolder]",
      "Path to a folder with your translation files"
    )
    .option("-o, --out [outFile]", "Path to the output file")
    .option(
      "--default-namespace [defaultNamespace]",
      "Default Namespace in your i18next configuration",
      "translation"
    )
    .option("--indent [indent]", "Indentation level of output file", "2")
    .option(
      "--type-name [typeName]",
      "Exported type name in the generated file",
      "TranslationKeys"
    )
    .option(
      "--quote-char [quoteChar]",
      "Character to use to quote strings",
      "'"
    )
    .option(
      "-c, --config [configFile]",
      "Path to config file",
      "i18next-typescript.config.json"
    );
};

const parseOptions = async (opts: any): Promise<Options> => {
  const config: Partial<Options> = opts.config
    ? await readFile(opts.config).then((f) => JSON.parse(f.toString()))
    : {};

  return {
    inFolder: opts.in,
    outFile: opts.out,
    defaultNs: opts["default-namespace"],
    indent: parseInt(opts.indent, 10),
    typeName: opts["type-name"],
    quoteChar: opts["quote-char"],
    ...config,
  };
};

withOptions(
  commander
    .command("generate")
    .alias("g")
    .description("Generate type definitions for all your translation keys.")
).action(async (c) => {
  const options = await parseOptions(c.opts());
  await generate(options);
});

withOptions(
  commander
    .command("watch")
    .alias("w")
    .description(
      "Watch your translation files and generate type definitions for all your translations keys when they change."
    )
).action(async (c) => {
  const options = await parseOptions(c.opts());
  watch({ inFolder: options.inFolder }, () => generate(options));
});

commander.parse(process.argv);
