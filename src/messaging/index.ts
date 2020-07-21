// set up pub sub topics
import {PubSub} from '@google-cloud/pubsub'

const pubSubClient = new PubSub()

//Local topic object
export const userTopic = pubSubClient.topic('projects/primeval-gizmo-279818/topics/user-topic')



