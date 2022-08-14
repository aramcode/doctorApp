const mongoose = require('mongoose');

let doctorSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {
        firstName: {
            type: String,
            required: true
        },
        lastName: String
    },
    dateOfBirth: Date,
    address:{
        state: String,
        suburb:String,
        street:Number,
        unit:Number
    },
    numOfPatients : {
        type: Number,
        validate: {
            validator: function (numValue) {
                return numValue > 0;
            },
            message: 'Number of Patients should be greater than 0'
        }
    }
});
module.exports = mongoose.model('Doctor', doctorSchema);