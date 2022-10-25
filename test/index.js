import fs from "fs";
import path from "path";
import child_process from "child_process";
import util from "util";
import { v4 } from "uuid";

// let newConnection = () => {
//     let data = {
//         id: `${v4()}`,
//     };

//     console.log(`${process.cwd()}/${data.id}`);

//     child_process.exec(`mkdir ${process.cwd()}\\${data.id}`);
// };

// let rmConnection = (id) => {};
// newConnection();

let exec = util.promisify(fs.readFile);

let test = await exec(`ls`);

console.log(test.stdout);
