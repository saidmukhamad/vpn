import fs from "fs";
import path from "path";
import child_process from "child_process";

import { fileURLToPath } from "url";

const __dirname = fileURLToPath(import.meta.url);
const __path = path.dirname(__dirname);

// fs.writeFileSync("test.sh", "pwd");

// console.log(__path);
console.log(`${__path}\\test.sh`);

child_process.execFile(`bash ${__path}/test.sh`, { shell: true }, (t, stdout, stdin) => {
    console.log(stdout.split("\n"), stdin);
});
