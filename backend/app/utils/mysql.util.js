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

db_con.connect((error) => {
  if (error) {
    db_con.end();
    db_con = mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      port: process.env.DB_PORT,
    });
    db_con.query(`CREATE DATABASE ${database}`, async function (e, r) {
      if (e) throw e;
      else {
        console.log("Database created");
        console.log("Connecting...");
        db_con = mysql.createConnection({
          host: process.env.DB_HOST,
          user: process.env.DB_USER,
          password: process.env.DB_PASSWORD,
          port: process.env.DB_PORT,
          database: database,
        });
        addTable();
        console.log("Database connected");
      }
    });
  } else {
    console.log("Database connected");
    addTable();
  }
});

async function addTable() {
  //du_an
  db_con.query(
    `SHOW TABLES FROM ${database} LIKE 'DU_AN'`,
    function (e, result) {
      if (e) throw e;
      else {
        if (result.length == 0) {
          db_con.query(
            `CREATE TABLE du_an (   GhiChu longtext, Ma varchar(50) NOT NULL,   Ten varchar(100) DEFAULT NULL,   MoTa longtext,   TrangThai varchar(45) DEFAULT NULL,   ThoiGianBatDauDuAn date DEFAULT NULL,   ThoiGianKetThucDuAn date DEFAULT NULL,   ThoiGianBatDauDauThau date DEFAULT NULL,   ThoiGianKetThucDauThau date DEFAULT NULL,   ThoiGianNghiemThu date DEFAULT NULL,   ThoiGianBaoHanh date DEFAULT NULL,   id bigint NOT NULL AUTO_INCREMENT,   ThoiGianChinhSuaLanCuoi datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,   id_NguoiTao bigint DEFAULT NULL,   id_NguoiChinhSuaLanCuoi bigint DEFAULT NULL,   loai varchar(45) DEFAULT NULL,   KhachHang varchar(100) DEFAULT NULL,   id_GiaHan bigint DEFAULT NULL,   TB tinyint DEFAULT 1,   ThoiHan int DEFAULT NULL,   LoaiThoiHan varchar(45) DEFAULT NULL,   PRIMARY KEY (id),   UNIQUE KEY id_UNIQUE (id) ) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci

`,
            function (e, result) {
              if (e) console.log(e);
              else console.log("created");
            }
          );
        }
      }
    }
  );
  //lich_su
  db_con.query(
    `SHOW TABLES FROM ${database} LIKE 'LICH_SU'`,
    function (e, result) {
      if (e) throw e;
      else {
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
 ) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci

`,
            function (e, result) {
              if (e) console.log(e);
              else console.log("created");
            }
          );
        }
      }
    }
  );
  //loai_tai_lieu
  db_con.query(
    `SHOW TABLES FROM ${database} LIKE 'LOAI_TAI_LIEU'`,
    function (e, result) {
      if (e) throw e;
      else {
        if (result.length == 0) {
          db_con.query(
            `CREATE TABLE loai_tai_lieu (
   id bigint NOT NULL AUTO_INCREMENT,
   ten varchar(45) DEFAULT NULL,
   giaiDoan varchar(45) DEFAULT NULL,
   PRIMARY KEY (id)
 ) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
`,
            function (e, result) {
              if (e) console.log(e);
              else {
                db_con.query(
                  `INSERT INTO LOAI_TAI_LIEU (ten, giaiDoan) VALUES ('Biên bản yêu cầu','truocdauthau')`
                );
                db_con.query(
                  `INSERT INTO LOAI_TAI_LIEU (ten, giaiDoan) VALUES ('Báo cáo nghiên cứu khả thi','truocdauthau')`
                );
                db_con.query(
                  `INSERT INTO LOAI_TAI_LIEU (ten, giaiDoan) VALUES ('Chủ trương đầu tư','truocdauthau')`
                );
                db_con.query(
                  `INSERT INTO LOAI_TAI_LIEU (ten, giaiDoan) VALUES ('Hồ sơ thầu','truocdauthau')`
                );
                db_con.query(
                  `INSERT INTO LOAI_TAI_LIEU (ten, giaiDoan) VALUES ('Thiết kế chi tiết','saudauthau')`
                );
                db_con.query(
                  `INSERT INTO LOAI_TAI_LIEU (ten, giaiDoan) VALUES ('Nhật kí thi công','saudauthau')`
                );
                db_con.query(
                  `INSERT INTO LOAI_TAI_LIEU (ten, giaiDoan) VALUES ('Biên bản giấy tờ khác','baohanh')`
                );
                db_con.query(
                  `INSERT INTO LOAI_TAI_LIEU (ten, giaiDoan) VALUES ('Loại tài liệu khác','khac')`
                );
              }
            }
          );
        }
      }
    }
  );
  //nhan_vien
  db_con.query(
    `SHOW TABLES FROM ${database} LIKE 'NHAN_VIEN'`,
    function (e, result) {
      if (e) throw e;
      else {
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
 ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
`,
            function (e, result) {
              if (e) console.log(e);
              else {
                db_con.query(
                  `INSERT INTO NHAN_VIEN (username, matkhau, sodienthoai, chucvu, hoten, gioitinh, anhdaidien) VALUES ('admin', '$2b$10$YdUNhRez8vkwZJ6ozGHDoeUQk1hnW091mC8P6i8njU4X9mRj.SjL6', '0123456789', 'admin', 'admin', 'nam', 'user-img.jpg')`
                );
              }
            }
          );
        }
      }
    }
  );
  //nhat_ky
  db_con.query(
    `SHOW TABLES FROM ${database} LIKE 'NHAT_KY'`,
    function (e, result) {
      if (e) throw e;
      else {
        if (result.length == 0) {
          db_con.query(
            `CREATE TABLE nhat_ky (
   id bigint NOT NULL AUTO_INCREMENT,
   loai varchar(45) DEFAULT NULL,
   ten longtext,
   khacphuc longtext,
   ghichu longtext,
   ngay_loi datetime,
   ngaytao datetime DEFAULT CURRENT_TIMESTAMP,
   ngaycapnhat datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
   id_HT bigint DEFAULT NULL,
   id_nguoitao bigint DEFAULT NULL,
   id_nguoicapnhat bigint DEFAULT NULL,
   capnhat longtext,
   PRIMARY KEY (id)
 ) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
`,
            function (e, result) {
              if (e) console.log(e);
              else console.log("created");
            }
          );
        }
      }
    }
  );
  //quyen_duan
  db_con.query(
    `SHOW TABLES FROM ${database} LIKE 'quyen_duan'`,
    function (e, result) {
      if (e) throw e;
      else {
        if (result.length == 0) {
          db_con.query(
            `CREATE TABLE quyen_duan (
   quyen varchar(45) NOT NULL,
   id_duan bigint DEFAULT NULL,
   id_nguoichinhsua bigint DEFAULT NULL,
   loaiQuyen varchar(45) DEFAULT NULL
 ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
`,
            function (e, result) {
              if (e) console.log(e);
              else console.log("created");
            }
          );
        }
      }
    }
  );
  //quyen_tailieu
  db_con.query(
    `SHOW TABLES FROM ${database} LIKE 'quyen_tailieu'`,
    function (e, result) {
      if (e) throw e;
      else {
        if (result.length == 0) {
          db_con.query(
            `CREATE TABLE quyen_tailieu (
   id_tailieu bigint NOT NULL,
   id_nguoichinhsua bigint DEFAULT NULL,
   quyen varchar(45) DEFAULT NULL,
   loaiQuyen varchar(45) DEFAULT NULL
 ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
`,
            function (e, result) {
              if (e) console.log(e);
              else console.log("created");
            }
          );
        }
      }
    }
  );
  //server
  db_con.query(
    `SHOW TABLES FROM ${database} LIKE 'SERVER'`,
    function (e, result) {
      if (e) throw e;
      else {
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
 ) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
`,
            function (e, result) {
              if (e) console.log(e);
              else console.log("created");
            }
          );
        }
      }
    }
  );
  //su_kien
  db_con.query(
    `SHOW TABLES FROM ${database} LIKE 'su_kien'`,
    function (e, result) {
      if (e) throw e;
      else {
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
 ) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
`,
            function (e, result) {
              if (e) console.log(e);
              else console.log("created");
            }
          );
        }
      }
    }
  );
  //tai_lieu
  db_con.query(
    `SHOW TABLES FROM ${database} LIKE 'tai_lieu'`,
    function (e, result) {
      if (e) throw e;
      else {
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
 ) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
`,
            function (e, result) {
              if (e) console.log(e);
              else console.log("created");
            }
          );
        }
      }
    }
  );

  //tham_gia
  db_con.query(
    `SHOW TABLES FROM ${database} LIKE 'tham_gia'`,
    function (e, result) {
      if (e) throw e;
      else {
        if (result.length == 0) {
          db_con.query(
            `CREATE TABLE tham_gia (
            loai varchar(10) NOT NULL,
   id_NhanVien bigint NOT NULL,
   id_DuAn bigint NOT NULL,
   PRIMARY KEY (id_NhanVien,id_DuAn)
 ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
`,
            function (e, result) {
              if (e) console.log(e);
              else console.log("created");
            }
          );
        }
      }
    }
  );
  //tham_gia_sk
  db_con.query(
    `SHOW TABLES FROM ${database} LIKE 'tham_gia_sk'`,
    function (e, result) {
      if (e) throw e;
      else {
        if (result.length == 0) {
          db_con.query(
            `CREATE TABLE tham_gia_sk (
   id_NhanVien bigint NOT NULL,
   id_SuKien bigint DEFAULT NULL
 ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
`,
            function (e, result) {
              if (e) console.log(e);
              else console.log("created");
            }
          );
        }
      }
    }
  );
  //thong_tin_cai_dat_he_thong
  db_con.query(
    `SHOW TABLES FROM ${database} LIKE 'THONG_TIN_CAI_DAT_HE_THONG'`,
    function (e, result) {
      if (e) throw e;
      else {
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
 ) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
`,
            function (e, result) {
              if (e) console.log(e);
              else console.log("created");
            }
          );
        }
      }
    }
  );
}

module.exports = db_con;
