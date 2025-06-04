const express = require('express');
const router = express.Router();
const firstImage = require('../modules/firstimage');
const Loai = require('../models/loaimodel');
const ThucPham = require('../models/thucpham');


// GET: Trang chủ
router.get('/', async (req, res) => {
	const loai = await Loai.find();
	const thucpham = await ThucPham.find()
		.sort({ NgayTao: -1 })
		.populate('Loai')
		.populate('TaiKhoan')
		.limit(12);
	const noibat = await ThucPham.find()
		.sort({ LuotXem: -1 })
		.limit(3)
		.populate('Loai')
		.populate('TaiKhoan');

	res.render('index', {
		title: 'Trang chủ',
		loai,
		thucpham,
		noibat,
		firstImage
	});
});

// GET: Danh sách thực phẩm theo loại
router.get('/thucpham/loai/:id', async (req, res) => {
	const id = req.params.id;
	const loaiItem = await Loai.findById(id);
	const thucpham = await ThucPham.find({ Loai: id })
		.populate('Loai')
		.populate('TaiKhoan');
	const loai = await Loai.find();

	res.render('thucpham_loai', {
		title: `Loại: ${loaiItem?.TenLoai || 'Không rõ'}`,
		thucpham,
		loai: loaiItem,  // đổi tên biến ở đây để view xài 'loai'
		loaihang: loai,   // nếu bạn vẫn dùng dropdown
		firstImage
	});

});

// GET: Chi tiết thực phẩm
router.get('/thucpham/chitiet/:id', async (req, res) => {
	const id = req.params.id;

	const tp = await ThucPham.findByIdAndUpdate(id, { $inc: { LuotXem: 1 } }, { new: true })
		.populate('Loai')
		.populate('TaiKhoan');
	const loai = await Loai.find();

	if (!tp) return res.redirect('/error');	
	res.render('thucpham_chitiet', {
		title: tp.TenMon,
		thucpham: tp,
		loai,
		firstImage
	});
});


// POST: Tìm kiếm
router.post('/timkiem', async (req, res) => {
    const tukhoa = req.body.tukhoa;
    try {
        const ketqua = await ThucPham.find({
            TenMon: { $regex: tukhoa, $options: 'i' }
        }).populate('Loai');

        const chuyenmuc = await Loai.find(); // nếu bạn muốn hiện danh sách loại bên sidebar

        res.render('timkiem', {
            title: 'Kết quả tìm kiếm',
            tukhoa,
            thucphamtimkiem: ketqua,
            chuyenmuc,
            session: req.session
        });
    } catch (err) {
        res.status(500).send('Lỗi tìm kiếm');
    }
});

// Trang lỗi / thành công
router.get('/error', (req, res) => {
	res.render('error', { title: 'Lỗi' });
});

router.get('/success', (req, res) => {
	res.render('success', { title: 'Hoàn thành' });
});

module.exports = router;
