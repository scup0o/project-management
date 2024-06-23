const ApiError = require("../api-error");
const db = require("../utils/mysql.util");

exports.upload = async (req, res) => {
  try {
    if (!req.files || Object.keys(req.files).length === 0) {
      console.log(req);
      console.log("no");
      return res.status(400).send("No files were uploaded.");
    } else {
      let fileuploaded = Object.values(req.files)[0];
      console.log(Object.values(fileuploaded));
      temp = Object.values(fileuploaded);
      console.log(fileuploaded);
      let s = "img";
      if (!fileuploaded.mimetype.includes("image")) s = "file";

      fileuploaded.mv(
        __dirname +
          `../../../../frontend/src/assets/${s}/` +
          req.params.filename,
        function (err) {
          if (err) {
            console.log(err);
          } else {
            console.log(req.params.filename);
          }
        }
      );
      res.send(true);
    }
  } catch (error) {
    console.log(error);
  }
};

exports.get = async (req, res, next) => {
  try {
    //console.log(req.body);
    let result = await new Promise((rs, rj) => {
      db.query(
        `SELECT * FROM TAI_LIEU WHERE id_DuAn = '${req.body.id_da}' ORDER BY id`,
        function (e, r) {
          if (e) throw e;
          else {
            rs(r);
          }
        }
      );
    });
    let i = 0;
    let j = 0;
    while (i < result.length) {
      result[i].QuyenXem = "";
      result[i].QuyenChinhSua = "";
      result[i].DSNguoiXem = [];
      result[i].DSNguoiChinhSua = [];
      result[i].LichSu = [];
      result[i].NguoiTao = {};
      let p = await new Promise((rs, rj) => {
        db.query(
          `SELECT * FROM QUYEN_TAILIEU WHERE id_tailieu = '${result[i].id}'`,
          async function (e, r) {
            if (e) throw e;
            else {
              rs(r);
            }
          }
        );
      });

      j = 0;
      while (
        (j < p.length && result[i].QuyenXem === "") ||
        result[i].QuyenChinhSua === ""
      ) {
        if (p[j].loaiQuyen === "xem") {
          if (result[i].QuyenXem === "") {
            if (p[j].quyen === "chi minh toi") {
              if (p[j].id_nguoichinhsua != req.body.id_user) {
                result.splice(i, 1);
                break;
              } else {
                result[i].QuyenXem = "chi minh toi";
              }
            } else {
              if (p[j].quyen === "tat ca") {
                result[i].QuyenXem = "tat ca";
              }
              if (p[j].quyen === "tuy chinh") {
                let temp = await new Promise((rs, rj) => {
                  db.query(
                    `SELECT * FROM QUYEN_TAILIEU WHERE id_tailieu='${result[i].id}' AND loaiQuyen='xem'`,
                    async function (e, r) {
                      if (e) throw e;
                      else {
                        rs(r);
                      }
                    }
                  );
                });
                let index = -1;
                index = temp.findIndex(
                  (x) => x.id_nguoichinhsua === req.body.id_user
                );
                if (index === -1) {
                  result.splice(i, 1);
                  break;
                } else {
                  result[i].QuyenXem = "tuy chinh";
                  let DSNguoiXem = temp;

                  let k = 0;
                  while (k < DSNguoiXem.length) {
                    let user = await new Promise((rs, rj) => {
                      db.query(
                        `SELECT * FROM NHAN_VIEN WHERE id='${DSNguoiXem[k].id_nguoichinhsua}'`,
                        function (e, r) {
                          if (e) throw e;
                          else rs(r);
                        }
                      );
                    });
                    result[i].DSNguoiXem.push(user[0]);
                    k++;
                  }
                }
              }
            }
          }
        } else if (result[i].QuyenChinhSua === "") {
          if (p[j].quyen === "chi minh toi") {
            result[i].QuyenChinhSua = "chi minh toi";
            if (p[j].id_nguoichinhsua != req.body.id_user) {
              result[i].e = false;
            } else {
              result[i].e = true;
            }
          } else {
            if (p[j].quyen === "tat ca") {
              result[i].QuyenChinhSua = "tat ca";
              result[i].e = true;
            }
            if (p[j].quyen === "tuy chinh") {
              result[i].QuyenChinhSua = "tuy chinh";
              let temp = await new Promise((rs, rj) => {
                db.query(
                  `SELECT * FROM QUYEN_TAILIEU WHERE id_tailieu='${result[i].id}' AND loaiQuyen='chinhsua'`,
                  function (e, r) {
                    if (e) throw e;
                    else {
                      rs(r);
                    }
                  }
                );
              });
              //console.log(temp);
              let index = -1;
              index = temp.findIndex(
                (x) => x.id_nguoichinhsua === req.body.id_user
              );
              if (index === -1) {
                result[i].e = false;
              } else {
                result[i].e = true;
              }
              let DSNguoiChinhSua = temp;
              let k = 0;
              while (k < DSNguoiChinhSua.length) {
                let user = await new Promise((rs, rj) => {
                  db.query(
                    `SELECT * FROM NHAN_VIEN WHERE id='${DSNguoiChinhSua[k].id_nguoichinhsua}'`,
                    function (e, r) {
                      if (e) throw e;
                      else rs(r);
                    }
                  );
                });
                result[i].DSNguoiChinhSua.push(user[0]);
                k++;
              }
            }
          }
        }
        j++;
      }

      i++;
    }
    i = 0;
    while (i < result.length) {
      let m = await new Promise((rs, rj) => {
        db.query(
          `SELECT * FROM NHAN_VIEN WHERE id='${result[i].id_NguoiTao}'`,
          function (e, r) {
            if (e) throw e;
            else rs(r);
          }
        );
      });
      result[i].NguoiTao = m[0];

      let t = await new Promise((rs, rj) => {
        db.query(
          `SELECT * FROM LICH_SU WHERE id_TaiLieu='${result[i].id}' ORDER BY ThoiGianChinhSua DESC`,
          function (e, r) {
            if (e) throw e;
            else rs(r);
          }
        );
      });
      result[i].LichSu = t;
      i++;
    }

    //console.log(result);
    return res.send(result);
  } catch (e) {
    console.log(e);
    return next(
      new ApiError(500, `Error retrieving project with id = ${req.params.id}`)
    );
  }
};

exports.create = async (req, res, next) => {
  try {
    //console.log(req.body);
    if (req.body.step === "check") {
      let result = await new Promise((rs, rj) => {
        db.query(
          `SELECT * FROM TAI_LIEU WHERE TenTaiLieu='${req.body.TenTaiLieu}'`,
          function (e, r) {
            if (e) rj(e);
            else {
              rs(r);
            }
          }
        );
      });
      if (result.length != 0) {
        let i = 0;
        while (i < result.length) {
          if (req.body.id_DuAn.toString() === result[i].id_DuAn.toString()) {
            return res.send(false);
          }
          i++;
        }
      }
      return res.send(true);
    } else {
      let result = await new Promise((rs, rj) => {
        db.query(
          `INSERT INTO TAI_LIEU (TenTaiLieu, LoaiTaiLieu, GiaiDoan, id_DuAn, id_NguoiTao, LoaiFile) VALUES ('${req.body.TenTaiLieu}', '${req.body.LoaiTaiLieu}', '${req.body.GiaiDoan}', '${req.body.id_DuAn}', '${req.body.id_NguoiTao}', '${req.body.extension}')`,
          function (e, r) {
            if (e) throw e;
            else rs(r);
          }
        );
      });
      db.query(
        `INSERT INTO LICH_SU (id_DuAn, id_NguoiChinhSua, id_TaiLieu) VALUES ('${req.body.id_DuAn}', '${req.body.id_NguoiTao}', '${result.insertId}')`
      );
      let count = 0;
      let i = 0;
      if (req.body.QuyenXem === "tuy chinh") {
        let userid = [];
        for (const [key, value] of Object.entries(req.body)) {
          if (key === `DSNguoiXem[${count}][id]`) {
            userid.push(value);
            count++;
          }
        }
        while (i < userid.length) {
          db.query(
            `INSERT INTO QUYEN_TAILIEU (id_tailieu, id_nguoichinhsua, quyen, loaiQuyen) VALUES ('${result.insertId}', '${userid[i]}', '${req.body.QuyenXem}', 'xem')`
          );
          i++;
        }
      } else
        db.query(
          `INSERT INTO QUYEN_TAILIEU (id_tailieu, id_nguoichinhsua, quyen, loaiQuyen) VALUES ('${result.insertId}', '${req.body.id_NguoiTao}', '${req.body.QuyenXem}', 'xem')`
        );
      if (req.body.QuyenChinhSua === "tuy chinh") {
        let userid = [];
        count = 0;
        i = 0;
        for (const [key, value] of Object.entries(req.body)) {
          if (key === `DSNguoiChinhSua[${count}][id]`) {
            userid.push(value);
            count++;
          }
        }
        i = 0;
        while (i < userid.length) {
          db.query(
            `INSERT INTO QUYEN_TAILIEU (id_tailieu, id_nguoichinhsua, quyen, loaiQuyen) VALUES ('${result.insertId}', '${userid[i]}', '${req.body.QuyenChinhSua}', 'chinhsua')`
          );
          i++;
        }
      } else
        db.query(
          `INSERT INTO QUYEN_TAILIEU (id_tailieu, id_nguoichinhsua, quyen, loaiQuyen) VALUES ('${result.insertId}', '${req.body.id_NguoiTao}', '${req.body.QuyenChinhSua}', 'chinhsua')`
        );
      let temp = await new Promise((rs, rj) => {
        db.query(
          `SELECT * FROM LICH_SU WHERE id_TaiLieu='${result.insertId}'`,
          function (e, r) {
            if (e) throw e;
            else rs(r);
          }
        );
      });
      let temp2 = await new Promise((rs, rj) => {
        db.query(
          `SELECT * FROM NHAN_VIEN WHERE id='${req.body.id_NguoiTao}'`,
          function (e, r) {
            if (e) throw e;
            else rs(r);
          }
        );
      });
      let s =
        (await result.insertId.toString()) +
        temp2[0].manhanvien.toString() +
        temp[0].ThoiGianChinhSua.toISOString();
      //console.log(s);
      s = await s.replace(":", "a");
      s = await s.replace(":", "a");
      let b = new String(s) + req.body.extension;
      db.query(
        `UPDATE LICH_SU SET TenFile='${b}' WHERE id_TaiLieu='${result.insertId}'`
      );
      //console.log(s);
      return res.send(s);
    }
  } catch (e) {
    console.log(e);
    return next(
      new ApiError(500, `Error retrieving project with id = ${req.params.id}`)
    );
  }
};

exports.update = async (req, res, next) => {
  try {
    let s;
    console.log(req.body);
    if (req.body.step === "check") {
      let result = await new Promise((rs, rj) => {
        db.query(
          `SELECT * FROM TAI_LIEU WHERE TenTaiLieu='${req.body.TenTaiLieu}'`,
          function (e, r) {
            if (e) rj(e);
            else {
              rs(r);
            }
          }
        );
      });
      if (result.length != 0) {
        let i = 0;
        while (i < result.length) {
          if (
            req.body.id.toString() != result[i].id.toString() &&
            req.body.id_DuAn === result[i].id_DuAn
          ) {
            console.log("giong", result[i]);
            return res.send(false);
          }
          i++;
        }
      }
      return res.send(true);
    }
    if (req.body.file != "no") {
      let temp2 = await new Promise((rs, rj) => {
        db.query(
          `SELECT * FROM NHAN_VIEN WHERE id='${req.body.id_NguoiChinhSua}'`,
          function (e, r) {
            if (e) throw e;
            else rs(r);
          }
        );
      });
      let doc = await new Promise((rs, rj) => {
        db.query(
          `INSERT INTO LICH_SU (id_DuAn, id_NguoiChinhSua, id_TaiLieu) VALUES ('${req.body.id_DuAn}', '${req.body.id_NguoiChinhSua}', '${req.body.id}')`,
          function (e, r) {
            if (e) throw e;
            else rs(r);
          }
        );
      });
      let temp = await new Promise((rs, rj) => {
        db.query(
          `SELECT * FROM LICH_SU WHERE id_TaiLieu='${req.body.id}' AND id_NguoiChinhSua='${req.body.id_NguoiChinhSua}'`,
          function (e, r) {
            if (e) throw e;
            else rs(r);
          }
        );
      });
      //console.log(temp[temp.length - 1].ThoiGianChinhSua);
      s =
        (await req.body.id.toString()) +
        temp2[0].manhanvien.toString() +
        temp[temp.length - 1].ThoiGianChinhSua.toISOString();
      //console.log(s);
      s = await s.replace(":", "a");
      s = await s.replace(":", "a");
      let b = new String(s) + req.body.extension;
      db.query(
        `UPDATE LICH_SU SET TenFile='${b}' WHERE id_TaiLieu='${req.body.id}' && stt='${doc.insertId}'`
      );
    }

    if (req.body.check === "normal-update") {
      db.query(
        `UPDATE TAI_LIEU SET LoaiFile='${req.body.extension}' WHERE id='${req.body.id}'`
      );
    } else {
      if ((req.body.file = "no")) {
        req.body.extension = req.body.LoaiFile;
      }
      let docu = await new Promise((rs, rj) => {
        db.query(
          `UPDATE TAI_LIEU SET LoaiFile='${req.body.extension}', LoaiTaiLieu='${req.body.LoaiTaiLieu}', TenTaiLieu='${req.body.TenTaiLieu}', GiaiDoan='${req.body.tempGiaiDoan}' WHERE id='${req.body.id}'`,
          function (e, r) {
            if (e) throw e;
            else rs(r);
          }
        );
      });
      db.query(`DELETE FROM QUYEN_TAILIEU WHERE id_tailieu='${req.body.id}'`);
      let count = 0;
      let i = 0;
      if (req.body.QuyenXem === "tuy chinh") {
        let userid = [];
        for (const [key, value] of Object.entries(req.body)) {
          if (key === `DSNguoiXem[${count}][id]`) {
            userid.push(value);
            count++;
          }
        }
        while (i < userid.length) {
          db.query(
            `INSERT INTO QUYEN_TAILIEU (id_tailieu, id_nguoichinhsua, quyen, loaiQuyen) VALUES ('${req.body.id}', '${userid[i]}', '${req.body.QuyenXem}', 'xem')`
          );
          i++;
        }
      } else
        db.query(
          `INSERT INTO QUYEN_TAILIEU (id_tailieu, id_nguoichinhsua, quyen, loaiQuyen) VALUES ('${req.body.id}', '${req.body.id_NguoiTao}', '${req.body.QuyenXem}', 'xem')`
        );
      if (req.body.QuyenChinhSua === "tuy chinh") {
        let userid = [];
        count = 0;
        i = 0;
        for (const [key, value] of Object.entries(req.body)) {
          if (key === `DSNguoiChinhSua[${count}][id]`) {
            userid.push(value);
            count++;
          }
        }
        i = 0;
        while (i < userid.length) {
          db.query(
            `INSERT INTO QUYEN_TAILIEU (id_tailieu, id_nguoichinhsua, quyen, loaiQuyen) VALUES ('${req.body.id}', '${userid[i]}', '${req.body.QuyenChinhSua}', 'chinhsua')`
          );
          i++;
        }
      } else
        db.query(
          `INSERT INTO QUYEN_TAILIEU (id_tailieu, id_nguoichinhsua, quyen, loaiQuyen) VALUES ('${req.body.id}', '${req.body.id_NguoiTao}', '${req.body.QuyenChinhSua}', 'chinhsua')`
        );
    }
    return res.send(s);
  } catch (e) {
    return next(
      new ApiError(500, `Error retrieving project with id = ${req.params.id}`)
    );
  }
};

exports.delete = async (req, res, next) => {
  try {
    db.query(`DELETE FROM TAI_LIEU WHERE id = '${req.params.id}'`);
    db.query(`DELETE FROM QUYEN_TAILIEU WHERE id_tailieu = '${req.params.id}'`);
    db.query(`DELETE FROM LICH_SU WHERE id_TaiLieu = '${req.params.id}'`);
    return res.send(true);
  } catch (e) {console.log(e);
    return res.send(e)
  }
};
