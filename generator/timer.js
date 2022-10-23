import fs from "fs";

// trigger deletion of key after 1 hour
export function timer(c) {
    const time = 3600000;

    setTimeout(() => {
        console.log("huh");
    }, time);
}
