const db = require("../utils/mysql.util");

exports.create = async (req, res) => {
  try {
    let s = await new Promise((rs, rj) => {
      db.query(
        `INSERT INTO THONG_TIN_CAI_DAT_HE_THONG (HienTrangHeThong, GhiChu, id_DuAn, PhanMemNgoai, id_NguoiTao, id_NguoiCapNhat, DonViSuDung, NoiCaiDatSourceCode) VALUES ('${req.body.HienTrangHeThong}', '${req.body.GhiChu}', '${req.body.id_DuAn}', '${req.body.PhanMemNgoai}', '${req.body.id_NguoiTao}', '${req.body.id_NguoiCapNhat}', '${req.body.DonViSuDung}', '${req.body.NoiCaiDatSourceCode}')`,
        function (e, r) {
          if (e) throw e;
          else rs(r);
        }
      );
    });
    let i = 0;
    let count = 0;
    let server = [];
    for (count = 0; count < req.body.server; count++) {
      let temp = {};
      for (const [key, value] of Object.entries(req.body)) {
        if (key === `DSServer[${count}][ten]`) {
          temp.ten = value;
        }
        if (key === `DSServer[${count}][loai]`) {
          temp.loai = value;
        }
        if (key === `DSServer[${count}][ngonngu]`) {
          temp.ngonngu = value;
        }
        if (key === `DSServer[${count}][pmkhac]`) {
          temp.pmkhac = value;
        }
        if (key === `DSServer[${count}][IP]`) {
          temp.IP = value;
        }
        if (key === `DSServer[${count}][hdh]`) {
          temp.hdh = value;
        }
        if (key === `DSServer[${count}][ram]`) {
          temp.ram = value;
        }
        if (key === `DSServer[${count}][ocung]`) {
          temp.ocung = value;
        }
        if (key === `DSServer[${count}][cardmanhinh]`) {
          temp.cardmanhinh = value;
        }
        if (key === `DSServer[${count}][ghichu]`) {
          temp.ghichu = value;
        }
        if (key === `DSServer[${count}][csdl]`) {
          temp.csdl = value;
        }
        if (key === `DSServer[${count}][moitruong]`) {
          temp.moitruong = value;
        }
      }
      server.push(temp);
    }
    console.log(req.body);
    console.log(server);
    while (i < server.length) {
      db.query(
        `INSERT INTO SERVER (IP, loai, ten, hdh, csdl, ngonngu, ghichu, ocung, ram, cardmanhinh, id_HT, pmkhac, moitruong) VALUES ('${server[i].IP}', '${server[i].loai}', '${server[i].ten}','${server[i].hdh}', '${server[i].csdl}', '${server[i].ngonngu}', '${server[i].ghichu}','${server[i].ocung}', '${server[i].ram}', '${server[i].cardmanhinh}', '${s.insertId}', '${server[i].pmkhac}', '${server[i].moitruong}')`
      );
      i++;
    }
    return res.send(true);
  } catch (e) {
    console.log(e);
    return res.send(e);
  }
};

exports.update = async (req, res) => {
  try {
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
    let settinglist = await new Promise((rs, rj) => {
      db.query(
        `SELECT * FROM THONG_TIN_CAI_DAT_HE_THONG WHERE id_DuAn='${req.params.id}'`,
        function (e, r) {
          if (e) throw e;
          else rs(r);
        }
      );
    });
    let i = 0;
    while (i < settinglist.length) {
      settinglist[i].NguoiTao = {};
      let nt = await new Promise((rs, rj) => {
        db.query(
          `SELECT * FROM NHAN_VIEN WHERE id='${settinglist[i].id_NguoiTao}'`,
          function (e, r) {
            if (e) throw e;
            else rs(r);
          }
        );
      });
      settinglist[i].NguoiTao = nt[0];
      settinglist[i].NguoiCapNhat = {};
      let ncn = await new Promise((rs, rj) => {
        db.query(
          `SELECT * FROM NHAN_VIEN WHERE id='${settinglist[i].id_NguoiCapNhat}'`,
          function (e, r) {
            if (e) throw e;
            else rs(r);
          }
        );
      });
      settinglist[i].NguoiCapNhat = ncn[0];
      settinglist[i].DSServer = [];
      let sv = await new Promise((rs, rj) => {
        db.query(
          `SELECT * FROM SERVER WHERE id_HT='${settinglist[i].id}'`,
          function (e, r) {
            if (e) throw e;
            else rs(r);
          }
        );
      });
      settinglist[i].DSServer = sv;
      i++;
    }
    return res.send(settinglist);
  } catch (e) {
    console.log(e);
    return res.send(e);
  }
};

exports.delete = async (req, res) => {
  try {
    db.query(
      `DELETE FROM THONG_TIN_CAI_DAT_HE_THONG WHERE id='${req.params.id}'`,
      function (e, r) {
        if (e) throw e;
        else {
          db.query(
            `DELETE FROM SERVER WHERE id_HT='${req.params.id}'`,
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
  } catch (e) {
    console.log(e);
    return res.send(e);
  }
};

exports.updateServer = async (req, res) => {
  try {
    db.query(
      `UPDATE SERVER SET IP='${req.body.IP}', loai='${req.body.loai}', ten='${req.body.ten}', hdh='${req.body.hdh}', csdl='${req.body.csdl}', ngonngu='${req.body.ngonngu}', ghichu='${req.body.ghichu}', ocung='${req.body.ocung}', ram='${req.body.ram}', cardmanhinh='${req.body.cardmanhinh}', pmkhac='${req.body.pmkhac}', moitruong='${req.body.moitruong}' WHERE id='${req.body.id}'`,
      function (e, r) {
        if (e) throw e;
        else {
          return res.send(true);
        }
      }
    );
  } catch (e) {
    console.log(e);
    return res.send(e);
  }
};

exports.deleteServer = async (req, res) => {
  try {
    db.query(`DELETE FROM SERVER WHERE id='${req.params.id}'`, function (e, r) {
      if (e) throw e;
      else {
        return res.send(true);
      }
    });
  } catch (e) {
    console.log(e);
    return res.send(e);
  }
};
