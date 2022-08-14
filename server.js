const express = require('express');
const mongodb = require("mongodb");
const ejs = require("ejs");
const mongoose = require('mongoose');

const log = console.log;
const PORT = 8080;

const app = express();
//const MongoClient = mongodb.MongoClient;


app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.use(express.static('images'));
app.use(express.static('css'));

app.use(express.urlencoded({
    extended: true
}));
app.use(express.json());

const Doctor = require('./models/doctorSchema');
const Patient = require('./models/patientSchema');

let url = 'mongodb://localhost:27017/libDB';

mongoose.connect(url, function (err) {
    if (err) {
        log('Ran into error shen connecting ', err)
    } else {
        log('Connected Sucessfully')
    }

    app.get('/', function (req, res) {
        res.render("homepage.html")
    });

    app.get('/newDoctor', function (req, res) {
        res.render("newDoctor.html")
    });

    app.post('/newDoctor', function (req, res) {

        log(req.body);

        let newDoctor1 = new Doctor({
            _id: new mongoose.Types.ObjectId(),
            name: {
                firstName: req.body.firstName,
                lastName: req.body.lastName
            },
            dateOfBirth: req.body.dateOfBirth,
            address: {
                state: req.body.state,
                suburb: req.body.suburb,
                street: req.body.street,
                unit: req.body.unit,
            },
            numOfPatients: req.body.numOfPatients
        })

        // insert to mongoDB
        newDoctor1.save(function(err){
            if(err){
                log('Doctor details cannot be saved')
                res.render('invalid.html')
            }
            else{
                res.redirect('/listDoctors')
            }
        })
        


    });

    app.get('/listDoctors', function (req, res) {


        // get from database
        Doctor.find({}).exec(function (err, result) {
            res.render('listDoctors.html', {
                doctorsDbtable: result
            })
        })
    });

    app.get('/newPatient', function (req, res) {
        res.render("newPatient.html")
    });

    app.post('/newPatient', function (req, res) {

        log(req.body);

        let newPatient1 = new Patient({
            _id: new mongoose.Types.ObjectId(),
            name: req.body.name,
            doctor: req.body.doctor,
            age:req.body.age,
            dateOfVisit:req.body.dateOfVisit,
            caseDescription:req.body.caseDescription
        })

        // insert to mongoDB
        newPatient1.save(function(err){
            if(err){
                log('Patient details cannot be saved',err)
                res.render('invalid.html')
            }
            else{
                res.redirect('/listPatients')
            }
        })
        


    });

    app.get('/listPatients', function (req, res) {

        // get from database
        Patient.find({}).populate('doctor').exec(function (err, result) {
            res.render('listPatients.html', {
                patientsDbtable: result
            })
        })
    });


    app.get('/deletePatient', function (req, res) {
        res.render("deletePatient.html")
    });

    app.post('/deletepatient', function (req, res) {

        //get topic to delete
        let patientToDelete = req.body.patientName;

        // delete from database 
        Patient.deleteOne({
            name: patientToDelete
        }, function (err, result) {
            log("error", err);
            log("result", result);
    
            res.redirect('/listPatients')
        })
    });

    app.get('/updateDoctor', function (req, res) {
        res.render("updateDoctor.html")
    });
    
    app.post('/updateDoctor', function (req, res) {
    
        //get title to update
        let doctorToUpdate = req.body.doctorId;
    
        let updatedPatients = {
            numOfPatients: req.body.updatePatientsNum
        }
        //log(bookToUpdate)
        // update database 
        Doctor.updateOne({
                id: doctorToUpdate
            }, {
                $set:updatedPatients
            }, {
                upsert: false
            },
            function (err, result) {
                log("error", err);
                log("result", result);
    
                res.redirect('/listDoctors');
            }
        )
    });

});



app.listen(PORT, () => {
    log(`Listening at ${PORT}`)
});