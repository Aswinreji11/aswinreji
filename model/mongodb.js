const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/ProjectSixthWeek')
    .then(() => {
        console.log('successfully connected to mongodb')
    })
    .catch((err) => {
        console.error(err, 'failed to connect ')
    })


const schema = new mongoose.Schema({ 
    email: {
        type: String,
        required: true

    },

    name: {
        type: String,
        required: true,
    },
    
    password: {
        type: String,
        required: true,
    },
    
    isAdmin: {
        type: Boolean,
        default: false,
    }

})

const collection = new mongoose.model('collection', schema)

module.exports = collection  