const express = require('express');
const router = express.Router();
const Loai = require('../models/loaimodel');
const ThucPham = require('../models/thucpham');

const { yeuCauDangNhap } = require('../middlewares/auth'); // Middleware kiểm tra đăng nhập

// GET: Trang thêm loại (bảo vệ bằng đăng nhập)
router.get('/them', yeuCauDangNhap, (req, res) => {
  res.render('loai_them', {
    title: 'Thêm loại thực phẩm'
  });
});

// POST: Thêm loại (bảo vệ bằng đăng nhập)
router.post('/them', yeuCauDangNhap, async (req, res) => {
  try {
    await Loai.create({ TenLoai: req.body.TenLoai });
    res.redirect('/loai');
  } catch (err) {
    console.error(err);
    res.status(500).send('Lỗi khi thêm loại');
  }
});

// GET: Trang sửa loại (bảo vệ bằng đăng nhập)
router.get('/sua/:id', yeuCauDangNhap, async (req, res) => {
  try {
    const loai = await Loai.findById(req.params.id);
    if (!loai) return res.redirect('/loai');
    res.render('loai_sua', {
      title: 'Sửa loại thực phẩm',
      loai
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Lỗi khi lấy dữ liệu loại');
  }
});

// POST: Sửa loại (bảo vệ bằng đăng nhập)
router.post('/sua/:id', yeuCauDangNhap, async (req, res) => {
  try {
    const result = await Loai.findByIdAndUpdate(req.params.id, {
      TenLoai: req.body.TenLoai
    });
    res.redirect('/loai');
  } catch (err) {
    console.error(err);
    res.status(500).send('Lỗi khi cập nhật loại');
  }
});

// GET: Xóa loại (bảo vệ bằng đăng nhập)
router.get('/xoa/:id', yeuCauDangNhap, async (req, res) => {
  try {
    await Loai.findByIdAndDelete(req.params.id);
    res.redirect('/loai');
  } catch (err) {
    console.error(err);
    res.status(500).send('Lỗi khi xóa loại');
  }
});

// GET: Danh sách loại và thực phẩm theo loại (hoặc tất cả nếu không có id)
router.get('/:id?', yeuCauDangNhap, async (req, res) => {
  try {
    const loaiId = req.params.id || null;

    // Lấy danh sách tất cả loại
    const loai = await Loai.find();

    // Lấy thực phẩm theo loại hoặc tất cả
    let thucpham;
    if (loaiId) {
      thucpham = await ThucPham.find({ Loai: loaiId }).populate('Loai').exec();
    } else {
      thucpham = await ThucPham.find().populate('Loai').exec();
    }

    // Tìm tên loại để hiển thị title, nếu không tìm thấy thì dùng mặc định
    let tenLoaiHienThi = 'Tất cả thực phẩm';
    if (loaiId) {
      const loaiHienThi = loai.find(l => l._id.toString() === loaiId);
      if (loaiHienThi) tenLoaiHienThi = `Thực phẩm loại: ${loaiHienThi.TenLoai}`;
      else tenLoaiHienThi = 'Loại không tồn tại';
    }

    res.render('loai', {
      title: tenLoaiHienThi,
      loai,
      thucpham,
      loaiId
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Lỗi server');
  }
});

module.exports = router;
