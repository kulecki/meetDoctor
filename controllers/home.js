const { checkIfLogged, logout } = require("../libs/login");
const models = require("../models");
const mongoose = require("mongoose");
const md5 = require("md5");
const Users = mongoose.model("User");
const _ = require("lodash");
const { toLower, trim } = require("lodash");


const homeCheckRoute = (req, res) => 
{
    try
    {
        Users.find({role: "Doctor"}).then((users)=>
        {
            console.log(users);
            res.render("home", { title: "Home", loggedCookie: checkIfLogged(req), doctors: users });        
        }).catch((err)=>
        {
            console.log(err);
        });
    }
    catch(err)
    {
        console.log(err);
        res.render("home", { title: "Home", loggedCookie: checkIfLogged(req), doctors: [] });

    }
};

module.exports = 
{
    homeCheckRoute,
}