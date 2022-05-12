import mongoose from 'mongoose'
const chatterSchema = mongoose.Schema({
    message:String,
    name: String,
    timestamp: String,
    received: Boolean

});

export default mongoose.model('messagecontents',chatterSchema)