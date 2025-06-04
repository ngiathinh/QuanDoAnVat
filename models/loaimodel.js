const mongoose = require('mongoose');

const loaiSchema = new mongoose.Schema({
  TenLoai: String,
  MoTa: String,
});

module.exports = mongoose.model('Loai', loaiSchema);
