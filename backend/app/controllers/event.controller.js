const db = require("../utils/mysql.util");

exports.create = async (req, res) => {
  try {
    console.log(req.body);
    let event = await new Promise((rs, rj) => {
      db.query(
        `INSERT INTO SU_KIEN (TenSuKien, DiaDiemDienRaSuKien, NgayKetThucSuKien, NgayDienRaSuKien,id_NguoiTao, MoTaSuKien, id_DuAn) VALUES ('${req.body.TenSuKien}', '${req.body.DiaDiemDienRaSuKien}', '${req.body.NgayKetThucSuKien}', '${req.body.NgayDienRaSuKien}','${req.body.id_NguoiTao}','${req.body.MoTaSuKien}', '${req.body.id_DuAn}')`,
        function (e, r) {
          if (e) throw e;
          else rs(r);
        }
      );
    });
    let userid = [];
    let count = 0;
    for (const [key, value] of Object.entries(req.body)) {
      if (key === `DSNguoiThamGia[${count}][id]`) {
        userid.push(value);
        count++;
      }
    }
    count = 0;
    while (count < userid.length) {
      db.query(
        `INSERT INTO THAM_GIA_SK (id_NhanVien, id_SuKien) VALUES ('${userid[count]}', '${event.insertId}')`
      );
      count++;
    }
    return res.send(true);
  } catch (e) {
    console.log(e);
    return res.send(e);
  }
};

exports.update = async (req, res) => {
  try {
    db.query(
      `UPDATE SU_KIEN SET TenSuKien='${req.body.TenSuKien}', DiaDiemDienRaSuKien='${req.body.DiaDiemDienRaSuKien}', NgayKetThucSuKien='${req.body.NgayKetThucSuKien}', NgayDienRaSuKien='${req.body.NgayDienRaSuKien}', MoTaSuKien='${req.body.MoTaSuKien}' WHERE id='${req.body.id}'`
    );

    db.query(`DELETE FROM THAM_GIA_SK WHERE id_SuKien='${req.body.id}'`);
    let userid = [];
    let count = 0;
    for (const [key, value] of Object.entries(req.body)) {
      if (key === `DSNguoiThamGia[${count}][id]`) {
        userid.push(value);
        count++;
      }
    }
    count = 0;
    while (count < userid.length) {
      db.query(
        `INSERT INTO THAM_GIA_SK (id_NhanVien, id_SuKien) VALUES ('${userid[count]}', '${req.body.id}')`
      );
      count++;
    }
    return res.send(true);
  } catch (e) {
    console.log(e);
    return res.send(e);
  }
};

exports.get = async (req, res) => {
  try {
  } catch (e) {
    console.log(e);
    return res.send(e);
  }
};

exports.getAll = async (req, res) => {
  try {
    let event = await new Promise((rs, rj) => {
      db.query(
        `SELECT * FROM SU_KIEN WHERE id_DuAn='${req.params.id_da}' ORDER BY id DESC`,
        function (e, r) {
          if (e) throw e;
          else rs(r);
        }
      );
    });
    let i = 0;
    while (i < event.length) {
      event[i].DSNguoiThamGia = [];
      event[i].NguoiTao = {};
      let user = await new Promise((rs, rj) => {
        db.query(
          `SELECT * FROM NHAN_VIEN WHERE id='${event[i].id_NguoiTao}'`,
          function (e, r) {
            if (e) throw e;
            else rs(r);
          }
        );
      });
      event[i].NguoiTao = user[0];
      let ds = await new Promise((rs, rj) => {
        db.query(
          `SELECT * FROM THAM_GIA_SK WHERE id_SuKien='${event[i].id}'`,
          function (e, r) {
            if (e) throw e;
            else rs(r);
          }
        );
      });
      let j = 0;
      while (j < ds.length) {
        let u = await new Promise((rs, rj) => {
          db.query(
            `SELECT * FROM NHAN_VIEN WHERE id='${ds[j].id_NhanVien}'`,
            function (e, r) {
              if (e) throw e;
              else rs(r);
            }
          );
        });
        event[i].DSNguoiThamGia.push(u[0]);
        j++;
      }
      i++;
    }
    return res.send(event);
  } catch (e) {
    console.log(e);
    return res.send(e);
  }
};

exports.delete = async (req, res) => {
  try {
    db.query(`DELETE FROM SU_KIEN WHERE id='${req.params.id}'`);
    db.query(`DELETE FROM THAM_GIA_SK WHERE id_SuKien='${req.params.id}'`);
    return res.send(true);
  } catch (e) {
    console.log(e);
    return res.send(e);
  }
};
