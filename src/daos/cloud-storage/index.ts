//set up the cloud storage bucket
import {Storage} from '@google-cloud/storage'

//full http path to image bucket
export const bucketBaseUrl = `https://storage.googleapis.com/node2006bucket-images`

//bucket object
export const imageBucket = new Storage().bucket('node2006bucket-images')
