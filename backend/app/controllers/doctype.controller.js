const ApiError = require("../api-error");
const db = require("../utils/mysql.util");
const bcrypt = require("bcrypt");


exports.get = async (req, res, next) => {
    try{
        db.query(`SELECT * FROM LOAI_TAI_LIEU WHERE id = '${req.params.id}'`, function(e, r){
            if (e) return next(new ApiError(500, `Error retrieving doctype with id = ${req.params.id}`));
            else return res.send(r);
        });
        
    }
    catch(e){
        return next(new ApiError(500, `Error retrieving doctype with id = ${req.params.id}`));
    }
}

exports.getType = async (req, res, next) => {
    try{
        //console.log('catch')
        //console.log(req.params.type)
        db.query(`SELECT * FROM LOAI_TAI_LIEU WHERE giaiDoan = '${req.params.type}'`, function(e, r){
            if (e) throw(e);
            else { //console.log(r);
                return res.send(r);}
        });
        
    }
    catch(e){
        return next(new ApiError(500, `Error retrieving doctype with id = ${req.params.id}`));
    }
}

exports.getAll = async (req, res, next) => {
    try{
        db.query(`SELECT * FROM LOAI_TAI_LIEU`, function(e, r){
            if (e) return next(new ApiError(500, `Error retrieving doctype`));
            else return res.send(r);
        });
        
    }
    catch(e){
        return next(new ApiError(500, `Error retrieving doctype`));
    }
}

exports.create = async (req, res, next) => {
    try{
        //console.log(req.body);
        let result = await new Promise((rs, rj) =>{
            db.query(`SELECT * FROM LOAI_TAI_LIEU WHERE ten = '${req.body.ten}'`, function(e, r){
            if (e) rj(e);
            else rs(r);
        });
        })
        if (result.length!=0){
            return res.send(false);
        }
        else{
            /*
            const salt = await bcrypt.genSalt();
            let id = await bcrypt.hash(req.body.ten, salt);
            id = id.replace("/","a");*/
            db.query(`INSERT INTO LOAI_TAI_LIEU (ten, giaiDoan) VALUES ('${req.body.ten}','${req.body.giaiDoan}')`)
            return res.send(true);
        }
    }
    catch(e){
        return console.log(e);
    }
}

exports.update = async (req, res, next) => {
    try{
        let result = await new Promise((rs, rj) =>{
            db.query(`SELECT * FROM LOAI_TAI_LIEU WHERE ten = '${req.body.ten}'`, function(e, r){
            if (e) rj(e);
            else rs(r);
        });
        })
        if (result.length!=0 && req.body.id != result[0].id){
            return res.send(false);
        }
        else{
            db.query(`UPDATE LOAI_TAI_LIEU SET ten = '${req.body.ten}', giaiDoan = '${req.body.giaiDoan}' WHERE id = '${req.body.id}'`)
            return res.send(true);
        }
    }
    catch(e){
        return next(new ApiError(500, `Error updating doctype`));
    }
}

exports.delete = async (req, res, next) => {
    try{
        db.query(`DELETE FROM LOAI_TAI_LIEU WHERE id = '${req.params.id}'`, function(e, r){
            if (e) return next(new ApiError(500, `Error deleting doctype with id = ${req.params.id}`));
            else return res.send(true);
        });
        
    }
    catch(e){
        return next(new ApiError(500, `Error deleting doctype with id = ${req.params.id}`));
    }
}

exports.deleteAll = async (req, res, next) => {
    try{
        db.query(`DELETE FROM LOAI_TAI_LIEU`, function(e, r){
            if (e) return next(new ApiError(500, `Error deleting doctype with id = ${req.params.id}`));
            else return res.send(true);
        });
        
    }
    catch(e){
        return next(new ApiError(500, `Error deleting doctype with id = ${req.params.id}`));
    }
}


