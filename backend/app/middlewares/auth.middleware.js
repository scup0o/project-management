const jwt = require("jsonwebtoken");
const db = require("../utils/mysql.util")

const requireAuth = (req, res, next) =>{
    const token = req.cookies.jwt;

    if (token){
        jwt.verify(token, process.env.SECRECT_KEY, (error, decodedToken) =>{
            if (error){
                console.log(error);
            }
            else{
                next();
            }
        })
    }
    else{
        res.send("not login in");
    }
}

const checkAuth = (req, res, next) =>{
    const token = req.cookies.jwt;
    jwt.verify(token, process.env.SECRECT_KEY, (error, decodedToken) =>{
        if (error){
            console.log(error);
        }
        else{
            if (decodedToken.role==='admin'){
                next();
            }else{
        res.send('access denied');
    }
        }
    })
}

const AdminOnly = (req, res, next) =>{
    const token = req.cookies.jwt;
    jwt.verify(token, process.env.SECRECT_KEY, (error, decodedToken) =>{
        if (error){
            console.log(error);
        }
        else{
            if (decodedToken.role==='admin'){
                next();
            }else{
            res.send('access denied');
    }
        }
    })
}

//check current user
const checkUser = (req, res, next) => {
    const token = req.cookies.jwt;
    if (token){
        jwt.verify(token, process.env.SECRECT_KEY, async (error, decodedToken) =>{
            if (error){
                console.log(error);
                res.locals.user = null;
                next();
            }
            else{
                let user = new Promise((resolve, reject) => {
                    db.query(`SELECT username FROM users WHERE username = '${decodedToken.username}'`,
                        function (err, result, fields) {
                          if (err) {
                            throw (err);
                          } else{
                            if (result.length === 0){
                                res.send(null);
                            }
                            else res.send(result[0]);
                          }
                        });
                })
                res.locals.user = user[0];
                console.log(user)
                next();
            }
        })
    }
    else{
        res.send("not login in");
        res.locals.user = null;
        next();
    }
}

module.exports = {requireAuth, checkAuth, checkUser, AdminOnly};