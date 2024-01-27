// Tools Settings
import Embed from "@editorjs/embed";
import List from "@editorjs/list";
import Image from "@editorjs/image";
import Header from "@editorjs/header";
import Quote from "@editorjs/quote";
import Marker from "@editorjs/marker";
import InlineCode from "@editorjs/inline-code";

import { uploadImage } from "../common/aws";

const uploadImageByUrl = (e) => {
    let link = new Promise((resolve, reject) => {
        try {
            resolve(e);
        } catch (err) { 
            reject(err);
        }
    });

    return link.then(url => {
        return {
            success: 1,
            file: { url }
        }
    })
};

const uploadImageByFile = async (e) => {
    try {
        const url = await uploadImage(e);
        if (url) {
            return {
                success: 1,
                file: { url }
            }
        } else {
            throw new Error('Failed to upload image'); 
        }
    } catch (error) {
        console.error('Error uploading image:', error);
        throw error; 
    }
}

export const tools = {
    embed: Embed,
    list: {
        class: List,
        inlineToolbar: true
    },
    image: {
        class: Image,
        config: {
            uploader: {
                uploadByUrl: uploadImageByUrl,
                uploadByFile: uploadImageByFile
            }
        }
    },
    header: {
        class: Header,
        config: {
            placeholder: "Type Heading...",
            levels: [2, 3],
            defaultLevel: 2
        }
    },
    quote: {
        class: Quote,
        inlineToolbar: true
    },
    marker: Marker,
    inlineCode: InlineCode
}

