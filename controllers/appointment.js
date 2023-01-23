const { checkIfLogged, logout } = require("../libs/login");
const models = require("../models");
const mongoose = require("mongoose");
const { check } = require("express-validator");
const { templateSettings } = require("lodash");
const Appointments = mongoose.model("Appointment");
const Users = mongoose.model("User");

const appointmentCheckRoute = (req, res) => 
{
  if (!checkIfLogged(req)) res.redirect("/login");

  Users.findOne({login: req.cookies["_logged"]})
  .then((loggedUser) => 
  {
  Appointments.find({$or: [{doctor: loggedUser.login}, {patient: loggedUser.login}]}).then((appointments)=>
  {
    res.render("appointments", {title: "Appointments", loggedCookie: checkIfLogged(req), appointments: appointments, loggedUser: loggedUser});
  }).catch((err)=>
  {
    console.log(err);
    res.render("appointments", {title: "Appointments", loggedCookie: checkIfLogged(req), appointments: [], loggedUser: loggedUser});
  });
  }).catch((err)=>
  {
    console.log(err);
  });
};

const newAppointmentCheckRoute = (req, res) => 
{
  if (!checkIfLogged(req)) res.redirect("/login");

    Users.findOne({login: req.cookies["_logged"]}).then((user)=>
    {
      if(user)
      {
        res.render("addNewAppointment", {title: "New Appointment", loggedCookie: checkIfLogged(req), error: '', doctor: user});
      }
      else
      {
        res.render("addNewAppointment", {title: "New Appointment", loggedCookie: checkIfLogged(req), error: '', doctor: {}});
      }

    }).catch((err)=>{
      console.log(err);
      res.redirect('/appointments');
    });
};

const addNewAppointment = (req, res) => 
{
  const title = req.body.title;
  const duration = req.body.duration;
  const doctor = req.body.doctor;
  const datetime = new Date(req.body.datetime).toLocaleString("pl-PL", {dateStyle: "short", timeStyle: "short"});
  
  try 
  {
    Appointments.create({title: title, duration: duration, doctor: doctor, date:datetime}).then(()=>
    {
      res.redirect('/appointments');
    }).catch((err)=>
    {
      console.log(err);
    })
  } 
  catch(err) 
  {
    console.log(err);
  }
};

const cancelAppointment = (req, res) => 
{
    if (!checkIfLogged(req)) res.redirect("/login");
    const appointmentId = req.params.appointmentId;
    Users.findOne({login: req.cookies["_logged"]})
    .then((loggedUser) => 
    {
      if(loggedUser.role != "Patient")
      {
        Appointments.deleteOne({_id: appointmentId}).then(()=>
        {
          res.redirect('/appointments');
        });
      }
      else
      {
        res.redirect('/appointments');
      }
    });
};

const signForAppointment = (req, res) => 
{
  if (!checkIfLogged(req)) res.redirect("/login");
  const appointmentId = req.params.appointmentId
  Users.findOne({login: req.cookies["_logged"]})
  .then((loggedUser) => 
  {
    Appointments.findOne({_id: appointmentId}).then((appointment)=>
    {
      let patient = appointment.patient;
      if(patient != '')
      {
        Appointments.findOneAndUpdate({_id: appointmentId},{patient: ''}).then(()=>
        {
          res.redirect('/');
        });
      }
      else
      {
        Appointments.findOneAndUpdate({_id: appointmentId},{patient: loggedUser.login}).then(()=>
        {
          res.redirect('/');
        });
      }
    });
  });
};

const appointmentDetailsCheckRoute = (req, res) => 
{
  if (!checkIfLogged(req)) res.redirect("/login");
  const appointmentId = req.params.appointmentId

  Users.findOne({login: req.cookies["_logged"]})
  .then((loggedUser) => 
  {
    Appointments.findOne({_id: appointmentId}).then((appointment)=>
    {
      res.render("appointmentDetails", {title: appointment.title, loggedCookie: checkIfLogged(req), loggedUser: loggedUser, appointment: appointment});
    }).catch((err)=>
    {
      console.log(err);
      res.render("appointmentDetails", {title: appointment.title, loggedCookie: checkIfLogged(req), loggedUser: loggedUser, appointment: {}});
    });
  }).catch((err)=>
  {
    console.log(err);
  });
};

module.exports = 
{
  appointmentCheckRoute,
  newAppointmentCheckRoute,
  addNewAppointment,
  appointmentDetailsCheckRoute,
  cancelAppointment,
  signForAppointment
};
