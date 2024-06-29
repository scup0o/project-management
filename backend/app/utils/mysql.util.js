const mysql = require("mysql");
require("dotenv").config();
const database = process.env.DB_DATABASE;

let db_con = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  database: database,
});

db_con.connect(async (error) => {
  try {
    if (error) {
      db_con.end();
      db_con = mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        port: process.env.DB_PORT,
      });
      db_con.query(`CREATE DATABASE ${database}`, async function (e, r) {
        if (e) {
          console.trace("fatal error: " + e.message);
        } else {
          console.log("Database created");
          var fs = require("fs");
          fs.utimesSync( __filename, new Date(), new Date());
          /*const wait = async (ms) => {
              return new Promise((resolve) => setTimeout(resolve, ms));
            };
            const { spawn } = require("child_process");

            const bat = spawn("restart_script.bat", ['restart_script.bat'], {
              shell: true,
              stdio: "inherit",
            });
            
        const { exec } = require("child_process");
        exec("rs", (err, stdout, stderr) => {
          if (err) {
            console.log(err);
            return;
          }

          // the *entire* stdout and stderr (buffered)
          console.log(`stdout: ${stdout}`);
          console.log(`stderr: ${stderr}`);
        });*/
        }
      });
    } else {
      console.log("Database connected");
      addTable();
    }
  } catch (e) {
    console.log(e);
  }
});

async function addTable() {
  //du_an
  let du_an = await new Promise((rs, rj) => {
    db_con.query(
      `SHOW TABLES FROM ${database} LIKE 'DU_AN'`,
      function (e, result) {
        if (e) {
          console.trace("fatal error: " + e.message);
        } else {
          if (result.length == 0) {
            db_con.query(
              `CREATE TABLE du_an (   GhiChu longtext, Ma varchar(50) NOT NULL,   Ten varchar(100) DEFAULT NULL,   MoTa longtext,   TrangThai varchar(45) DEFAULT NULL,   ThoiGianBatDauDuAn date DEFAULT NULL,   ThoiGianKetThucDuAn date DEFAULT NULL,   ThoiGianBatDauDauThau date DEFAULT NULL,   ThoiGianKetThucDauThau date DEFAULT NULL,   ThoiGianNghiemThu date DEFAULT NULL,   ThoiGianBaoHanh date DEFAULT NULL,   id bigint NOT NULL AUTO_INCREMENT,   ThoiGianChinhSuaLanCuoi datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,   id_NguoiTao bigint DEFAULT NULL,   id_NguoiChinhSuaLanCuoi bigint DEFAULT NULL,   loai varchar(45) DEFAULT NULL,   KhachHang varchar(100) DEFAULT NULL,   id_GiaHan bigint DEFAULT NULL,   TB tinyint DEFAULT 1,   ThoiHan int DEFAULT NULL,   LoaiThoiHan varchar(45) DEFAULT NULL,   PRIMARY KEY (id),   UNIQUE KEY id_UNIQUE (id) ) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci

`,
              function (e, result) {
                if (e) {
                  console.trace("fatal error: " + e.message);
                } else {
                  console.log("created");
                  rs(result);
                }
              }
            );
          }
        }
      }
    );
  });
  //id_quenmatkhau
  let id_quenmatkhau = await new Promise((rs, rj) => {
    db_con.query(
      `SHOW TABLES FROM ${database} LIKE 'id_quenmatkhau'`,
      function (e, result) {
        if (e) {
          console.trace("fatal error: " + e.message);
        } else {
          if (result.length == 0) {
            db_con.query(
              `CREATE TABLE id_quenmatkhau (
id varchar(100) NOT NULL,
thoigiantao datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
id_nhanvien bigint DEFAULT NULL,
PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci

`,
              function (e, result) {
                if (e) {
                  console.trace("fatal error: " + e.message);
                } else {
                  console.log("created");
                  rs(result);
                }
              }
            );
          }
        }
      }
    );
  });
  let lich_su = await new Promise((rs, rj) => {
    //lich_su
    db_con.query(
      `SHOW TABLES FROM ${database} LIKE 'LICH_SU'`,
      function (e, result) {
        if (e) {
          console.trace("fatal error: " + e.message);
        } else {
          if (result.length == 0) {
            db_con.query(
              `CREATE TABLE lich_su (
   id_DuAn bigint NOT NULL,
   id_NguoiChinhSua bigint DEFAULT NULL,
   ThoiGianChinhSua datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
   id_TaiLieu bigint DEFAULT NULL,
   TenFile longtext,
   stt bigint NOT NULL AUTO_INCREMENT,
   PRIMARY KEY (stt)
 ) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci

`,
              function (e, result) {
                if (e) {
                  console.trace("fatal error: " + e.message);
                } else {
                  console.log("created");
                  rs(result);
                }
              }
            );
          }
        }
      }
    );
  });
  //DANH_MUC
  let danh_muc = await new Promise((rs, rj) => {
    db_con.query(
      `SHOW TABLES FROM ${database} LIKE 'DANH_MUC'`,
      function (e, result) {
        if (e) {
          console.trace("fatal error: " + e.message);
        } else {
          if (result.length == 0) {
            db_con.query(
              `CREATE TABLE DANH_MUC (
   id bigint NOT NULL AUTO_INCREMENT,
   ten varchar(45) DEFAULT NULL,
   giaiDoan varchar(45) DEFAULT NULL,
   loai varchar(45) DEFAULT NULL,
   PRIMARY KEY (id)
 ) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci
`,
              function (e, result) {
                if (e) {
                  console.trace("fatal error: " + e.message);
                } else {
                  db_con.query(
                    `INSERT INTO DANH_MUC (ten, giaiDoan, loai) VALUES ('Biên bản yêu cầu','truocdauthau','loaitailieu')`
                  );
                  db_con.query(
                    `INSERT INTO DANH_MUC (ten, giaiDoan, loai) VALUES ('Báo cáo nghiên cứu khả thi','truocdauthau','loaitailieu')`
                  );
                  db_con.query(
                    `INSERT INTO DANH_MUC (ten, giaiDoan, loai) VALUES ('Chủ trương đầu tư','truocdauthau','loaitailieu')`
                  );
                  db_con.query(
                    `INSERT INTO DANH_MUC (ten, giaiDoan, loai) VALUES ('Hồ sơ thầu','truocdauthau','loaitailieu')`
                  );
                  db_con.query(
                    `INSERT INTO DANH_MUC (ten, giaiDoan, loai) VALUES ('Thiết kế chi tiết','saudauthau','loaitailieu')`
                  );
                  db_con.query(
                    `INSERT INTO DANH_MUC (ten, giaiDoan, loai) VALUES ('Nhật kí thi công','saudauthau','loaitailieu')`
                  );
                  db_con.query(
                    `INSERT INTO DANH_MUC (ten, giaiDoan, loai) VALUES ('Biên bản giấy tờ khác','baohanh','loaitailieu')`
                  );
                  db_con.query(
                    `INSERT INTO DANH_MUC (ten, giaiDoan, loai) VALUES ('Loại tài liệu khác','khac','loaitailieu')`
                  );
                  rs(result);
                }
              }
            );
          }
        }
      }
    );
  });
  //nhan_vien
  let nhan_vien = await new Promise((rs, rj) => {
    db_con.query(
      `SHOW TABLES FROM ${database} LIKE 'NHAN_VIEN'`,
      function (e, result) {
        if (e) {
          console.trace("fatal error: " + e.message);
        } else {
          if (result.length == 0) {
            db_con.query(
              `CREATE TABLE nhan_vien (
   hoten varchar(100) DEFAULT NULL,
   username varchar(100) DEFAULT NULL,
   email varchar(100) DEFAULT NULL,
   matkhau longtext,
   chucvu varchar(45) DEFAULT NULL,
   sodienthoai varchar(20) DEFAULT NULL,
   id bigint NOT NULL AUTO_INCREMENT,
   anhdaidien longtext,
   gioitinh varchar(10) DEFAULT NULL,
   khoa tinyint DEFAULT '0',
   PRIMARY KEY (id)
 ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci
`,
              function (e, result) {
                if (e) {
                  console.trace("fatal error: " + e.message);
                } else {
                  db_con.query(
                    `INSERT INTO NHAN_VIEN (username, matkhau, sodienthoai, chucvu, hoten, gioitinh, anhdaidien) VALUES ('admin', '$2b$10$YdUNhRez8vkwZJ6ozGHDoeUQk1hnW091mC8P6i8njU4X9mRj.SjL6', '0123456789', 'admin', 'admin', 'nam', 'user-img.jpg')`
                  );
                  rs(result);
                }
              }
            );
          }
        }
      }
    );
  });
  //nhat_ky
  let nhat_ky = await new Promise((rs, rj) => {
    db_con.query(
      `SHOW TABLES FROM ${database} LIKE 'NHAT_KY'`,
      function (e, result) {
        if (e) {
          console.trace("fatal error: " + e.message);
        } else {
          if (result.length == 0) {
            db_con.query(
              `CREATE TABLE nhat_ky (
   id bigint NOT NULL AUTO_INCREMENT,
   loai varchar(45) DEFAULT NULL,
   ten longtext,
   khacphuc longtext,
   ghichu longtext,
   ngayghinhan datetime DEFAULT NULL,
   ngaytao datetime DEFAULT CURRENT_TIMESTAMP,
   ngaycapnhat datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
   id_HT bigint DEFAULT NULL,
   id_nguoitao bigint DEFAULT NULL,
   id_nguoicapnhat bigint DEFAULT NULL,
   capnhat longtext,
   PRIMARY KEY (id)
 ) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci
`,
              function (e, result) {
                if (e) {
                  console.trace("fatal error: " + e.message);
                } else {
                  console.log("created");
                  rs(result);
                }
              }
            );
          }
        }
      }
    );
  });
  //quyen_duan
  let quyen_duan = await new Promise((rs, rj) => {
    db_con.query(
      `SHOW TABLES FROM ${database} LIKE 'quyen_duan'`,
      function (e, result) {
        if (e) {
          console.trace("fatal error: " + e.message);
        } else {
          if (result.length == 0) {
            db_con.query(
              `CREATE TABLE quyen_duan (
   quyen varchar(45) NOT NULL,
   id_duan bigint DEFAULT NULL,
   id_nguoichinhsua bigint DEFAULT NULL,
   loaiQuyen varchar(45) DEFAULT NULL
 ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci
`,
              function (e, result) {
                if (e) {
                  console.trace("fatal error: " + e.message);
                } else {
                  console.log("created");
                  rs(result);
                }
              }
            );
          }
        }
      }
    );
  });
  //quyen_tailieu
  let quyen_tailieu = await new Promise((rs, rj) => {
    db_con.query(
      `SHOW TABLES FROM ${database} LIKE 'quyen_tailieu'`,
      function (e, result) {
        if (e) {
          console.trace("fatal error: " + e.message);
        } else {
          if (result.length == 0) {
            db_con.query(
              `CREATE TABLE quyen_tailieu (
   id_tailieu bigint NOT NULL,
   id_nguoichinhsua bigint DEFAULT NULL,
   quyen varchar(45) DEFAULT NULL,
   loaiQuyen varchar(45) DEFAULT NULL
 ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci
`,
              function (e, result) {
                if (e) {
                  console.trace("fatal error: " + e.message);
                } else {
                  console.log("created");
                  rs(result);
                }
              }
            );
          }
        }
      }
    );
  });
  //server
  let server = await new Promise((rs, rj) => {
    db_con.query(
      `SHOW TABLES FROM ${database} LIKE 'SERVER'`,
      function (e, result) {
        if (e) {
          console.trace("fatal error: " + e.message);
        } else {
          if (result.length == 0) {
            db_con.query(
              `CREATE TABLE server (
   id bigint NOT NULL AUTO_INCREMENT,
   IP varchar(100) DEFAULT NULL,
   loai varchar(45) DEFAULT NULL,
   ten varchar(45) DEFAULT NULL,
   hdh varchar(45) DEFAULT NULL,
   csdl varchar(100) DEFAULT NULL,
   ngonngu varchar(45) DEFAULT NULL,
   ghichu longtext,
   ocung mediumtext,
   ram varchar(50) DEFAULT NULL,
   cardmanhinh varchar(100) DEFAULT NULL,
   id_HT bigint DEFAULT NULL,
   pmkhac longtext,
   moitruong varchar(100) DEFAULT NULL,
   PRIMARY KEY (id)
 ) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci
`,
              function (e, result) {
                if (e) {
                  console.trace("fatal error: " + e.message);
                } else {
                  console.log("created");
                  rs(result);
                }
              }
            );
          }
        }
      }
    );
  });
  //su_kien
  let sk = await new Promise((rs, rj) => {
    db_con.query(
      `SHOW TABLES FROM ${database} LIKE 'su_kien'`,
      function (e, result) {
        if (e) {
          console.trace("fatal error: " + e.message);
        } else {
          if (result.length == 0) {
            db_con.query(
              `CREATE TABLE su_kien (
   id bigint NOT NULL AUTO_INCREMENT,
   TenSuKien varchar(100) DEFAULT NULL,
   DiaDiemDienRaSuKien longtext,
   NgayKetThucSuKien date DEFAULT NULL,
   NgayDienRaSuKien date DEFAULT NULL,
   id_NguoiTao bigint DEFAULT NULL,
   MoTaSuKien longtext,
   id_DuAn bigint DEFAULT NULL,
   PRIMARY KEY (id)
 ) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci
`,
              function (e, result) {
                if (e) {
                  console.trace("fatal error: " + e.message);
                } else {
                  console.log("created");
                  rs(result);
                }
              }
            );
          }
        }
      }
    );
  });
  //tai_lieu
  let tl = await new Promise((rs, rj) => {
    db_con.query(
      `SHOW TABLES FROM ${database} LIKE 'tai_lieu'`,
      function (e, result) {
        if (e) {
          console.trace("fatal error: " + e.message);
        } else {
          if (result.length == 0) {
            db_con.query(
              `CREATE TABLE tai_lieu (
   LoaiTaiLieu varchar(100) NOT NULL,
   TenTaiLieu varchar(100) DEFAULT NULL,
   GiaiDoan varchar(100) DEFAULT NULL,
   id_DuAn bigint DEFAULT NULL,
   id_NguoiTao bigint DEFAULT NULL,
   id bigint unsigned NOT NULL AUTO_INCREMENT,
   LoaiFile varchar(45) DEFAULT NULL,
   PRIMARY KEY (id)
 ) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci
`,
              function (e, result) {
                if (e) {
                  console.trace("fatal error: " + e.message);
                } else {
                  console.log("created");
                  rs(result);
                }
              }
            );
          }
        }
      }
    );
  });

  //tham_gia
  let tg = await new Promise((rs, rj) => {
    db_con.query(
      `SHOW TABLES FROM ${database} LIKE 'tham_gia'`,
      function (e, result) {
        if (e) {
          console.trace("fatal error: " + e.message);
        } else {
          if (result.length == 0) {
            db_con.query(
              `CREATE TABLE tham_gia (
            loai varchar(10) NOT NULL,
   id_NhanVien bigint NOT NULL,
   id_DuAn bigint NOT NULL,
   PRIMARY KEY (id_NhanVien,id_DuAn)
 ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci
`,
              function (e, result) {
                if (e) {
                  console.trace("fatal error: " + e.message);
                } else {
                  console.log("created");
                  rs(result);
                }
              }
            );
          }
        }
      }
    );
  });
  //tham_gia_sk
  let tgsk = await new Promise((rs, rj) => {
    db_con.query(
      `SHOW TABLES FROM ${database} LIKE 'tham_gia_sk'`,
      function (e, result) {
        if (e) {
          console.trace("fatal error: " + e.message);
        } else {
          if (result.length == 0) {
            db_con.query(
              `CREATE TABLE tham_gia_sk (
   id_NhanVien bigint NOT NULL,
   id_SuKien bigint DEFAULT NULL
 ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci
`,
              function (e, result) {
                if (e) {
                  console.trace("fatal error: " + e.message);
                } else {
                  console.log("created");
                  rs(result);
                }
              }
            );
          }
        }
      }
    );
  });
  //thong_tin_cai_dat_he_thong
  let tt = await new Promise((rs, rj) => {
    db_con.query(
      `SHOW TABLES FROM ${database} LIKE 'THONG_TIN_CAI_DAT_HE_THONG'`,
      function (e, result) {
        if (e) {
          console.trace("fatal error: " + e.message);
        } else {
          if (result.length == 0) {
            db_con.query(
              `CREATE TABLE thong_tin_cai_dat_he_thong (
   HienTrangHeThong longtext NOT NULL,
   GhiChu longtext,
   id_DuAn bigint NOT NULL,
   PhanMemNgoai longtext,
   id bigint NOT NULL AUTO_INCREMENT,
   id_NguoiTao bigint DEFAULT NULL,
   ThoiGianCapNhat datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
   DonViSuDung varchar(100) DEFAULT NULL,
   NoiCaiDatSourceCode varchar(100) DEFAULT NULL,
   id_NguoiCapNhat bigint DEFAULT NULL,
   PRIMARY KEY (id)
 ) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci
`,
              function (e, result) {
                if (e) {
                  console.trace("fatal error: " + e.message);
                } else {
                  console.log("created");
                  rs(result);
                }
              }
            );
          }
        }
      }
    );
  });
}

module.exports = db_con;
