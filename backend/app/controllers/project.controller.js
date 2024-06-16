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

exports.getType = async (req, res, next) => {
  try {
    console.log(req.params.type)
    db.query(
      `SELECT * FROM DU_AN WHERE loai = '${req.params.type}'`,
      function (e, r) {
        if (e)
          return next(
            new ApiError(
              500,
              `Error retrieving project with type = ${req.params.type}`
            )
          );
        else {
          console.log(r);
          return res.send(r);}
      }
    );
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
      const date = new Date().toISOString().split(".")[0];
      result = await new Promise((rs, rj) => {
        db.query(
          `INSERT INTO DU_AN (Ten, Ma, MoTa, TrangThai, ThoiGianBatDauDuAn, ThoiGianKetThucDuAn, ThoiGianBatDauDauThau, ThoiGianKetThucDauThau, ThoiGianNghiemThu, ThoiGianBaoHanh, loai, ThoiGianChinhSuaLanCuoi, id_NguoiTao, id_NguoiChinhSuaLanCuoi) VALUES ('${req.body.Ten}','${req.body.Ma}', '${req.body.MoTa}', '${req.body.TrangThai}', '${req.body.ThoiGianBatDauDuAn}', '${req.body.ThoiGianKetThucDuAn}', '${req.body.ThoiGianBatDauDauThau}', '${req.body.ThoiGianKetThucDauThau}', '${req.body.ThoiGianNghiemThu}', '${req.body.ThoiGianBaoHanh}', '${req.body.loai}', '${date}', '${req.body.id_NguoiTao}', '${req.body.id_NguoiChinhSuaLanCuoi}')`,
          function (e, r) {
            if (e) rj(e);
            else rs(r);
          }
        );
      });
      console.log(result.insertId);

      db.query(
        `INSERT INTO QUYEN_DUAN (quyen, id_duan, loai) VALUES ('${req.body.QuyenXem}', '${result.insertId}', 'xem')`
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
        console.log(userid);
        while (i < userid.length) {
          db.query(
            `INSERT INTO QUYEN_DUAN (quyen, id_duan, id_nguoichinhsua, loai) VALUES ('${req.body.QuyenChinhSua}', '${result.insertId}','${userid[i]}', 'chinhsua')`
          );
          i++;
        }
      } else {
        db.query(
          `INSERT INTO QUYEN_DUAN (quyen, id_duan, loai) VALUES ('${req.body.QuyenChinhSua}', '${result.insertId}', 'chinh sua')`
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
      i=0;
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
      const date = new Date().toJSON();
      db.query(
        `UPDATE DU_AN SET Ten = '${req.body.Ten}' AND loai = '${req.body.loai}' AND Ma = '${req.body.Ma}' AND MoTa = '${req.body.MoTa}' AND TrangThai = '${req.body.TrangThai}' AND ThoiGianBatDauDuAn = '${req.body.ThoiGianBatDauDuAn}' AND ThoiGianKetThucDuAn='${req.body.ThoiGianKetThucDuAn}' AND ThoiGianBatDauDauThau'=${req.body.ThoiGianBatDauDauThau}' AND ThoiGianKetThucDauThau='${req.body.ThoiGianKetThucDauThau}' AND ThoiGianNghiemThu = '${req.body.ThoiGianNghiemThu}' AND ThoiGianBaoHanh = '${req.body.ThoiGianBaoHanh}') AND ThoiGianChinhSuaLanCuoi = '${date}' WHERE id = ${req.body.id}`
      );
      return res.send(true);
    }
  } catch (e) {
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
        else return res.send(true);
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
