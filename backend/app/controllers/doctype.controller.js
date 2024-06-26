const ApiError = require("../api-error");
const db = require("../utils/mysql.util");
const bcrypt = require("bcrypt");

exports.get = async (req, res, next) => {
  try {
    db.query(
      `SELECT * FROM DANH_MUC WHERE id = '${req.params.id}'`,
      function (e, r) {
        if (e)
          return next(
            new ApiError(
              500,
              `Error retrieving doctype with id = ${req.params.id}`
            )
          );
        else return res.send(r);
      }
    );
  } catch (e) {
    return next(
      new ApiError(500, `Error retrieving doctype with id = ${req.params.id}`)
    );
  }
};

exports.getType = async (req, res, next) => {
  try {
    //console.log('catch')
    //console.log(req.params.type)
    db.query(
      `SELECT * FROM DANH_MUC WHERE giaiDoan = '${req.params.type}'`,
      function (e, r) {
        if (e) throw e;
        else {
          //console.log(r);
          return res.send(r);
        }
      }
    );
  } catch (e) {
    return next(
      new ApiError(500, `Error retrieving doctype with id = ${req.params.id}`)
    );
  }
};

exports.getAll = async (req, res, next) => {
  try {
    //console.log(req.params.type)
    db.query(`SELECT * FROM DANH_MUC WHERE loai='${req.params.type}'`, function (e, r) {
      if (e) return next(new ApiError(500, `Error retrieving doctype`));
      else return res.send(r);
    });
  } catch (e) {
    return next(new ApiError(500, `Error retrieving doctype`));
  }
};

exports.create = async (req, res, next) => {
  try {
    //console.log(req.body);
    let result = await new Promise((rs, rj) => {
      db.query(
        `SELECT * FROM DANH_MUC WHERE ten = '${req.body.ten}' AND loai='${req.body.loai}'`,
        function (e, r) {
          if (e) rj(e);
          else rs(r);
        }
      );
    });
    if (result.length != 0) {
      return res.send(false);
    } else {
      if (req.body.loai === "loaitailieu")
        db.query(
          `INSERT INTO DANH_MUC (ten, giaiDoan, loai) VALUES ('${req.body.ten}','${req.body.giaiDoan}', '${req.body.loai}')`
        );
      else
        db.query(
          `INSERT INTO DANH_MUC (ten, loai) VALUES ('${req.body.ten}','${req.body.loai}')`
        );
      return res.send(true);
    }
  } catch (e) {
    return console.log(e);
  }
};

exports.update = async (req, res, next) => {
  try {
    let result = await new Promise((rs, rj) => {
      db.query(
        `SELECT * FROM DANH_MUC WHERE ten = '${req.body.ten}' AND loai = '${req.body.loai}'`,
        function (e, r) {
          if (e) rj(e);
          else rs(r);
        }
      );
    });
    if (result.length != 0 && req.body.id != result[0].id) {
      return res.send(false);
    } else {
      if (req.body.loai === "loaitailieu")
        db.query(
          `UPDATE DANH_MUC SET ten = '${req.body.ten}', giaiDoan = '${req.body.giaiDoan}' loai='loaitailieu' WHERE id = '${req.body.id}'`
        );
      else {
        db.query(
          `UPDATE DANH_MUC SET ten = '${req.body.ten}', loai='${req.body.loai}' WHERE id = '${req.body.id}'`
        );
      }
      return res.send(true);
    }
  } catch (e) {
    return next(new ApiError(500, `Error updating doctype`));
  }
};

exports.delete = async (req, res, next) => {
  try {
    db.query(
      `DELETE FROM DANH_MUC WHERE id = '${req.params.id}'`,
      function (e, r) {
        if (e)
          return next(
            new ApiError(
              500,
              `Error deleting doctype with id = ${req.params.id}`
            )
          );
        else return res.send(true);
      }
    );
  } catch (e) {
    return next(
      new ApiError(500, `Error deleting doctype with id = ${req.params.id}`)
    );
  }
};

exports.deleteAll = async (req, res, next) => {
  try {
    db.query(`DELETE FROM DANH_MUC WHERE loai='${req.params.type}'`, function (e, r) {
      if (e) throw (e)
      else return res.send(true);
    });
  } catch (e) {throw(e)
  }
};
