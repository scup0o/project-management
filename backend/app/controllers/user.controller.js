const ApiError = require("../api-error");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const sendEmail = require("../utils/nodemailer");
const db = require("../utils/mysql.util");

const createToken = (username, role) => {
  return jwt.sign({ username, role }, process.env.SECRECT_KEY, {
    expiresIn: 3 * 24 * 60 * 60,
  });
};

exports.login = async (req, res, next) => {
  try {
    console.log(req.body);
    let result = await new Promise((resolve, reject) => {
      db.query(
        `SELECT username, password, role, staffId FROM users WHERE username = '${req.body.username}'`,
        async function (e, result) {
          if (e) reject(e);
          else resolve(result);
        }
      );
    });
    console.log(result);

    if (result.length === 0) {
      res.send("incorrected");
      return console.log("Username incorrected");
    } else {
      console.log(req.body.password, ",", result[0].password);
      const password = await bcrypt.compare(
        req.body.password,
        result[0].password
      );
      if (!password) {
        res.send("incorrected");
        console.log("Password incorrected");
        return next(new ApiError(500, "Password incorrected"));
      }
      /*
          if (result.verify === false) {
            res.send("not verified");
            console.log("not verified");
            return next(new ApiError(500, "not verified"));
          }*/
      const token = createToken(result.username, result.role);
      const auth = jwt.sign(
        {
          staffId: result.staffId,
          username: result.username,
          role: result.role,
        },
        process.env.SECRECT_KEY,
        { expiresIn: 3 * 24 * 60 * 60 }
      );
      res.cookie("jwt", token, {
        httpOnly: true,
        maxAge: 3 * 24 * 60 * 60 * 1000,
      });
      res.send(auth);
      console.log("dang nhap thanh cong");
      return result;
    }
  } catch (error) {
    console.log(error);
    return next(new ApiError(500, "An error occurred while login in"));
  }
};

exports.logout = (req, res) => {
  try {
    res.cookie("jwt", "", { httpOnly: true, maxAge: 1 });
    return true;
  } catch (error) {
    console.log(error);
    return next(new ApiError(500, "An error occurred while loging out"));
  }
};

exports.create = async (req, res, next) => {
  try {
    //console.log(req.body);
    let result = await new Promise((resolve, reject) => {
      db.query(
        `SELECT username FROM users WHERE username = '${req.body.username}'`,
        function (err, result, fields) {
          if (err) {
            reject(err);
          } else resolve(result);
        }
      );
    });
    console.log(result);
    if (result.length != 0) {
      res.send("username existed");
      return console.log("username existed");
    } else {
      result = await new Promise((resolve, reject) => {
        db.query(
          `SELECT email FROM users WHERE email = '${req.body.email}'`,
          function (err, result, fields) {
            if (err) {
              reject(err);
            } else resolve(result);
          }
        );
      });
      if (result.length != 0) {
        res.send("email existed");
        return console.log("email existed");
      } else {
        result = await new Promise((resolve, reject) => {
          db.query(
            `SELECT staffId FROM users WHERE staffId = '${req.body.staffId}'`,
            function (err, result, fields) {
              if (err) {
                reject(err);
              } else resolve(result);
            }
          );
        });
        if (result.length != 0) {
          res.send("staffId existed");
          return console.log("staffId existed");
        } else {
          const salt = await bcrypt.genSalt();
          req.body.password = await bcrypt.hash(req.body.password, salt);
          db.query(
            `INSERT INTO users (username, staffId, password, phone, email, role, name) VALUES ('${req.body.username}', '${req.body.staffId}','${req.body.password}', '${req.body.phone}','${req.body.email}', '${req.body.role}', '${req.body.name}')`,
            function (e) {
              if (e) throw e;
            }
          );
          res.send(true);
        }
      }
    }
  } catch (error) {
    console.log(error);
    return next(
      new ApiError(500, "An error occurred while creating the account")
    );
  }
};

exports.update = async (req, res, next) => {
  try {
    let result = await new Promise((resolve, reject) => {
      db.query(
        `SELECT username FROM users WHERE username = '${req.body.username}'`,
        function (err, result) {
          if (err) {
            reject(err);
          } else resolve(result);
        }
      );
    });
    console.log(result);
    if (result.length === 0) {
      res.send("not found");
      return console.log("user not existed");
    } else {
      result = await new Promise((resolve, reject) => {
        db.query(
          `SELECT email FROM users WHERE email = '${req.body.email}'`,
          function (err, result) {
            if (err) {
              reject(err);
            } else resolve(result);
          }
        );
      });
      if (result.length != 0) {
        res.send("email existed");
        return console.log("email existed");
      } else {
        result = await new Promise((resolve, reject) => {
          db.query(
            `SELECT staffId FROM users WHERE staffId = '${req.body.staffId}'`,
            function (err, result) {
              if (err) {
                reject(err);
              } else resolve(result);
            }
          );
        });
        if (result.length != 0) {
          res.send("staffId existed");
          return console.log("staffId existed");
        } else {
          let password = result[0].password;
          if (req.body.password != null && req.body.password != undefined) {
            const salt = await bcrypt.genSalt();
            password = await bcrypt.hash(req.body.password, salt);
          }
          db.query(
            `UPDATE users SET staffId = '${req.body.staffId}' AND password = '${password}' AND phone = '${req.body.phone}' AND email = '${req.body.email}' AND role = '${req.body.role}' AND name = '${req.body.name}' WHERE username = '${req.body.username}'`,
            function (e) {
              if (e) throw e;
            }
          );
          res.send(true);
        }
      }
    }
  } catch (error) {
    console.log(error);
  }
};

exports.get = async (req, res, next) => {
  try {
    //console.log(req.body.username);
    db.query(
      `SELECT * FROM users WHERE username = '${req.body.username}'`,
      function (err, result, fields) {
        if (err) {
          throw err;
        } else {
          if (result.length === 0) {
            res.send(null);
          } else {
            res.send(result[0]);
            //console.log(result[0]);
          }
        }
      }
    );
  } catch (error) {
    res.send(error);
  }
};

exports.getAll = async (req, res, next) => {
  try {
    db.query(
        `SELECT * FROM users`,
        function (err, result) {
          if (err) {
            throw err;
          } else {
              res.send(result);
            
          }
        }
      );
  } catch (error) {
    res.send(error);
  }
};

exports.delete = async (req, res, next) => {
  try {
    db.query(
        `DELETE FROM users WHERE username = '${req.body.username}'`,
        function (err, result) {
          if (err) {
            throw err;
          } else {
              res.send(result);
            
          }
        }
      );
  } catch (error) {
    res.send(error);
  }
};

exports.changePass = async (req, res, next) => {
  try {
    let user = await User.findById(req.params.id);
    const password = await bcrypt.compare(req.body.password, user.password);
    if (!password) {
      res.send("incorrected");
      console.log("Password incorrected");
      return next(new ApiError(500, "Password incorrected"));
    } else {
      if (req.body.newpassword !== req.body.confirmpassword) {
        res.send("wrong");
      } else {
        const salt = await bcrypt.genSalt();
        req.body.newpassword = await bcrypt.hash(req.body.newpassword, salt);
        user = await User.findByIdAndUpdate(req.params.id, {
          password: req.body.newpassword,
        });
        res.send(true);
      }
    }
  } catch (error) {
    console.log(error);
  }
};

/*exports.decodepass= async (req, res, next) =>{
    try{
        const user = await User.findById(req.params.id)
        const password =  bcrypt.
        console.log(password);
    }
    catch(error){
        res.send(error);
    }
}*/

/*exports.getAll = async (req, res, next) => {
    try{
        console.log('catch')
        let users = await User.find({});
        console.log(users);
        return res.send(users);
    }
    catch(error){

    }
}

exports.get = async (req, res, next) => {
    try{
        const user = await User.findById(req.params.id);
        if (user) res.send(user);
    }
    catch(error){
        res.send(error);
    }
}

exports.delete = async (req, res, next) => {
    try{
        //xoa cart
        console.log(req.params.id);
        let cart = await Cart.findOne({staffId:req.params.id});
        if (cart) cart = await Cart.findByIdAndRemove(cart._id);

        const user = await User.findByIdAndRemove(req.params.id);
        console.log(user);
        res.send(true);
        
    }
    catch(error){
        console.log(error);
    }
}

exports.update = async (req,res,next) =>{
    try{
        console.log('catch')
        let check = await User.findOne({username: req.body.username})
        
        if (check && req.params.id!=check._id){
            console.log(req.params.id);
            console.log(check.id)
            console.log(1)
            return res.send('username');
        }
        else{
            const user = await User.findByIdAndUpdate(req.params.id, req.body);
            console.log(2)
            return res.send('success')
        }
    }
    catch(error){
        console.log(error);
    }
}

exports.changePass = async (req,res,next) =>{
    try{
        if (req.body.util==='forgot'){
            console.log(req.body);
            if (req.body.newpassword !== req.body.confirmpassword){
                res.send('wrong');
            }
            else{
                const salt = await bcrypt.genSalt();
                req.body.newpassword = await bcrypt.hash(req.body.newpassword, salt);
                let user = await User.findByIdAndUpdate(req.params.id, {password:req.body.newpassword});
                const token = createToken(user._id, user.role);
        const auth = jwt.sign({
            id: user._id,
            username: user.username,
            role: user.role,
        }, process.env.SECRECT_KEY, {expiresIn: 3 * 24 * 60 * 60})
        res.cookie('jwt', token, {httpOnly: true, maxAge: 3 * 24 * 60 * 60 * 1000});
                res.send(auth);
            }
        }
        console.log(req.body)
        if (req.body.newpassword===undefined){
            let user = await User.findById(req.params.id);
            const password = await bcrypt.compare(req.body.password, user.password);
            if (!password){
                res.send('incorrected')
                console.log("Password incorrected")
                return next(new ApiError(500,"Password incorrected"));
            }
            else{
                res.send(true)
            }
        }
        else{
        let user = await User.findById(req.params.id);
        const password = await bcrypt.compare(req.body.password, user.password);
        if (!password){
            res.send('incorrected')
            console.log("Password incorrected")
            return next(new ApiError(500,"Password incorrected"));
        }
        else{
            if (req.body.newpassword !== req.body.confirmpassword){
                res.send('wrong');
            }
            else{
                const salt = await bcrypt.genSalt();
                req.body.newpassword = await bcrypt.hash(req.body.newpassword, salt);
                user = await User.findByIdAndUpdate(req.params.id, {password:req.body.newpassword});
                res.send(true);
            }
        }}
        
    }
    catch(error){
        console.log(error)
    }
}*/

exports.forgotPass = async (req, res, next) => {
  try {
    console.log(req.body);
    let user = await User.findOne({ email: req.body.email });
    if (!user) {
      user = await User.findOne({ username: req.body.email });

      if (!user) return res.send(false);
      else {
        console.log("yes");
        const message = `link đổi mật khẩu: http://localhost:3001/forgotpassword/${user._id}/`;
        await sendEmail(user.email, "Quên mật khẩu", message);
        res.send(true);
      }
    } else {
      console.log("yes");
      const message = `link đổi mật khẩu: http://localhost:3001/forgotpassword/${user._id}/`;
      await sendEmail(user.email, "Quên mật khẩu", message);
      res.send(true);
    }
  } catch (error) {
    console.log(error);
  }
};

/*exports.findByEmailOrUsername = async (req, res) =>{
    try{
        console.log(req.query);
        const user = await User.findOne({
            email: req.query.userLog
        });

        if (!user){
            user = await User.find({
                name: { $regex: new RegExp(req), $options: "i"},
            });
        }
        return user;
    }
    catch(error){
        console.log(error);
    }
}*/
