// middlewares/auth.js

module.exports = {
	yeuCauDangNhap: (req, res, next) => {
		if (!req.session.MaNguoiDung) {
			req.session.error = 'Bạn cần đăng nhập để tiếp tục.';
			return res.redirect('/dangnhap');
		}
		next(); // Cho phép tiếp tục nếu đã đăng nhập
	}
};
