const ApiError = require("../api-error");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const sendEmail = require("../utils/nodemailer");
const db = require("../utils/mysql.util");

const createToken = (id, username, chucvu) => {
  return jwt.sign({ id, username, chucvu }, process.env.SECRECT_KEY, {
    expiresIn: 3 * 24 * 60 * 60,
  });
};

exports.login = async (req, res, next) => {
  try {
    console.log(req.body);
    let result = await new Promise((resolve, reject) => {
      db.query(
        `SELECT username, matkhau, chucvu, id FROM NHAN_VIEN WHERE username = '${req.body.username}'`,
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
      //console.log(req.body.matkhau, ",", result[0].matkhau);
      const matkhau = await bcrypt.compare(req.body.matkhau, result[0].matkhau);
      if (!matkhau) {
        res.send("incorrected");
        console.log("matkhau incorrected");
        return next(new ApiError(500, "matkhau incorrected"));
      }
      /*
          if (result.verify === false) {
            res.send("not verified");
            console.log("not verified");
            return next(new ApiError(500, "not verified"));
          }*/
      const token = createToken(
        result[0].id,
        result[0].username,
        result[0].chucvu
      );
      res.cookie("jwt", token, {
        httpOnly: true,
        maxAge: 3 * 24 * 60 * 60 * 1000,
      });
      res.send(token);
      console.log(token);
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
    console.log(req.body);
    let error = [0, 0, 0];
    let result = await new Promise((resolve, reject) => {
      db.query(
        `SELECT username FROM NHAN_VIEN WHERE username = '${req.body.username}'`,
        function (err, result, fields) {
          if (err) {
            reject(err);
          } else resolve(result);
        }
      );
    });
    console.log(result);
    if (result.length != 0) {
      error[2] = 1;
    }
    result = await new Promise((resolve, reject) => {
      db.query(
        `SELECT email FROM NHAN_VIEN WHERE email = '${req.body.email}'`,
        function (err, result, fields) {
          if (err) {
            reject(err);
          } else resolve(result);
        }
      );
    });
    if (result.length != 0) {
      error[0] = 1;
    }
    result = await new Promise((resolve, reject) => {
      db.query(
        `SELECT manhanvien FROM NHAN_VIEN WHERE manhanvien = '${req.body.manhanvien}'`,
        function (err, result, fields) {
          if (err) {
            reject(err);
          } else resolve(result);
        }
      );
    });
    if (result.length != 0) {
      error[1] = 1;
    }
    if (error[0] != 0 || error[1] != 0 || error[2] != 0) {
      return res.send(error);
    } else {
      let salt = await bcrypt.genSalt();
      req.body.matkhau = await bcrypt.hash(req.body.matkhau, salt);
      salt = await bcrypt.genSalt();
      let id = await bcrypt.hash(req.body.manhanvien, salt);
      id = id.replace("/", "a");
      if (req.body.anhdaidien != "user-img.jpg")
        req.body.anhdaidien = id + "-pic.png";
      db.query(
        `INSERT INTO NHAN_VIEN (username, manhanvien, matkhau, sodienthoai, email, chucvu, hoten, id, gioitinh, anhdaidien) VALUES ('${req.body.username}', '${req.body.manhanvien}','${req.body.matkhau}', '${req.body.sodienthoai}','${req.body.email}', '${req.body.chucvu}', '${req.body.hoten}', '${id}', '${req.body.gioitinh}', '${req.body.anhdaidien}')`,
        function (e) {
          if (e) throw e;
        }
      );
      res.send(id);
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
    console.log(req.body);
    let error = [0, 0, 0];
    let result = await new Promise((resolve, reject) => {
      db.query(
        `SELECT * FROM NHAN_VIEN WHERE id = '${req.body.id}'`,
        function (err, result) {
          if (err) {
            reject(err);
          } else resolve(result);
        }
      );
    });
    if (result.length === 0) {
      res.send("not found");
      return console.log("user not existed");
    } else {
      let matkhau = result[0].matkhau;
      result = await new Promise((resolve, reject) => {
        db.query(
          `SELECT email, id FROM NHAN_VIEN WHERE email = '${req.body.email}'`,
          function (err, result) {
            if (err) {
              reject(err);
            } else resolve(result);
          }
        );
      });
      if (result.length != 0 && req.body.id != result[0].id) {
        error[0] = 1;
      }
      result = await new Promise((resolve, reject) => {
        db.query(
          `SELECT manhanvien, id FROM NHAN_VIEN WHERE manhanvien = '${req.body.manhanvien}'`,
          function (err, result) {
            if (err) {
              reject(err);
            } else resolve(result);
          }
        );
      });
      if (result.length != 0 && req.body.id != result[0].id) {
        error[1] = 1;
      }
      result = await new Promise((resolve, reject) => {
        db.query(
          `SELECT username, id FROM NHAN_VIEN WHERE username = '${req.body.username}'`,
          function (err, result) {
            if (err) {
              reject(err);
            } else resolve(result);
          }
        );
      });
      if (result.length != 0 && req.body.id != result[0].id) {
        error[2] = 1;
      }
      if (error[0] === 0 && error[1] === 0 && error[2] === 0) {
        if (req.body.util === "admin") {
          
          if (req.body.matkhau != null && req.body.matkhau != undefined) {
            console.log("new pass", req.body.matkhau);
            const salt = await bcrypt.genSalt();
            matkhau = await bcrypt.hash(req.body.matkhau, salt);
          }
          console.log(matkhau);
          db.query(
            `UPDATE NHAN_VIEN SET manhanvien = '${req.body.manhanvien}',matkhau = '${matkhau}',sodienthoai = '${req.body.sodienthoai}',email = '${req.body.email}',chucvu = '${req.body.chucvu}',hoten = '${req.body.hoten}',gioitinh = '${req.body.gioitinh}',anhdaidien = '${req.body.anhdaidien}',username = '${req.body.username}' WHERE id = '${req.body.id}'`,
            function (e) {
              if (e) throw e;
            }
          );
        } else {
          //console.log(`UPDATE NHAN_VIEN SET sodienthoai = '${req.body.sodienthoai}' AND email = '${req.body.email}' AND hoten = '${req.body.hoten}' AND gioitinh = '${req.body.gioitinh}' AND anhdaidien = '${req.body.anhdaidien}' WHERE id = '${req.body.id}'`)
          db.query(
            `UPDATE NHAN_VIEN SET sodienthoai = '${req.body.sodienthoai}',email = '${req.body.email}',hoten = '${req.body.hoten}',gioitinh = '${req.body.gioitinh}',anhdaidien = '${req.body.anhdaidien}',username = '${req.body.username}' WHERE id = '${req.body.id}'`,
            function (e, r) {
              if (e) throw e;
              else {
                console.log(r);
              }
            }
          );
        }
        return res.send(true);
      } else {
        res.send(error);
        return console.log(error);
      }
    }
  } catch (error) {
    console.log(error);
  }
};

exports.get = async (req, res, next) => {
  try {
    //console.log(req.params.id);
    db.query(
      `SELECT * FROM NHAN_VIEN WHERE id = '${req.params.id}'`,
      function (err, result, fields) {
        if (err) {
          throw err;
        } else {
          if (result.length === 0) {
            res.send(null);
            console.log("null");
          } else {
            res.send(result[0]);
          }
        }
      }
    );
  } catch (error) {
    res.send(error);
  }
};

exports.getMSNV = async (req, res, next) => {
  try {
    //console.log(req.params.id);
    db.query(
      `SELECT * FROM NHAN_VIEN WHERE manhanvien = '${req.params.manhanvien}'`,
      function (err, result, fields) {
        if (err) {
          throw err;
        } else {
          if (result.length === 0) {
            res.send(null);
            console.log("null");
          } else {
            res.send(result[0]);
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
    db.query(`SELECT * FROM NHAN_VIEN`, function (err, result, fields) {
      if (err) {
        throw err;
      } else {
        res.send(result);
      }
    });
  } catch (error) {
    res.send(error);
  }
};

exports.delete = async (req, res, next) => {
  try {
    console.log(req.params.id);
    db.query(
      `DELETE FROM NHAN_VIEN WHERE id = '${req.params.id}'`,
      function (err, result) {
        if (err) {
          throw err;
        } else {
          res.send(true);
        }
      }
    );
  } catch (error) {
    res.send(error);
  }
};

exports.changePass = async (req, res, next) => {
  try {
    let token;
    let result = await new Promise((rs, rj) => {
      db.query(
        `SELECT * from NHAN_VIEN WHERE id = '${req.body.id}'`,
        function (e, r) {
          if (e) rj(e);
          else rs(r);
        }
      );
    });
    console.log(req.body);
    if (req.body.util !== "forgot") {
      const matkhau = await bcrypt.compare(req.body.matkhau, result[0].matkhau);
      if (!matkhau) {
        res.send("incorrected");
        console.log("matkhau incorrected");
        return next(new ApiError(500, "matkhau incorrected"));
      }
    } else {
      if (req.body.newpassword !== req.body.confirmpassword) {
        res.send("wrong");
        return console.log("matkhau not match");
      }
      token = createToken(result[0].id, result[0].username, result[0].chucvu);
      res.cookie("jwt", token, {
        httpOnly: true,
        maxAge: 3 * 24 * 60 * 60 * 1000,
      });
    }

    const salt = await bcrypt.genSalt();
    req.body.newpassword = await bcrypt.hash(req.body.newpassword, salt);
    db.query(
      `UPDATE NHAN_VIEN SET matkhau = '${req.body.newpassword}' WHERE id = '${req.body.id}'`,
      function (e) {
        if (e) throw e;
        else res.send(token);
      }
    );
  } catch (error) {
    console.log(error);
  }
};

exports.forgotPass = async (req, res, next) => {
  try {
    console.log(req.body);
    let result = await new Promise((resolve, reject) => {
      db.query(
        `SELECT * FROM NHAN_VIEN WHERE username = '${req.body.email}' OR email = '${req.body.email}'`,
        function (e, result) {
          if (e) reject(e);
          else resolve(result);
        }
      );
    });
    console.log(result);
    if (result.length === 0) {
      res.send(false);
      return console.log("not found");
    } else {
      const message = `link đổi mật khẩu: http://localhost:3002/forgotpassword/${result[0].id}`;
      res.send(true);
      await sendEmail(result[0].email, "Quên mật khẩu", message);
    }
  } catch (error) {
    console.log(error);
  }
};

/*exports.getAll = async (req, res, next) => {
    try{
        console.log('catch')
        let NHAN_VIEN = await User.find({});
        console.log(NHAN_VIEN);
        return res.send(NHAN_VIEN);
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
        let cart = await Cart.findOne({manhanvien:req.params.id});
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
                let user = await User.findByIdAndUpdate(req.params.id, {matkhau:req.body.newpassword});
                const token = createToken(user._id, user.chucvu);
        const auth = jwt.sign({
            id: user._id,
            username: user.username,
            chucvu: user.chucvu,
        }, process.env.SECRECT_KEY, {expiresIn: 3 * 24 * 60 * 60})
        res.cookie('jwt', token, {httpOnly: true, maxAge: 3 * 24 * 60 * 60 * 1000});
                res.send(auth);
            }
        }
        console.log(req.body)
        if (req.body.newpassword===undefined){
            let user = await User.findById(req.params.id);
            const matkhau = await bcrypt.compare(req.body.matkhau, user.matkhau);
            if (!matkhau){
                res.send('incorrected')
                console.log("matkhau incorrected")
                return next(new ApiError(500,"matkhau incorrected"));
            }
            else{
                res.send(true)
            }
        }
        else{
        let user = await User.findById(req.params.id);
        const matkhau = await bcrypt.compare(req.body.matkhau, user.matkhau);
        if (!matkhau){
            res.send('incorrected')
            console.log("matkhau incorrected")
            return next(new ApiError(500,"matkhau incorrected"));
        }
        else{
            if (req.body.newpassword !== req.body.confirmpassword){
                res.send('wrong');
            }
            else{
                const salt = await bcrypt.genSalt();
                req.body.newpassword = await bcrypt.hash(req.body.newpassword, salt);
                user = await User.findByIdAndUpdate(req.params.id, {matkhau:req.body.newpassword});
                res.send(true);
            }
        }}
        
    }
    catch(error){
        console.log(error)
    }
}*/

/*exports.findByEmailOrUsername = async (req, res) =>{
    try{
        console.log(req.query);
        const user = await User.findOne({
            email: req.query.userLog
        });

        if (!user){
            user = await User.find({
                hoten: { $regex: new RegExp(req), $options: "i"},
            });
        }
        return user;
    }
    catch(error){
        console.log(error);
    }
}*/
