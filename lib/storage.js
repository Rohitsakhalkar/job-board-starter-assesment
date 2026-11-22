import {readFile, writeFile} from "node:fs/promises"

export class Storage{

    constructor(path){
        this.path = path
    }

    async read(){
        return readFile(this.path, "utf8")
    }

    async write(data){
        return writeFile(this.path, JSON.stringify(data, null, 2))
    }
}