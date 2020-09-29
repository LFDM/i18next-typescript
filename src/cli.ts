import * as path from "path";
import { generate } from "./generate";
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
