const ApiError = require("../api-error");
const db = require("../utils/mysql.util");
const bcrypt = require("bcrypt");
var XLSX = require("xlsx");

exports.exportData = async (req, res, next) => {
  try {
    console.log("catch");

    db.query(
      "SELECT Ma, Ten, TrangThai, KhachHang, MoTa, ThoiGianBatDauDuAn, ThoiGianKetThucDuAn, ThoiGianBatDauDauThau, ThoiGianKetThucDauThau, ThoiGianNghiemThu, ThoiGianBaoHanh, hoten, email, sodienthoai, GhiChu FROM DU_AN da JOIN NHAN_VIEN nv ON da.id_NguoiTao=nv.id",
      function (e, rows, fields) {
        if (e) console.log(e);
        else {
          const heading = [
            [
              "Mã dự án",
              "Tên dự án",
              "Trạng thái",
              "Khách hàng",
              "Mô tả dự án",
              "Thời gian bắt đầu",
              "Thời gian kết thúc",
              "Thời gian bắt đầu đấu thầu",
              "Thời gian kết thúc đấu thầu",
              "Thời gian nghiệm thu",
              "Thời gian bảo hành",
              "Người tạo",
              "Email người tạo",
              "Số điện thoại người tạo",
              "Ghi chú",
            ],
          ];
          const workbook = XLSX.utils.book_new();
          const worksheet = XLSX.utils.json_to_sheet(rows);
          XLSX.utils.sheet_add_aoa(worksheet, heading);
          XLSX.utils.book_append_sheet(workbook, worksheet, "du_an");

          const buffer = XLSX.write(workbook, {
            bookType: "xlsx",
            type: "buffer",
          });
          console.log(buffer);
          res.download("data.xlsx");
          return res.send(buffer);
        }
      }
    );
  } catch (e) {
    console.log(e);
  }
};

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
    let da;
    if (req.params.type === "luu tru")
      da = await new Promise((rs, rj) => {
        db.query(
          `SELECT * FROM DU_AN WHERE loai = 'luu tru' AND id_NguoiTao = '${req.body.id}' ORDER BY id`,
          async function (e, r) {
            if (e)
              return next(
                new ApiError(
                  500,
                  `Error retrieving project with type = ${req.params.type}`
                )
              );
            else {
              rs(r);
            }
          }
        );
      });

    if (req.params.type === "ca nhan") {
      da = await new Promise((rs, rj) => {
        db.query(
          `SELECT * FROM DU_AN WHERE loai = 'chia se' AND id_NguoiTao = '${req.body.id}' ORDER BY id`,
          async function (e, r) {
            if (e)
              return next(
                new ApiError(
                  500,
                  `Error retrieving project with type = ${req.params.type}`
                )
              );
            else {
              rs(r);
            }
          }
        );
      });
    }
    if (req.params.type === "chia se") {
      da = await new Promise((rs, rj) => {
        db.query(
          `SELECT * FROM DU_AN WHERE loai='chia se' ORDER BY id`,
          async function (e, r) {
            if (e)
              return next(
                new ApiError(
                  500,
                  `Error retrieving project with type = ${req.params.type}`
                )
              );
            else {
              rs(r);
            }
          }
        );
      });
    }
    //console.log(da)
    let i = 0;
    while (i < da.length) {
      //console.log(da.length);
      da[i].NguoiTao = {};
      da[i].NguoiChinhSua = {};
      da[i].DuAnGiaHan = {};
      da[i].DS_CS = [];
      da[i].DS_TG = [];
      da[i].qx = "";
      da[i].qcs = "";
      da[i].e = true;
      da[i].kt = false;

      let Difference_In_Time = new Date(da[i].ThoiGianBaoHanh) - new Date();

      let Difference_In_Days = Math.round(
        Difference_In_Time / (1000 * 3600 * 24)
      );
      da[i].Han = Difference_In_Days + 1;
      let nt = await new Promise((rs, rj) => {
        db.query(
          `SELECT * FROM NHAN_VIEN WHERE id='${da[i].id_NguoiTao}'`,
          function (e, r) {
            rs(r);
          }
        );
      });
      da[i].NguoiTao = nt[0];

      let ncs = await new Promise((rs, rj) => {
        db.query(
          `SELECT * FROM NHAN_VIEN WHERE id='${da[i].id_NguoiChinhSuaLanCuoi}'`,
          function (e, r) {
            rs(r);
          }
        );
      });
      da[i].NguoiChinhSua = ncs[0];

      let gh = await new Promise((rs, rj) => {
        db.query(
          `SELECT * FROM DU_AN WHERE id='${da[i].id_GiaHan}'`,
          function (e, r) {
            rs(r);
          }
        );
      });
      da[i].DuAnGiaHan = gh[0];

      da[i].DS_TG = await new Promise((rs, rj) => {
        db.query(
          `SELECT * FROM THAM_GIA tg JOIN NHAN_VIEN nv ON nv.id=tg.id_NhanVien WHERE id_DuAn='${da[i].id}'`,
          function (e, r) {
            if (e) throw e;
            else {
              rs(r);
            }
          }
        );
      });

      let qcs = await new Promise((rs, rj) => {
        db.query(
          `SELECT * FROM QUYEN_DUAN WHERE id_duan='${da[i].id}' AND loaiQuyen='chinh sua'`,
          function (e, r) {
            if (e) throw e;
            else rs(r);
          }
        );
      });
      da[i].qcs = qcs[0].quyen;

      if (
        qcs[0].quyen === "chi minh toi" &&
        req.body.id != qcs[0].id_nguoichinhsua
      ) {
        da[i].e = false;
      }
      if (qcs[0].quyen === "tuy chinh") {
        db.query(
          `SELECT * FROM QUYEN_DUAN WHERE id_duan='${da[i].id}' AND id_nguoichinhsua='${req.body.id}' AND loaiQuyen='chinh sua'`,
          function (e, r) {
            if (e) throw e;
            else {
              if (r.length === 0) da[i].e = false;
            }
          }
        );
        let cs = await new Promise((rs, rj) => {
          db.query(
            `SELECT * FROM QUYEN_DUAN tg JOIN NHAN_VIEN nv ON nv.id=tg.id_nguoichinhsua WHERE id_duan='${da[i].id}' AND loaiQuyen='chinh sua'`,
            function (e, r) {
              if (e) throw e;
              else rs(r);
            }
          );
        });
        da[i].DS_CS = cs;
      }

      let kt = await new Promise((rs, rj) => {
        db.query(
          `SELECT * FROM THAM_GIA WHERE loai='kt' AND id_NhanVien='${req.body.id}' AND id_DuAn='${da[i].id}'`,
          function (e, r) {
            if (e) throw e;
            else {
              rs(r);
            }
          }
        );
      });

      if (kt.length != 0) da[i].kt = true;
      let next = true;
      let qx = await new Promise((rs, rj) => {
        db.query(
          `SELECT * FROM QUYEN_DUAN WHERE id_duan='${da[i].id}' AND loaiQuyen='xem'`,
          function (e, r) {
            if (e) throw e;
            else rs(r);
          }
        );
      });

      da[i].qx = qx[0].quyen;
      if (qx[0].quyen === "chi minh toi") {
        if (qx[0].id_nguoichinhsua === req.body.id) {
        } else {
          da.splice(i, 1);
          next = false;
          //console.log("xoa");
        }
      } else {
        if (qx[0].quyen === "nguoi tham gia") {
          let tg = await new Promise((rs, rj) => {
            db.query(
              `SELECT * FROM THAM_GIA WHERE id_DuAn='${da[i].id}' AND id_NhanVien='${req.body.id}'`,
              function (e, r) {
                if (e) console.log(e);
                else {
                  console.log(r);
                  if (r.length === 0) {
                    //console.log("xoa");
                    da.splice(i, 1);
                    next = false;
                  }
                  rs(r[0]);
                }
              }
            );
          });
        }
      }

      if (next === true) i++;
    }

    return res.send(da);
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
    let da;
    if (req.params.type === "luu tru") {
      da = await new Promise((rs, rj) => {
        db.query(
          `SELECT * FROM DU_AN WHERE loai = 'luu tru' ORDER BY id`,
          async function (e, r) {
            if (e)
              return next(
                new ApiError(
                  500,
                  `Error retrieving project with type = ${req.params.type}`
                )
              );
            else {
              rs(r);
            }
          }
        );
      });
    }

    if (req.params.type === "chia se") {
      da = await new Promise((rs, rj) => {
        db.query(
          `SELECT * FROM DU_AN WHERE loai='chia se' ORDER BY id`,
          async function (e, r) {
            if (e)
              return next(
                new ApiError(
                  500,
                  `Error retrieving project with type = ${req.params.type}`
                )
              );
            else {
              rs(r);
            }
          }
        );
      });
    }

    let i = 0;
    while (i < da.length) {
      da[i].NguoiTao = {};
      da[i].NguoiChinhSua = {};
      da[i].DuAnGiaHan = {};
      da[i].DS_TG = [];
      da[i].e = false;
      da[i].kt = true;
      let Difference_In_Time = new Date(da[i].ThoiGianBaoHanh) - new Date();

      let Difference_In_Days = Math.round(
        Difference_In_Time / (1000 * 3600 * 24)
      );
      da[i].Han = Difference_In_Days + 1;
      let nt = await new Promise((rs, rj) => {
        db.query(
          `SELECT * FROM NHAN_VIEN WHERE id='${da[i].id_NguoiTao}'`,
          function (e, r) {
            rs(r);
          }
        );
      });
      da[i].NguoiTao = nt[0];
      let ncs = await new Promise((rs, rj) => {
        db.query(
          `SELECT * FROM NHAN_VIEN WHERE id='${da[i].id_NguoiChinhSuaLanCuoi}'`,
          function (e, r) {
            rs(r);
          }
        );
      });
      da[i].NguoiChinhSua = ncs[0];
      let gh = await new Promise((rs, rj) => {
        db.query(
          `SELECT * FROM DU_AN WHERE id='${da[i].id_GiaHan}'`,
          function (e, r) {
            rs(r);
          }
        );
      });
      da[i].DuAnGiaHan = gh[0];

      da[i].DS_TG = await new Promise((rs, rj) => {
        db.query(
          `SELECT * FROM THAM_GIA tg JOIN NHAN_VIEN nv ON nv.id=tg.id_NhanVien WHERE id_DuAn='${da[i].id}'`,
          function (e, r) {
            if (e) throw e;
            else {
              rs(r);
            }
          }
        );
      });
      i++;
    }

    return res.send(da);
  } catch (e) {
    return next(new ApiError(500, `Error retrieving project`));
  }
};

exports.create = async (req, res, next) => {
  try {
    let error = [0, 0];
    console.log(req.body);
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
      if (
        typeof req.body.ThoiGianBatDauDuAn === "undefined" ||
        req.body.ThoiGianBatDauDuAn === ""
      )
        req.body.ThoiGianBatDauDuAn = "0001-01-01";
      if (
        typeof req.body.ThoiGianKetThucDuAn === "undefined" ||
        req.body.ThoiGianKetThucDuAn === ""
      )
        req.body.ThoiGianKetThucDuAn = "0001-01-01";
      if (
        typeof req.body.ThoiGianBatDauDauThau === "undefined" ||
        req.body.ThoiGianBatDauDauThau === ""
      )
        req.body.ThoiGianBatDauDauThau = "0001-01-01";
      if (
        typeof req.body.ThoiGianKetThucDauThau === "undefined" ||
        req.body.ThoiGianKetThucDauThau === ""
      )
        req.body.ThoiGianKetThucDauThau = "0001-01-01";
      if (
        typeof req.body.ThoiGianNghiemThu === "undefined" ||
        req.body.ThoiGianNghiemThu === ""
      )
        req.body.ThoiGianNghiemThu = "0001-01-01";
      if (
        typeof req.body.ThoiGianBaoHanh === "undefined" ||
        req.body.ThoiGianBaoHanh === ""
      )
        req.body.ThoiGianBaoHanh = "0001-01-01";

      result = await new Promise((rs, rj) => {
        db.query(
          `INSERT INTO DU_AN (GhiChu, LoaiThoiHan, ThoiHan, id_GiaHan, KhachHang, Ten, Ma, MoTa, TrangThai, ThoiGianBatDauDuAn, ThoiGianKetThucDuAn, ThoiGianBatDauDauThau, ThoiGianKetThucDauThau, ThoiGianNghiemThu, ThoiGianBaoHanh, loai,  id_NguoiTao, id_NguoiChinhSuaLanCuoi) VALUES ('${req.body.GhiChu}','${req.body.LoaiThoiHan}','${req.body.ThoiHan}','${req.body.id_GiaHan}','${req.body.KhachHang}','${req.body.Ten}','${req.body.Ma}', '${req.body.MoTa}', '${req.body.TrangThai}', '${req.body.ThoiGianBatDauDuAn}', '${req.body.ThoiGianKetThucDuAn}', '${req.body.ThoiGianBatDauDauThau}', '${req.body.ThoiGianKetThucDauThau}', '${req.body.ThoiGianNghiemThu}', '${req.body.ThoiGianBaoHanh}', '${req.body.loai}', '${req.body.id_NguoiTao}', '${req.body.id_NguoiChinhSuaLanCuoi}')`,
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
          `INSERT INTO QUYEN_DUAN (quyen, id_duan, loaiQuyen, id_nguoichinhsua) VALUES ('${req.body.QuyenChinhSua}', '${result.insertId}', 'chinh sua', '${req.body.id_NguoiTao}')`
        );
      }
      count = 0;
      let userid2 = [];
      let temp = { id: "", loai: "" };
      for (const [key, value] of Object.entries(req.body)) {
        if (key === `DSNguoiThamGia[${count}][id]`) {
          temp.id = value;
        }
        if (key === `DSNguoiThamGia[${count}][loai]`) temp.loai = value;
        if (temp.id != "" && temp.loai != "") {
          userid2.push(temp);
          temp = { id: "", loai: "" };
          count++;
        }
      }
      console.log(userid2);
      i = 0;
      while (i < userid2.length) {
        db.query(
          `INSERT INTO THAM_GIA (id_DuAn, id_NhanVien, loai) VALUES ('${result.insertId}', '${userid2[i].id}', '${userid2[i].loai}')`
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
            `UPDATE DU_AN SET GhiChu='${req.body.GhiChu}', ThoiHan='${req.body.ThoiHan}',LoaiThoiHan='${req.body.LoaiThoiHan}', id_GiaHan='${req.body.id_GiaHan}', KhachHang='${req.body.KhachHang}', id_NguoiChinhSuaLanCuoi = '${req.body.id_NguoiChinhSuaLanCuoi}', Ten = '${req.body.Ten}', loai = '${req.body.loai}', Ma = '${req.body.Ma}', MoTa = '${req.body.MoTa}', TrangThai = '${req.body.TrangThai}', ThoiGianBatDauDuAn = '${req.body.ThoiGianBatDauDuAn}', ThoiGianKetThucDuAn='${req.body.ThoiGianKetThucDuAn}', ThoiGianBatDauDauThau='${req.body.ThoiGianBatDauDauThau}', ThoiGianKetThucDauThau='${req.body.ThoiGianKetThucDauThau}', ThoiGianNghiemThu = '${req.body.ThoiGianNghiemThu}', ThoiGianBaoHanh = '${req.body.ThoiGianBaoHanh}' WHERE id = ${req.body.id}`,
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
            `INSERT INTO QUYEN_DUAN (quyen, id_duan, loaiQuyen, id_nguoichinhsua) VALUES ('${req.body.QuyenChinhSua}', '${req.body.id}', 'chinh sua', '${req.body.id_NguoiTao}')`
          );
        }
        count = 0;
        let userid2 = [];
        let a = await new Promise((rs, rj) => {
          db.query(
            `DELETE FROM THAM_GIA WHERE id_DuAn = '${req.body.id}'`,
            function (e, r) {
              if (e) throw e;
              else rs(r);
            }
          );
        });
        let temp = { id: "", loai: "" };
        for (const [key, value] of Object.entries(req.body)) {
          if (key === `DSNguoiThamGia[${count}][id]`) {
            temp.id = value;
          }
          if (key === `DSNguoiThamGia[${count}][loai]`) temp.loai = value;
          if (temp.id != "" && temp.loai != "") {
            userid2.push(temp);
            temp = { id: "", loai: "" };
            count++;
          }
        }
        console.log(userid2);
        i = 0;
        while (i < userid2.length) {
          db.query(
            `INSERT INTO THAM_GIA (id_DuAn, id_NhanVien, loai) VALUES ('${req.body.id}', '${userid2[i].id}', '${userid2[i].loai}')`
          );
          i++;
        }
        return res.send(true);
      } else {
        //console.log('here')
        db.query(
          `UPDATE DU_AN SET GhiChu='${req.body.GhiChu}',ThoiHan='${req.body.ThoiHan}',LoaiThoiHan='${req.body.LoaiThoiHan}', id_GiaHan='${req.body.id_GiaHan}', KhachHang='${req.body.KhachHang}',id_NguoiChinhSuaLanCuoi = '${req.body.id_NguoiChinhSuaLanCuoi}', Ten = '${req.body.Ten}', Ma = '${req.body.Ma}', MoTa = '${req.body.MoTa}', TrangThai = '${req.body.TrangThai}', ThoiGianBatDauDuAn = '${req.body.ThoiGianBatDauDuAn}', ThoiGianKetThucDuAn='${req.body.ThoiGianKetThucDuAn}', ThoiGianBatDauDauThau='${req.body.ThoiGianBatDauDauThau}', ThoiGianKetThucDauThau='${req.body.ThoiGianKetThucDauThau}', ThoiGianNghiemThu = '${req.body.ThoiGianNghiemThu}', ThoiGianBaoHanh = '${req.body.ThoiGianBaoHanh}' WHERE id = ${req.body.id}`,
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
    db.query(`UPDATE DU_AN SET TB='0' WHERE id='${req.params.id}'`);
    return res.send(true);
  } catch (e) {
    return next(
      new ApiError(500, `Error archiving project with id = ${req.params.id}`)
    );
  }
};

exports.bat = async (req, res, next) => {
  try {
    db.query(`UPDATE DU_AN SET TB='1' WHERE id='${req.params.id}'`);
    return res.send(true);
  } catch (e) {
    return next(
      new ApiError(500, `Error archiving project with id = ${req.params.id}`)
    );
  }
};
