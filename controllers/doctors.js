const { checkIfLogged } = require("../libs/login");
const mongoose = require("mongoose");
const Users = mongoose.model("User");
const Appointments = mongoose.model("Appointment");

const doctorDetailsCheckRoute = (req, res) => 
{
    if(!checkIfLogged(req)) res.redirect('/');
    const doctorLogin = req.params.doctorLogin;
    try
    {
    Users.findOne({login: req.cookies["_logged"]}).then((loggedUser)=>
    {
    Users.findOne({login: doctorLogin}).then((user)=>{
      Appointments.find({doctor: user.login}).then((appointments)=>{
        res.render("doctorDetails", { title: `Doctor: ${doctorLogin}`, loggedCookie: checkIfLogged(req), doctor: user, appointments: appointments, loggedUser: loggedUser });

      }).catch((err)=>
      {
        console.log(err);
     });
    }).catch((err)=>{
        console.log(err);
    });
  }).catch((err)=>
  {
    console.log(err);
});
    }
    catch(err)
    {
        console.log(err);
        res.render("doctorDetails", { title: "Error", loggedCookie: checkIfLogged(req), doctor: {}, appointment: {}, loggedUser: loggedUser });
    }
};

module.exports = 
{
  doctorDetailsCheckRoute
}