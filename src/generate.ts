import * as path from "path";
import { readdir, readFile, writeFile } from "./util";

const flatten = <T>(lists: T[][]): T[] =>
  lists.reduce((m, l) => m.concat(l), []);

const extractKeys = (o: object, keys: string[], path = "", namespace = "") => {
  Object.entries(o).map(([k, v]) => {
    const nextPath = [path, k].filter((t) => t).join(".");
    if (typeof v === "string") {
      keys.push(`${namespace}${nextPath}`);
    }
    if (typeof v === "object") {
      extractKeys(v, keys, nextPath, namespace);
    }
  });
  return keys;
};

const keysToTs = ({
  keys,
  indent,
  quoteChar,
  typeName,
}: {
  keys: string[];
  indent: number;
  quoteChar: string;
  typeName: string;
}) => {
  const whitespace = Array(indent)
    .fill(null)
    .map(() => " ")
    .join("");
  return [
    `export type ${typeName} =`,
    ...keys.map((k) => `${whitespace}| ${quoteChar}${k}${quoteChar}`),
  ].join("\n");
};

export type Options = {
  inFolder: string;
  outFile: string;
  defaultNs?: string;
  indent?: number;
  typeName?: string;
  quoteChar?: string;
};

export const generate = async ({
  inFolder,
  outFile,
  defaultNs = "translation",
  indent = 2,
  typeName = "TranslationKeys",
  quoteChar = `'`,
}: Options) => {
  const files = await readdir(inFolder);
  const jsonFiles = files.filter((f) => f.endsWith(".json"));
  // make sure default keys appear first
  const i = jsonFiles.map((f) => path.parse(f).name).indexOf(defaultNs);
  if (i !== -1) {
    const defaultNamespaceFile = jsonFiles[i];
    jsonFiles.splice(i, 1);
    jsonFiles.unshift(defaultNamespaceFile);
  }
  const keys = await Promise.all(
    jsonFiles.map(async (f) => {
      const content = await readFile(path.join(inFolder, f));
      const translations = JSON.parse(content.toString());
      const namespace = path.parse(f).name;
      return extractKeys(
        translations,
        [],
        "",
        namespace === defaultNs ? "" : `${namespace}:`
      ).sort();
    })
  ).then(flatten);

  const tsFileContent = keysToTs({
    keys,
    indent,
    quoteChar,
    typeName,
  });

  await writeFile(outFile, tsFileContent);
};
