import fs from "fs";

fs.readFile("/etc/wireguard/wg0.conf", (err, data) => {
    console.log(data.split("\n"));
});
