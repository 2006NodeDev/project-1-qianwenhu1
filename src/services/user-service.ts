import { User } from "../models/User"
import { getUserById, createUser, updateUser } from "../daos/sql/user-dao"
import { bucketBaseUrl } from "../daos/cloud-storage"
import { saveUserProfilePicture } from "../daos/cloud-storage/user-image"


export async function getUserByIDService(id: number): Promise<User> {
    return await getUserById(id)
}

export async function createUserService(newUser: User): Promise<User> {
    try {
        let base64Image = newUser.image
        let [dataType, imageData] = base64Image.split(';base64,')
        let fileExt = dataType.split('/').pop()// pop ext from ['data:image' , 'ext]
        //Assign image path in cloud storage to image in database
        if (newUser.image) {
            newUser.image = `${bucketBaseUrl}/users/${newUser.username}/profileImage.${fileExt}`
            //Save image to cloud storage 
            await saveUserProfilePicture(fileExt, imageData, `users/${newUser.username}/profileImage.${fileExt}`)
        }
        let newlycreatedUser = await createUser(newUser)

        return newlycreatedUser
    } catch (e) {
        console.log(e)
        throw e
    }
}


export async function UpdateUserService(curUser: User): Promise<User> {
    try {
        let base64Image = curUser.image
        let [dataType, imageData] = base64Image.split(';base64,')
        let fileExt = dataType.split('/').pop()
        if (curUser.image) {
            curUser.image = `${bucketBaseUrl}/users/${curUser.username}/profileImage.${fileExt}`
            await saveUserProfilePicture(fileExt, imageData, `users/${curUser.username}/profileImage.${fileExt}`)
        }
        let modifiedUser = await updateUser(curUser)

        return modifiedUser
    } catch (e) {
        console.log(e)
        throw e
    }
}

