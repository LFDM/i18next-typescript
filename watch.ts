import * as chokidar from "chokidar";

export const watch = (
  { inFolder }: { inFolder: string },
  onChange: (path: string, eventType: "add" | "change" | "unlink") => void
) => {
  const watcher = chokidar.watch(`${inFolder}/**/*.json`, {
    ignored: /(^|[\/\\])\../, // ignore dotfiles
    persistent: true,
  });

  watcher.on("add", (path) => onChange(path, "add"));
  watcher.on("change", (path) => onChange(path, "change"));
  watcher.on("unlink", (path) => onChange(path, "unlink"));
};
