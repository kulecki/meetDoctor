const express = require("express");
const app = express();
const _ = require("lodash");
const cookieParser = require("cookie-parser");
const loginCnt = require("./controllers/authenticate");
const homeCnt = require("./controllers/home");
const doctorCnt = require("./controllers/doctors");
const myAccountCnt = require("./controllers/myAccount");
const adminPanelCnt = require("./controllers/adminPanel");
const appointmentCnt = require("./controllers/appointment");
const flash = require("connect-flash");

app.use(cookieParser());
app.use(flash());
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

app.get("/", homeCnt.homeCheckRoute);

app.get("/login", loginCnt.loginCheckRoute);

app.post("/login", loginCnt.login);

app.get("/register", loginCnt.registerCheckRoute);

app.post("/register", loginCnt.register);

app.get("/logout", loginCnt.logoutController);

app.get("/myAccount", myAccountCnt.myAccountCheckRoute);

app.post("/myAccount", myAccountCnt.changeMyAccountData);

app.get("/adminPanel", adminPanelCnt.adminPanelCheckRoute);

app.get("/adminPanel/:userLogin", myAccountCnt.getAccountData);

app.post("/adminPanel/:userLogin", myAccountCnt.changeAccountData);

app.get("/appointments", appointmentCnt.appointmentCheckRoute);

app.get("/appointments/newAppointment", appointmentCnt.newAppointmentCheckRoute);

app.post("/appointments/newAppointment", appointmentCnt.addNewAppointment);

app.get("/appointments/:appointmentId", appointmentCnt.appointmentDetailsCheckRoute);

app.get("/cancelAppointment/:appointmentId", appointmentCnt.cancelAppointment);

app.get("/signForAppointment/:appointmentId", appointmentCnt.signForAppointment);

app.get('/doctorDetails/:doctorLogin', doctorCnt.doctorDetailsCheckRoute);

app.listen(3000, () => {
  console.log("App is working");
});
