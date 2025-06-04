const express = require('express');
const router = express.Router();
const ThucPham = require('../models/thucpham');
const Loai = require('../models/loaimodel');

const { yeuCauDangNhap } = require('../middlewares/auth');

// Trang danh sách tất cả thực phẩm
router.get('/', yeuCauDangNhap, async (req, res) => {
  try {
    const thucpham = await ThucPham.find().populate('Loai').exec();
    const loai = await Loai.find();
    res.render('thucpham', {
      title: 'Danh sách thực phẩm',
      thucpham,
      loai,
      firstImage: req.app.locals.firstImage
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Lỗi khi lấy danh sách thực phẩm');
  }
});

// Trang danh sách thực phẩm theo loại
router.get('/loai/:idLoai', yeuCauDangNhap, async (req, res) => {
  try {
    const idLoai = req.params.idLoai;
    const loai = await Loai.find();
    const thucpham = await ThucPham.find({ Loai: idLoai }).populate('Loai').exec();

    res.render('thucpham', {
      title: `Thực phẩm loại ${idLoai}`,
      loai,
      thucpham,
      idLoai
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Lỗi server khi lấy danh sách theo loại');
  }
});

// Trang thêm thực phẩm (GET) - yêu cầu đăng nhập
router.get('/them', yeuCauDangNhap, async (req, res) => {
  try {
    const loai = await Loai.find();
    res.render('thucpham_them', {
      title: 'Thêm thực phẩm',
      loai
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Lỗi khi lấy danh sách loại');
  }
});

// Thêm thực phẩm (POST) - yêu cầu đăng nhập
router.post('/them', yeuCauDangNhap, async (req, res) => {
  try {
    await ThucPham.create({
      TenMon: req.body.TenMon,
      MoTa: req.body.MoTa,
      Gia: Number(req.body.Gia) || 0,
      Loai: req.body.MaLoai
    });
    res.redirect('/thucpham');
  } catch (err) {
    console.error(err);
    res.status(500).send('Lỗi khi thêm thực phẩm');
  }
});

// Trang sửa thực phẩm (GET) - yêu cầu đăng nhập
router.get('/sua/:id', yeuCauDangNhap, async (req, res) => {
  try {
    const thucpham = await ThucPham.findById(req.params.id);
    if (!thucpham) return res.redirect('/thucpham');

    const loai = await Loai.find();
    res.render('thucpham_sua', {
      title: 'Sửa thực phẩm',
      thucpham,
      loai
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Lỗi khi lấy dữ liệu thực phẩm');
  }
});

// Sửa thực phẩm (POST) - yêu cầu đăng nhập
router.post('/sua/:id', yeuCauDangNhap, async (req, res) => {
  try {
    await ThucPham.findByIdAndUpdate(req.params.id, {
      TenMon: req.body.TenMon,
      MoTa: req.body.MoTa,
      Gia: Number(req.body.Gia) || 0,
      Loai: req.body.MaLoai
    });
    res.redirect('/thucpham');
  } catch (err) {
    console.error(err);
    res.status(500).send('Lỗi khi cập nhật thực phẩm');
  }
});

// Xóa thực phẩm - yêu cầu đăng nhập
router.get('/xoa/:id', yeuCauDangNhap, async (req, res) => {
  try {
    await ThucPham.findByIdAndDelete(req.params.id);
    res.redirect('/thucpham');
  } catch (err) {
    console.error(err);
    res.status(500).send('Lỗi khi xóa thực phẩm');
  }
});

// Trang chi tiết thực phẩm (không bắt buộc đăng nhập, tùy bạn muốn)
router.get('/chitiet/:id', async (req, res) => {
  try {
    const tp = await ThucPham.findById(req.params.id)
      .populate('Loai')
      .populate('TaiKhoan'); // nếu có trường TaiKhoan, nếu không thì bỏ

    if (!tp) return res.redirect('/thucpham');

    const loai = await Loai.find();

    res.render('thucpham_chitiet', {
      title: tp.TenMon,
      thucpham: tp,
      loai,
      firstImage: req.app.locals.firstImage
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Lỗi server khi lấy chi tiết thực phẩm');
  }
});

module.exports = router;
