const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  TenMon: String, // Đổi từ TenCuaHang → TenThucPham
  Gia: Number,
  TomTat: String,
  MoTa: String,
  TaiKhoan: { type: mongoose.Schema.Types.ObjectId, ref: 'TaiKhoan' },
  Loai: { type: mongoose.Schema.Types.ObjectId, ref: 'Loai' }, // Đổi tên model ref từ LoaiQuan → Loai
  NgayDang: { type: Date, default: Date.now },
  KiemDuyet: { type: Number, default: 0 },
  LuotXem: { type: Number, default: 0 }
});

module.exports = mongoose.model('ThucPham', schema);
