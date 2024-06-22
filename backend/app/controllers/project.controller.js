const ApiError = require("../api-error");
const db = require("../utils/mysql.util");
const bcrypt = require("bcrypt");

exports.get = async (req, res, next) => {
  try {
    db.query(
      `SELECT * FROM DU_AN WHERE id = '${req.params.id}'`,
      function (e, r) {
        if (e)
          return next(
            new ApiError(
              500,
              `Error retrieving project with id = ${req.params.id}`
            )
          );
        else return res.send(r);
      }
    );
  } catch (e) {
    return next(
      new ApiError(500, `Error retrieving project with id = ${req.params.id}`)
    );
  }
};

exports.getQuyen = async (req, res, next) => {
  try {
    //console.log("catch");
    let i = 0;
    let DS_TG = [];
    let DS_CS = [];
    let qx;
    let qcs;
    let r = await new Promise((rs, rj) => {
      db.query(
        `SELECT * FROM QUYEN_DUAN WHERE id_duan = '${req.params.da}'`,
        async function (e, r) {
          if (e) rj(e);
          else {
            rs(r);
          }
        }
      );
    });
    while (i < r.length) {
      if (r[i].loaiQuyen === "xem") {
        qx = r[i].quyen;
      } else {
        qcs = r[i].quyen;
        if (qcs === "tuy chinh") {
          let k = await new Promise((rs, rj) => {
            db.query(
              `SELECT * FROM NHAN_VIEN WHERE id = '${r[i].id_nguoichinhsua}'`,
              function (e, r) {
                if (e) rj(e);
                else {
                  rs(r);
                }
              }
            );
          });
          DS_CS.push(k[0]);
        } else {
          let k = await new Promise((rs, rj) => {
            db.query(
              `SELECT * FROM DU_AN WHERE id = '${req.params.da}'`,
              function (e, r) {
                if (e) rj(e);
                else {
                  rs(r);
                }
              }
            );
          });
          let m = await new Promise((rs, rj) => {
            db.query(
              `SELECT * FROM NHAN_VIEN WHERE id = '${k[0].id_NguoiTao}'`,
              function (e, r) {
                if (e) rj(e);
                else {
                  rs(r);
                }
              }
            );
          });

          DS_CS.push(m[0]);
        }
      }
      i++;
    }
    //console.log(DS_CS);
    let temp = await new Promise((rs, rj) => {
      db.query(
        `SELECT * FROM THAM_GIA WHERE id_DuAn = '${req.params.da}'`,
        function (e, r) {
          if (e) rj(e);
          else rs(r);
        }
      );
    });
    //console.log(temp);
    i = temp.length - 1;
    while (i >= 0) {
      DS_TG.push(temp[i].id_NhanVien);
      i--;
    }
    //console.log("tg");
    //console.log(DS_TG);

    let rs = { DS_TG: [], DS_CS: [], qx: "", qcs: "" };
    rs.DS_CS = DS_CS;
    rs.DS_TG = DS_TG;
    rs.qx = qx;
    rs.qcs = qcs;
    //console.log(rs);
    return res.send(rs);
  } catch (e) {
    console.log(e);
    return next(
      new ApiError(500, `Error retrieving project with id = ${req.params.id}`)
    );
  }
};

exports.getType = async (req, res, next) => {
  try {
    //console.log(req.params.type);
    if (req.params.type != "chia se")
      db.query(
        `SELECT * FROM DU_AN WHERE loai = '${req.params.type}' AND id_NguoiTao = '${req.body.id}' ORDER BY id DESC`,
        async function (e, r) {
          if (e)
            return next(
              new ApiError(
                500,
                `Error retrieving project with type = ${req.params.type}`
              )
            );
          else {
            let i = 0;
            while (i < r.length) {
              let Difference_In_Time =
                r[i].ThoiGianBaoHanh.getTime() - new Date().getTime();

              // Calculating the no. of days between
              // two dates
              let Difference_In_Days = Math.round(
                Difference_In_Time / (1000 * 3600 * 24)
              );
              r[i].Han = Difference_In_Days;

              if (r[i].id_GiaHan != 0) {
                let t = await new Promise((rs, rj) => {
                  db.query(
                    `SELECT * FROM DU_AN WHERE id='${r[i].id_GiaHan}'`,
                    function (e, r) {
                      if (e) throw e;
                      else rs(r);
                    }
                  );
                });
                r[i].DuAnGiaHan = t[0];
              }

              i++;
            }

            return res.send(r);
          }
        }
      );
    else {
      db.query(
        `SELECT * FROM DU_AN da JOIN THAM_GIA tg ON da.id=tg.id_DuAn JOIN QUYEN_DUAN q ON q.id_duan=da.id WHERE da.loai = 'chia se' AND tg.id_NhanVien = '${req.body.id}' OR q.quyen!='chi minh toi' AND q.loaiQuyen !='chinh sua' ORDER BY id DESC`,
        async function (e, r) {
          if (e)
            return next(
              new ApiError(
                500,
                `Error retrieving project with type = ${req.params.type}`
              )
            );
          else {
            let i = 0;
            while (i < r.length) {
              let Difference_In_Time =
                r[i].ThoiGianBaoHanh.getTime() - new Date().getTime();

              // Calculating the no. of days between
              // two dates
              let Difference_In_Days = Math.round(
                Difference_In_Time / (1000 * 3600 * 24)
              );
              r[i].Han = Difference_In_Days;
              if (r[i].id_GiaHan != 0) {
                let t = await new Promise((rs, rj) => {
                  db.query(
                    `SELECT * FROM DU_AN WHERE id='${r[i].id_GiaHan}'`,
                    function (e, r) {
                      if (e) throw e;
                      else rs(r);
                    }
                  );
                });
                r[i].DuAnGiaHan = t[0];
              }

              i++;
            }
            //console.log(r);
            i = 0;
            let t;

            while (i < r.length) {
              if (r[i].loai != "chia se") r.splice(i, 1);
              else i++;
            }
            i = 0;
            while (i < r.length) {
              if (r[i].quyen != "tat ca" && r[i].id_NhanVien != req.body.id) {
                // console.log(r[i].id_DuAn);
                r.splice(i, 1);
              } else {
                if (i === 0 || r[i].id_DuAn != t) {
                  //console.log(r[i].id_DuAn);
                  let temp = await new Promise((rs, rj) => {
                    db.query(
                      `SELECT * FROM QUYEN_DUAN WHERE id_duan = '${r[i].id_DuAn}' AND loaiQuyen='chinh sua'`,
                      function (e, re) {
                        if (e) rj(e);
                        else {
                          rs(re);
                        }
                      }
                    );
                  });
                  let l = 0;
                  if (temp[0].quyen === "chi minh toi") {
                    if (r[i].id_NguoiTao === req.body.id) r[i].e = true;
                    else [i].e = false;
                  }
                  if (temp[0].quyen === "nguoi co quyen xem") r[i].e = true;
                  if (temp[0].quyen === "tuy chinh") {
                    while (l < temp.length) {
                      if (temp[l].id_nguoichinhsua === req.body.id) {
                        r[i].e = true;
                        break;
                      } else {
                        r[i].e = false;
                      }
                      l++;
                    }
                  }
                  i++;
                  t = r[i - 1].id_DuAn;
                } else {
                  r.splice(i, 1);
                }
              }
            }

            i = 0;
            while (i < r.length) {
              let temp = await new Promise((rs, rj) => {
                db.query(
                  `SELECT * FROM THONG_TIN_HE_THONG WHERE id_DuAn = '${r[i].id_DuAn}'`,
                  function (e, re) {
                    if (e) rj(e);
                    else {
                      rs(re);
                    }
                  }
                );
              });
              if (temp.length === 0) {
                r.ttht = false;
              } else {
                r.ttht = true;
              }
              i++;
            }
            //console.log(r);
            return res.send(r);
          }
        }
      );
    }
  } catch (e) {
    return next(
      new ApiError(
        500,
        `Error retrieving project with type = ${req.params.type}`
      )
    );
  }
};

exports.getAll = async (req, res, next) => {
  try {
    db.query(`SELECT * FROM DU_AN`, function (e, r) {
      if (e) return next(new ApiError(500, `Error retrieving project`));
      else return res.send(r);
    });
  } catch (e) {
    return next(new ApiError(500, `Error retrieving project`));
  }
};

exports.create = async (req, res, next) => {
  try {
    let error = [0, 0];
    //console.log(req.body);
    if (req.body.step === "check") {
      let result = await new Promise((rs, rj) => {
        db.query(
          `SELECT * FROM DU_AN WHERE Ma = '${req.body.Ma}'`,
          function (e, r) {
            if (e) rj(e);
            else rs(r);
          }
        );
      });
      if (result.length != 0) {
        error[0] = 1;
      }
      result = await new Promise((rs, rj) => {
        db.query(
          `SELECT * FROM DU_AN WHERE Ten = '${req.body.Ten}'`,
          function (e, r) {
            if (e) rj(e);
            else rs(r);
          }
        );
      });
      if (result.length != 0) {
        error[1] = 1;
      }

      return res.send(error);
    } else {
      result = await new Promise((rs, rj) => {
        db.query(
          `INSERT INTO DU_AN (id_GiaHan, KhachHang, Ten, Ma, MoTa, TrangThai, ThoiGianBatDauDuAn, ThoiGianKetThucDuAn, ThoiGianBatDauDauThau, ThoiGianKetThucDauThau, ThoiGianNghiemThu, ThoiGianBaoHanh, loai,  id_NguoiTao, id_NguoiChinhSuaLanCuoi) VALUES ('${req.body.id_GiaHan}','${req.body.KhachHang}','${req.body.Ten}','${req.body.Ma}', '${req.body.MoTa}', '${req.body.TrangThai}', '${req.body.ThoiGianBatDauDuAn}', '${req.body.ThoiGianKetThucDuAn}', '${req.body.ThoiGianBatDauDauThau}', '${req.body.ThoiGianKetThucDauThau}', '${req.body.ThoiGianNghiemThu}', '${req.body.ThoiGianBaoHanh}', '${req.body.loai}', '${req.body.id_NguoiTao}', '${req.body.id_NguoiChinhSuaLanCuoi}')`,
          function (e, r) {
            if (e) rj(e);
            else rs(r);
          }
        );
      });
      //console.log(result.insertId);

      db.query(
        `INSERT INTO QUYEN_DUAN (quyen, id_duan, loaiQuyen, id_nguoichinhsua) VALUES ('${req.body.QuyenXem}', '${result.insertId}', 'xem', '${req.body.id_NguoiTao}')`
      );
      let i = 0;
      let count = 0;
      if (req.body.QuyenChinhSua === "tuy chinh") {
        let userid = [];
        for (const [key, value] of Object.entries(req.body)) {
          if (key === `DSNguoiChinhSua[${count}][id]`) {
            userid.push(value);
            count++;
          }
        }
        //console.log(userid);
        while (i < userid.length) {
          db.query(
            `INSERT INTO QUYEN_DUAN (quyen, id_duan, id_nguoichinhsua, loaiQuyen) VALUES ('${req.body.QuyenChinhSua}', '${result.insertId}','${userid[i]}', 'chinh sua')`
          );
          i++;
        }
      } else {
        db.query(
          `INSERT INTO QUYEN_DUAN (quyen, id_duan, loaiQuyen) VALUES ('${req.body.QuyenChinhSua}', '${result.insertId}', 'chinh sua')`
        );
      }
      count = 0;
      let userid2 = [];
      for (const [key, value] of Object.entries(req.body)) {
        if (key === `DSNguoiThamGia[${count}][id]`) {
          userid2.push(value);
          count++;
        }
      }
      i = 0;
      while (i < userid2.length) {
        db.query(
          `INSERT INTO THAM_GIA (id_DuAn, id_NhanVien) VALUES ('${result.insertId}', '${userid2[i]}')`
        );
        i++;
      }

      return res.send(true);
    }

    /*
            const salt = await bcrypt.genSalt();
            let Ma = await bcrypt.hash(req.body.ten, salt);
            Ma = Ma.replace("/","a");*/
  } catch (e) {
    return console.log(e);
  }
};

exports.update = async (req, res, next) => {
  try {
    let error = [0, 0];
    //console.log(req.body);
    if (req.body.step === "check") {
      let result = await new Promise((rs, rj) => {
        db.query(
          `SELECT * FROM DU_AN WHERE Ma = '${req.body.Ma}'`,
          function (e, r) {
            if (e) rj(e);
            else rs(r);
          }
        );
      });
      if (result.length != 0 && req.body.id != result[0].id) {
        error[0] = 1;
      }
      result = await new Promise((rs, rj) => {
        db.query(
          `SELECT * FROM DU_AN WHERE Ten = '${req.body.Ten}'`,
          function (e, r) {
            if (e) rj(e);
            else rs(r);
          }
        );
      });
      if (result.length != 0 && req.body.id != result[0].id) {
        error[1] = 1;
      }

      return res.send(error);
    } else {
      if (req.body.check === "update-admin") {
        result = await new Promise((rs, rj) => {
          db.query(
            `UPDATE DU_AN SET id_GiaHan='${req.body.id_GiaHan}', KhachHang='${req.body.KhachHang}', id_NguoiChinhSuaLanCuoi = '${req.body.id_NguoiChinhSuaLanCuoi}', Ten = '${req.body.Ten}', loai = '${req.body.loai}', Ma = '${req.body.Ma}', MoTa = '${req.body.MoTa}', TrangThai = '${req.body.TrangThai}', ThoiGianBatDauDuAn = '${req.body.ThoiGianBatDauDuAn}', ThoiGianKetThucDuAn='${req.body.ThoiGianKetThucDuAn}', ThoiGianBatDauDauThau='${req.body.ThoiGianBatDauDauThau}', ThoiGianKetThucDauThau='${req.body.ThoiGianKetThucDauThau}', ThoiGianNghiemThu = '${req.body.ThoiGianNghiemThu}', ThoiGianBaoHanh = '${req.body.ThoiGianBaoHanh}' WHERE id = ${req.body.id}`,
            function (e, r) {
              if (e) rj(e);
              else rs(r);
            }
          );
        });

        db.query(`DELETE FROM QUYEN_DUAN WHERE id_duan = '${req.body.id}'`);
        db.query(
          `INSERT INTO QUYEN_DUAN (quyen, id_duan, id_nguoichinhsua, loaiQuyen) VALUES ('${req.body.QuyenXem}', '${req.body.id}','${req.body.id_NguoiTao}', 'xem')`
        );
        let i = 0;
        let count = 0;
        if (req.body.QuyenChinhSua === "tuy chinh") {
          let userid = [];
          for (const [key, value] of Object.entries(req.body)) {
            if (key === `DSNguoiChinhSua[${count}][id]`) {
              userid.push(value);
              count++;
            }
          }

          while (i < userid.length) {
            db.query(
              `INSERT INTO QUYEN_DUAN (quyen, id_duan, id_nguoichinhsua, loaiQuyen) VALUES ('${req.body.QuyenChinhSua}', '${req.body.id}','${userid[i]}', 'chinh sua')`
            );
            i++;
          }
        } else {
          db.query(
            `INSERT INTO QUYEN_DUAN (quyen, id_duan, loaiQuyen) VALUES ('${req.body.QuyenChinhSua}', '${req.body.id}', 'chinh sua')`
          );
        }
        count = 0;
        let userid2 = [];
        db.query(`DELETE FROM THAM_GIA WHERE id_DuAn = '${req.body.id}'`);
        for (const [key, value] of Object.entries(req.body)) {
          if (key === `DSNguoiThamGia[${count}][id]`) {
            userid2.push(value);
            count++;
          }
        }
        i = 0;
        while (i < userid2.length) {
          db.query(
            `INSERT INTO THAM_GIA (id_DuAn, id_NhanVien) VALUES ('${req.body.id}', '${userid2[i]}')`
          );
          i++;
        }
        return res.send(true);
      } else {
        //console.log('here')
        db.query(
          `UPDATE DU_AN SET id_GiaHan='${req.body.id_GiaHan}', KhachHang='${req.body.KhachHang}',id_NguoiChinhSuaLanCuoi = '${req.body.id_NguoiChinhSuaLanCuoi}', Ten = '${req.body.Ten}', Ma = '${req.body.Ma}', MoTa = '${req.body.MoTa}', TrangThai = '${req.body.TrangThai}', ThoiGianBatDauDuAn = '${req.body.ThoiGianBatDauDuAn}', ThoiGianKetThucDuAn='${req.body.ThoiGianKetThucDuAn}', ThoiGianBatDauDauThau='${req.body.ThoiGianBatDauDauThau}', ThoiGianKetThucDauThau='${req.body.ThoiGianKetThucDauThau}', ThoiGianNghiemThu = '${req.body.ThoiGianNghiemThu}', ThoiGianBaoHanh = '${req.body.ThoiGianBaoHanh}' WHERE id = ${req.body.id}`,
          function (e, r) {
            if (e) throw e;
            else return res.send(true);
          }
        );
      }
    }
  } catch (e) {
    console.log(e);
    return next(new ApiError(500, `Error updating project`));
  }
};

exports.delete = async (req, res, next) => {
  try {
    db.query(
      `DELETE FROM DU_AN WHERE id = '${req.params.id}'`,
      function (e, r) {
        if (e)
          return next(
            new ApiError(
              500,
              `Error deleting project with id = ${req.params.id}`
            )
          );
        else {
          db.query(
            `DELETE FROM QUYEN_DUAN WHERE id_duan = '${req.params.id}'`,
            function (e, r) {
              if (e) throw e;
              else {
                db.query(
                  `DELETE FROM THAM_GIA WHERE id_DuAn = '${req.params.id}'`,
                  function (e, r) {
                    if (e) throw e;
                    else {
                      return res.send(true);
                    }
                  }
                );
              }
            }
          );
        }
      }
    );
  } catch (e) {
    return next(
      new ApiError(500, `Error deleting project with id = ${req.params.id}`)
    );
  }
};

exports.deleteAll = async (req, res, next) => {
  try {
    db.query(`DELETE FROM DU_AN`, function (e, r) {
      if (e)
        return next(
          new ApiError(500, `Error deleting project with id = ${req.params.id}`)
        );
      else return res.send(true);
    });
  } catch (e) {
    return next(
      new ApiError(500, `Error deleting project with id = ${req.params.id}`)
    );
  }
};

exports.archive = async (req, res, next) => {
  try {
    let loai = "luu tru";
    //console.log(req.body);
    if (req.body.confirm === "false") {
      let result = await new Promise((rs, rj) => {
        db.query(
          `SELECT quyen FROM QUYEN_DUAN WHERE loaiQuyen='xem' AND id_duan = '${req.body.id}'`,
          function (e, r) {
            if (e) rj(e);
            else rs(r);
          }
        );
      });
      if (result[0].quyen === "chi minh toi") {
        loai = "ca nhan";
      } else {
        loai = "chia se";
      }
      //console.log(loai);
    }
    db.query(
      `UPDATE DU_AN SET loai = '${loai}' WHERE id = '${req.params.id}'`,
      function (e, r) {
        if (e)
          return next(
            new ApiError(
              500,
              `Error archiving project with id = ${req.params.id}`
            )
          );
        else {
          //console.log(r);
          return res.send(true);
        }
      }
    );
  } catch (e) {
    return next(
      new ApiError(500, `Error archiving project with id = ${req.params.id}`)
    );
  }
};

exports.tat = async (req, res, next) => {
  try {
    db.query(`UPDATE DU_AN SET TB='0' WHERE id='${req.params.id}'`)
    return res.send(true)
  } catch (e) {
    return next(
      new ApiError(500, `Error archiving project with id = ${req.params.id}`)
    );
  }
};

exports.bat = async (req, res, next) => {
  try {
    db.query(`UPDATE DU_AN SET TB='1' WHERE id='${req.params.id}'`)
    return res.send(true)

  } catch (e) {
    return next(
      new ApiError(500, `Error archiving project with id = ${req.params.id}`)
    );
  }
};

