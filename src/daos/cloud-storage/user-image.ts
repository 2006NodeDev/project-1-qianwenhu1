import { imageBucket } from ".";

export async function saveUserProfilePicture(contentType:string, Base64ImageData:string, fileName:string){
    try{

        let newImageFile = imageBucket.file(fileName)
        
        //Buffer.from retruns binary array
        //file.save  streams binary data
        await newImageFile.save(Buffer.from(Base64ImageData, 'base64'), {
            metadata:{
                contentType
            }
        })
        console.log('File saved')
    } catch(e){
        console.log(e);
        throw e  
    }
}
