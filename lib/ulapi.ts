import { UTApi } from "uploadthing/server";

const utapi = new UTApi();

export async function utDeleteFile(url: string) {
    const fileName = url.split("/").pop() || "";
    return await utapi.deleteFiles(fileName);
}
