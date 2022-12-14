import fs from "fs";
import util from "util";
import child_process from "child_process";
import { v4 } from "uuid";

export const countConnections = async () => {
    try {
        let read = util.promisify(fs.readFile);
        let data = await read(`${process.cwd()}/generator/data/data.json`, {
            encoding: "utf-8",
        });
        if (data) {
            return JSON.parse(data).count;
        } else {
            throw "no data";
        }
    } catch (error) {
        console.error(error);
    }
};

export const getFreeIp = async () => {
    let read = util.promisify(fs.readFile);
    let file = await read(`${process.cwd()}/generator/data/ip.json`, {
        encoding: "utf-8",
    });

    let data = JSON.parse(file);
    console.log(data);
    for (let i = 0; i < data.adresses.length; i++) {
	console.log(data.adresses[i])        
   if (data.adresses[i].free == true) {
            data.adresses[i].free = false;
            let ip = data.adresses[i].ip;
            fs.writeFile(
                `${process.cwd()}/generator/data/ip.json`,
                JSON.stringify(data),
                () => {}
            );
            return ip;
        }
    }
};

export const writeConnection = async (count) => {
    let obj = { count: count };
    let data = { id: `${v4()}`, public: "", private: "", strings: [], ip: "" };

    let exec = util.promisify(child_process.exec);
    let read = util.promisify(fs.readFile);

    child_process.exec(`mkdir /etc/wireguard/${data.id}`);

    let privateKey = `/etc/wireguard/${data.id}/${data.id}_privatekey`;
    let publicKey = `/etc/wireguard/${data.id}/${data.id}_publickey`;

    child_process.exec(`wg genkey | tee ${privateKey} | wg pubkey | tee ${publicKey}`);

    let config = await read(`/etc/wireguard/wg0.conf`, { encoding: "utf-8" });

    let parse = config.split("/n");
    data.ip = await getFreeIp();
    console.log(data.ip);

    let tempPublic = await exec(`cat ${publicKey}`);
    let tempPrivate = await exec(`cat ${privateKey}`);
    data.public = tempPublic.stdout;
    data.private = tempPrivate.stdout;

    let paste = [
        ``,
        `[Peer]`,
        `PublicKey = ${data.public}`,
        `AllowedIPs = ${data.ip}`,
        ``,
    ];

    let oldLen = parse.length;

    let writeFile = parse.concat(paste);

    let newLen = writeFile.length;

    data.strings = [oldLen, newLen];

    let data_json = await read(`${process.cwd()}/generator/data/data.json`, {
        encoding: "utf-8",
    });

    data_json = JSON.parse(data_json);

    data_json.count++;
    data_json.connections.push(data);

    fs.writeFile(`/etc/wireguard/wg0.conf`, writeFile.join(`\n`), () => {});
    fs.writeFile(
        `${process.cwd()}/generator/data/data.json`,
        JSON.stringify(data_json),
        () => {}
    );

    return data;
};

export const newConnection = async () => {
    let count = await countConnections();
    if (!(count < 10)) {
        return "no place";
    } else {
        count++;
        let data = await writeConnection(count);
        let exec = util.promisify(child_process.exec);
        exec(`systemctl restart wg-quick@wg0.service`);

        return data;
    }
    console.log("end");
};
