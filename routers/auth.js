var express = require('express');
var router = express.Router();
var bcrypt = require('bcryptjs');
var TaiKhoan = require('../models/taikhoan');

// Middleware kiểm tra đăng nhập
function yeuCauDangNhap(req, res, next) {
	if (!req.session.MaNguoiDung) {
		req.session.error = 'Bạn cần đăng nhập để truy cập trang này.';
		return res.redirect('/view/dangnhap'); // hoặc đường dẫn đăng nhập của bạn
	}
	next();
}

// GET: Đăng ký
router.get('/dangky', async (req, res) => {
	res.render('dangky', {
		title: 'Đăng ký tài khoản'
	});
});

// POST: Đăng ký
router.post('/dangky', async (req, res) => {
	var salt = bcrypt.genSaltSync(10);
	var data = {
		HoVaTen: req.body.HoVaTen,
		Email: req.body.Email,
		HinhAnh: req.body.HinhAnh,
		TenDangNhap: req.body.TenDangNhap,
		MatKhau: bcrypt.hashSync(req.body.MatKhau, salt)
	};
	await TaiKhoan.create(data);
	req.session.success = 'Đã đăng ký tài khoản thành công.';
	res.redirect('/success');
});

// GET: Đăng nhập
router.get('/dangnhap', async (req, res) => {
	res.render('dangnhap', {
		title: 'Đăng nhập'
	});
});

// POST: Đăng nhập
router.post('/dangnhap', async (req, res) => {
	if (req.session.MaNguoiDung) {
		req.session.error = 'Người dùng đã đăng nhập rồi.';
		return res.redirect('/error');
	} 
	var taikhoan = await TaiKhoan.findOne({ TenDangNhap: req.body.TenDangNhap }).exec();
	if (taikhoan) {
		if (bcrypt.compareSync(req.body.MatKhau, taikhoan.MatKhau)) {
			if (taikhoan.KichHoat == 0) {
				req.session.error = 'Người dùng đã bị khóa tài khoản.';
				return res.redirect('/error');
			} else {
				// Đăng ký session
				req.session.MaNguoiDung = taikhoan._id;
				req.session.HoVaTen = taikhoan.HoVaTen;
				req.session.QuyenHan = taikhoan.QuyenHan;
				
				return res.redirect('/');
			}
		} else {
			req.session.error = 'Mật khẩu không đúng.';
			return res.redirect('/error');
		}
	} else {
		req.session.error = 'Tên đăng nhập không tồn tại.';
		return res.redirect('/error');
	}
});

// GET: Đăng xuất
router.get('/dangxuat', async (req, res) => {
	if (req.session.MaNguoiDung) {
		// Xóa session
		delete req.session.MaNguoiDung;
		delete req.session.HoVaTen;
		delete req.session.QuyenHan;
		
		return res.redirect('/');
	} else {
		req.session.error = 'Người dùng chưa đăng nhập.';
		return res.redirect('/error');
	}
});

// GET: Trang admin - chỉ cho phép người đăng nhập
router.get('/admin', yeuCauDangNhap, async (req, res) => {
	res.render('admin', {
		title: 'Trang quản trị'
	});
});

module.exports = router;
