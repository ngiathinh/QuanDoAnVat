const express = require('express');
const app = express();
const mongoose = require('mongoose');
const session = require('express-session');
const path = require('path');

app.locals.firstImage = require('./modules/firstimage');
// Routers
const indexRouter = require('./routers/index');
const authRouter = require('./routers/auth');
const taikhoanRouter = require('./routers/taikhoan');
const loaiRouter = require('./routers/Loai');
const thucphamRouter = require('./routers/ThucPham');

// Kết nối MongoDB
const uri = 'mongodb+srv://thinhdpm215531:12345@cluster0.iwnbkm7.mongodb.net/QuanDoAnVat?retryWrites=true&w=majority';
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('✅ Kết nối MongoDB thành công'))
  .catch(err => console.error('❌ Lỗi kết nối MongoDB:', err.message));

// Cấu hình view engine và middleware
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/', express.static(path.join(__dirname, 'public')));

// Session
app.use(session({
  name: 'anvatzone',
  secret: 'MeoMeoMeo',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 } // 30 ngày
}));

// Biến dùng trong toàn bộ view
app.use((req, res, next) => {
  res.locals.session = req.session;
  const err = req.session.error;
  const msg = req.session.success;
  delete req.session.error;
  delete req.session.success;
  res.locals.message = '';
  if (err) res.locals.message = `<span class="text-danger">${err}</span>`;
  if (msg) res.locals.message = `<span class="text-success">${msg}</span>`;
  next();
});

// Routes
app.use('/', indexRouter);
app.use('/', authRouter);
app.use('/taikhoan', taikhoanRouter);
app.use('/loai', loaiRouter);
app.use('/thucpham', thucphamRouter);

// Khởi động server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);

});
