import fs from "fs";
import util from "util";

const KEYS = [
    {
        id: 0,
        lines: [1, 2],
    },
    {
        id: 1,
    },
    {
        id: 2,
    },
    {
        id: 3,
    },
    {
        id: 4,
    },
];

fs.readFile("./test.conf", { encoding: "utf-8" }, (err, data) => {
    if (data) {
        // console.log(data.split("\n"));
    } else {
        console.error("no data, no file!");
    }
});

export const countConnections = async () => {
    try {
        let read = util.promisify(fs.readFile);

        let data = await read("./data/data.json", { encoding: "utf-8" });
        if (data) {
            return JSON.parse(data).count;
        } else {
            throw "no data";
        }
    } catch (error) {
        console.error(error);
    }
};

export const writeConnection = async (count) => {
    let obj = { count: count };
    fs.writeFile("./data/data.json", JSON.stringify(obj), (e) => {
        console.log(e);
        console.log("done");
    });
};

export const newConnection = async () => {
    let count = await countConnections();
    if (!(count < 4)) {
        return "no place";
    } else {
        count++;
        writeConnection(count);
    }
    console.log("end");
};

newConnection();
