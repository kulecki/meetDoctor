const { checkIfLogged, logout } = require("../libs/login");
const models = require("../models");
const mongoose = require("mongoose");
const md5 = require("md5");
const Users = mongoose.model("User");
const _ = require("lodash");
const { toLower, trim } = require("lodash");

const registerCheckRoute = (req, res) => 
{
  checkIfLogged(req)
    ? res.redirect("/")
    : res.render("register", 
    {
        title: "Register",
        loggedCookie: checkIfLogged(req),
        error: "",
    });
};

const register = (req, res) => 
{
  let login = toLower(trim(req.body.login));
  let password = md5(req.body.password);
  let email = toLower(trim(req.body.email));
  let role = req.body.role;
  let fName = trim(req.body.fName);
  let lName = trim(req.body.lName);

  try 
  {
    Users.findOne({ login: login }, (err, user) => 
    {
      if(err) 
      {
        res.render("login", 
        {
          title: "Login",
          loggedCookie: checkIfLogged(req),
        });
      } 
      else 
      {
        if(user) 
        {
          res.render("register", 
          {
            title: "Register",
            loggedCookie: checkIfLogged(req),
            error: `${login} user already exists`,
          });
        } 
        else 
        {
          Users.insertMany(
            {
              login: login,
              password: md5(password),
              contact: {
                firstName: fName,
                lastName: lName,
                email: email,
              },
              role: role,
            },
            (err) => 
            {
              if (err) redirect("/login");
              res.cookie("_logged", login, 
              {
                maxAge: 2 * 60 * 60 * 1000,
                httpOnly: true,
              });
              res.redirect("/");
            }
          );
        }
      }
    });
  } 
  catch(err) 
  {
    console.log(err);
  }
};

const loginCheckRoute = (req, res) => 
{
  checkIfLogged(req)
    ? res.redirect("/")
    : res.render("login", 
    {
        title: "Login",
        loggedCookie: checkIfLogged(req),
        error: "",
    });
};

const login = (req, res) => 
{
  const login = toLower(trim(req.body?.login));
  const password = md5(req.body?.password);
  try 
  {
    Users.findOne({ login: login, password: password }, (err, user) => 
    {
      if(err) 
      {
        res.render("login", 
        {
          title: "Login",
          loggedCookie: checkIfLogged(req),
          error: "",
        });
      } 
      else 
      {
        if (user) 
        {
          res.cookie("_logged", login, 
          {
            maxAge: 2 * 60 * 60 * 1000,
            httpOnly: true,
          });
          res.redirect("/");
        } 
        else 
        {
          res.render("login", 
          {
            title: "Login",
            loggedCookie: checkIfLogged(req),
            error: `Login or password are incorrect`,
          });
        }
      }
    });
  } 
  catch (err) 
  {
    console.log(err);
  }
};

const logoutController = (req, res) => 
{
  if (checkIfLogged(req)) 
  {
    logout(res);
    res.redirect("/");
  } 
  else 
  {
    res.redirect("login");
  }
};

module.exports = 
{
  register,
  registerCheckRoute,
  loginCheckRoute,
  login,
  logoutController,
};
