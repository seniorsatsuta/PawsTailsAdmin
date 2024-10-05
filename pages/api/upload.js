import multiparty from 'multiparty'
import firebaseStorage from "@/lib/firebase";
import {ref, uploadBytes, getDownloadURL } from "firebase/storage"
import fs from 'fs'
import mime from 'mime-types'
import mongooseConnect from "@/lib/mongoose";
import {isAdminRequest} from "@/pages/api/auth/[...nextauth]";

export default async function handle(req, res){

    await mongooseConnect();
    await isAdminRequest(req,res);

    const form = new multiparty.Form();
    const {fields, files} = await new Promise((resolve, reject) => {
        form.parse(req, (err, fields, files) => {
            if (err) throw err;
            resolve({fields, files});
        });
    });
    console.log('l: ', files.file);
    const links = [];
    for (const file of files.file){
        const ext = file.originalFilename.split('.').pop();
        const newFilename = Date.now() + '.' + ext;
        const storageRef = ref(firebaseStorage, newFilename);

        // Create file metadata including the content type
        /** @type {any} */
        const metadata = {
            contentType: mime.lookup(file.path),
        };

        // Upload the file and metadata
        await uploadBytes(storageRef, fs.readFileSync(file.path), metadata);
        const link = await getDownloadURL(storageRef);
        links.push(link);

    }
    return res.json({links});
}

export const config = {
    api: {bodyParser:false},
}