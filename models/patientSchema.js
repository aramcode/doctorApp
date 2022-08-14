const mongoose = require('mongoose');

let patientSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {
        type: String,
        required: true
    },
    doctor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Doctor'
    },
    age: {
        type: Number,
        validate: {
            validator: function (ageValue) {
                return ageValue >= 0 && ageValue <= 120;
            },
            message: 'Age should be a number between 0 and 120'
        }
    },
    dateOfVisit: {
        type: Date,
        default: Date.now
    },
    caseDescription:{
        type: String,
        validate: {
            validator: function (textValue) {
                return textValue.length > 10 ;
            },
            message: 'Case Description should contain atleast 10 characters'
        }
    },
});
module.exports = mongoose.model('Patient', patientSchema);