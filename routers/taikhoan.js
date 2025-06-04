const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const TaiKhoan = require('../models/taikhoan');

const { yeuCauDangNhap } = require('../middlewares/auth');
// Hàm mã hóa mật khẩu
function hashPassword(password) {
  const salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(password, salt);
}

// GET: Danh sách tài khoản
router.get('/', async (req, res) => {
  try {
    const taikhoan = await TaiKhoan.find();
    res.render('taikhoan', {
      title: 'Danh sách tài khoản',
      taikhoan
    });
  } catch (error) {
    console.error(error);
    res.status(500).render('error', { title: 'Lỗi' });
  }
});

// GET: Form thêm tài khoản
router.get('/them', (req, res) => {
  res.render('taikhoan_them', { title: 'Thêm tài khoản' });
});

// POST: Thêm tài khoản
router.post('/them', async (req, res) => {
  try {
    const { HoVaTen, Email, HinhAnh, TenDangNhap, MatKhau } = req.body;

    // Kiểm tra dữ liệu tối thiểu
    if (!HoVaTen || !Email || !TenDangNhap || !MatKhau) {
      return res.status(400).render('taikhoan_them', {
        title: 'Thêm tài khoản',
        error: 'Vui lòng nhập đầy đủ thông tin'
      });
    }

    const newTaiKhoan = new TaiKhoan({
      HoVaTen,
      Email,
      HinhAnh: HinhAnh || '',
      TenDangNhap,
      MatKhau: hashPassword(MatKhau),
      QuyenHan: 'user',  // Mặc định quyền user, hoặc tùy chỉnh
      KichHoat: 1
    });

    await newTaiKhoan.save();
    res.redirect('/taikhoan');
  } catch (error) {
    console.error(error);
    res.status(500).render('error', { title: 'Lỗi' });
  }
});

// GET: Form sửa tài khoản
router.get('/sua/:id', async (req, res) => {
  try {
    const taikhoan = await TaiKhoan.findById(req.params.id);
    if (!taikhoan) {
      return res.status(404).render('error', { title: 'Không tìm thấy tài khoản' });
    }
    res.render('taikhoan_sua', {
      title: 'Sửa tài khoản',
      taikhoan
    });
  } catch (error) {
    console.error(error);
    res.status(500).render('error', { title: 'Lỗi' });
  }
});

// POST: Cập nhật tài khoản
router.post('/sua/:id', async (req, res) => {
  try {
    const { HoVaTen, Email, HinhAnh, TenDangNhap, MatKhau, QuyenHan, KichHoat } = req.body;
    const dataUpdate = {
      HoVaTen,
      Email,
      HinhAnh: HinhAnh || '',
      TenDangNhap,
      QuyenHan,
      KichHoat: Number(KichHoat) || 0
    };

    if (MatKhau && MatKhau.trim() !== '') {
      dataUpdate.MatKhau = hashPassword(MatKhau);
    }

    await TaiKhoan.findByIdAndUpdate(req.params.id, dataUpdate);
    res.redirect('/taikhoan');
  } catch (error) {
    console.error(error);
    res.status(500).render('error', { title: 'Lỗi' });
  }
});

// GET: Xóa tài khoản
router.get('/xoa/:id', async (req, res) => {
  try {
    await TaiKhoan.findByIdAndDelete(req.params.id);
    res.redirect('/taikhoan');
  } catch (error) {
    console.error(error);
    res.status(500).render('error', { title: 'Lỗi' });
  }
});

// Trang Hồ sơ cá nhân - yêu cầu đăng nhập
router.get('/hoso', async (req, res) => {
  try {
    if (!req.session.MaNguoiDung) {
      return res.redirect('/dangnhap');
    }

    const taikhoan = await TaiKhoan.findById(req.session.MaNguoiDung);

    if (!taikhoan) {
      return res.status(404).render('error', { title: 'Không tìm thấy người dùng' });
    }

    res.render('taikhoan_hoso', {
      title: 'Hồ sơ cá nhân',
      taikhoan
    });
  } catch (err) {
    console.error(err);
    res.status(500).render('error', { title: 'Lỗi server khi lấy hồ sơ' });
  }
});


// Trang Món yêu thích - yêu cầu đăng nhập
router.get('/yeuthich', async (req, res) => {
  try {
    const userId = req.session.MaNguoiDung;
    const nguoiDung = await NguoiDung.findById(userId).populate({
      path: 'MonYeuThich',
      populate: { path: 'Loai' }
    }).lean();

    if (!nguoiDung) {
      return res.redirect('/dangnhap');
    }

    res.render('taikhoan_yeuthich', {
      title: 'Món yêu thích',
      monYeuThich: nguoiDung.MonYeuThich || []
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Lỗi server khi lấy món yêu thích');
  }
});

module.exports = router;
