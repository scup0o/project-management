const ApiError = require("../api-error");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const sendEmail = require("../utils/nodemailer");
const db = require("../utils/mysql.util");
require("dotenv").config();

const createToken = (id, username, chucvu) => {
  return jwt.sign({ id, username, chucvu }, process.env.SECRECT_KEY, {
    expiresIn: 3 * 24 * 60 * 60,
  });
};

exports.login = async (req, res, next) => {
  try {
    //console.log(req.body);
    let result = await new Promise((resolve, reject) => {
      db.query(
        `SELECT username, matkhau, chucvu, khoa, id FROM NHAN_VIEN WHERE username = '${req.body.username}'`,
        async function (e, result) {
          if (e) reject(e);
          else resolve(result);
        }
      );
    });
    //console.log(result);

    if (result.length === 0) {
      return res.send("user not found");
    } else {
      if (result[0].khoa === 1) {
        //console.log('lock')
        return res.send("lock");
      }
      //console.log(req.body.matkhau, ",", result[0].matkhau);
      const matkhau = await bcrypt.compare(req.body.matkhau, result[0].matkhau);
      if (!matkhau) {
        return res.send("incorrected");
      }
      const token = createToken(
        result[0].id,
        result[0].username,
        result[0].chucvu
      );
      res.cookie("jwt", token, {
        httpOnly: true,
        maxAge: 3 * 24 * 60 * 60 * 1000,
      });
      return res.send(token);
    }
  } catch (error) {
    return next(new ApiError(500, "An error occurred while login in"));
  }
};

exports.logout = (req, res) => {
  try {
    res.cookie("jwt", "", { httpOnly: true, maxAge: 1 });
    return true;
  } catch (error) {
    //console.log(error);
    return next(new ApiError(500, "An error occurred while loging out"));
  }
};

exports.create = async (req, res, next) => {
  try {
    //console.log(req.body);
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
    //console.log(result);
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
    if (error[0] != 0 || error[1] != 0 || error[2] != 0) {
      return res.send(error);
    } else {
      let salt = await bcrypt.genSalt();
      req.body.matkhau = await bcrypt.hash(req.body.matkhau, salt);
      db.query(
        `INSERT INTO NHAN_VIEN (username, matkhau, sodienthoai, email, chucvu, hoten, gioitinh, anhdaidien) VALUES ('${req.body.username}', '${req.body.matkhau}', '${req.body.sodienthoai}','${req.body.email}', '${req.body.chucvu}', '${req.body.hoten}', '${req.body.gioitinh}', '${req.body.anhdaidien}')`,
        function (e, r) {
          if (e) throw e;
          else {
            if (req.body.anhdaidien != "user-img.jpg")
              req.body.anhdaidien = r.insertId + "-pic.png";
            db.query(
              `UPDATE NHAN_VIEN SET anhdaidien='${req.body.anhdaidien}' WHERE id='${r.insertId}'`,
              function (e, r) {
                if (e) throw e;
              }
            );
            return res.send(req.body.anhdaidien);
          }
        }
      );
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
    //console.log(req.body);
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
            //console.log("new pass", req.body.matkhau);
            const salt = await bcrypt.genSalt();
            matkhau = await bcrypt.hash(req.body.matkhau, salt);
          }
          //console.log(matkhau);
          db.query(
            `UPDATE NHAN_VIEN SET matkhau = '${matkhau}',sodienthoai = '${req.body.sodienthoai}',email = '${req.body.email}',chucvu = '${req.body.chucvu}',hoten = '${req.body.hoten}',gioitinh = '${req.body.gioitinh}',anhdaidien = '${req.body.anhdaidien}',username = '${req.body.username}' WHERE id = '${req.body.id}'`,
            function (e) {
              if (e) throw e;
            }
          );
        } else {
          //console.log(`UPDATE NHAN_VIEN SET sodienthoai = '${req.body.sodienthoai}' AND email = '${req.body.email}' AND hoten = '${req.body.hoten}' AND gioitinh = '${req.body.gioitinh}' AND anhdaidien = '${req.body.anhdaidien}' WHERE id = '${req.body.id}'`)
          db.query(
            `UPDATE NHAN_VIEN SET sodienthoai = '${req.body.sodienthoai}',email = '${req.body.email}',hoten = '${req.body.hoten}',anhdaidien = '${req.body.anhdaidien}' WHERE id = '${req.body.id}'`,
            function (e, r) {
              if (e) throw e;
              else {
                //console.log(r);
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
    return res.send(error);
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
            //console.log("null");
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
            //console.log("null");
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
    //console.log(req.params.id);
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
    console.log(req.body)
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
    //console.log(req.body);
    if (req.body.util !== "forgot") {
      const matkhau = await bcrypt.compare(req.body.matkhau, result[0].matkhau);
      if (!matkhau) {
        res.send("incorrected");
        return next(new ApiError(500, "matkhau incorrected"));
      }
    } else {
      if (req.body.newpassword !== req.body.confirmpassword) {
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
    //console.log(error);
  }
};

exports.forgotPass = async (req, res, next) => {
  try {
    //console.log(req.body);
    let type = "username";
    let result = await new Promise((resolve, reject) => {
      db.query(
        `SELECT * FROM NHAN_VIEN WHERE username = '${req.body.email}'`,
        function (e, result) {
          if (e) reject(e);
          else {
            if (result.length === 0) {
              db.query(
                `SELECT * FROM NHAN_VIEN WHERE email = '${req.body.email}'`,
                function (e, result) {
                  if (e) reject(e);
                  else {
                    type = "email";
                    resolve(result);
                  }
                }
              );
            } else {
              resolve(result);
            }
          }
        }
      );
    });
    //console.log(result);
    if (result.length === 0) {
      res.send(false);
      return console.log("not found");
    } else {
      if (result[0].khoa === 1) {
        return res.send("lock");
      }
      let salt = await bcrypt.genSalt();
      db.query(
        `INSERT INTO id_quenmatkhau (id, id_nhanvien) VALUES ('${salt}', '${result[0].id}')`
      );
      const message = `link đổi mật khẩu: http://${process.env.FE_HOST}:${process.env.FE_PORT}/forgotpassword/${salt}/`;
      let char1 = result[0].email[0];
      console.log(char1);
      let char2 = result[0].email.split("@")[0];
      char2 = char2[char2.length - 1];
      let j = 0;
      let email = char1 + "";
      while (j < result[0].email.length - 12) {
        email = email + "*";
        j++;
      }
      email = email + char2 + "@gmail.com";
      console.log(type)
      if (type ==='username') res.send(email);
      else res.send("email");
      await sendEmail(result[0].email, "Quên mật khẩu", message);
    }
  } catch (error) {
    console.log(error);
  }
};

exports.lock = async (req, res, next) => {
  try {
    let i = 0;
    if (req.body.w === "lock") i = 1;
    db.query(`UPDATE NHAN_VIEN SET khoa='${i}' WHERE id='${req.body.id}'`);
    return res.send(true);
  } catch (e) {
    console.log(e);
    return res.send(e);
  }
};

exports.checklink = async (req, res, next) => {
  try {
    console.log(req.params.id);
    db.query(
      `SELECT * FROM id_quenmatkhau WHERE id='${req.params.id}'`,
      function (e, r) {
        if (e) throw e;
        else {
          if (r.length === 0) res.send(false);
          else {
            /*const timeZone = "Asia/Ho_Chi_Minh";
          const date = new Date();
          const formatter = new Intl.DateTimeFormat("vi-VN", {
            timeZone,
            hour12: false, // You can set this to true/false based on your preference
            day: "numeric",
            month: "numeric",
            year: "numeric",
            hour: "numeric",
            minute: "numeric",
            second: "numeric",
          });

          const timeInTimeZone = formatter.format(date);*/

            let Difference_In_Time = new Date() - new Date(r[0].thoigiantao);
            let Difference_In_Minutes = Math.round(
              ((Difference_In_Time % 86400000) % 3600000) / 60000
            );
            console.log(
              new Date().toISOString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" })
            );
            console.log(new Date());
            console.log(new Date(r[0].thoigiantao));
            console.log(Difference_In_Minutes);
            if (Difference_In_Minutes >= 15) {
              return res.send(false);
            } else {
              return res.send(r[0]);
            }
          }
        }
      }
    );
  } catch (e) {
    console.log(e);
    return res.send(e);
  }
};
