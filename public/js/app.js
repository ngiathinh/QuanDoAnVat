const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const path = require('path');

const app = express();
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>

// Kết nối MongoDB
const uri = 'mongodb+srv://thinhdpm215531:12345@cluster0.iwnbkm7.mongodb.net/DoAnWeb?retryWrites=true&w=majority';
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('✅ Kết nối MongoDB thành công'))
  .catch(err => console.error('❌ Lỗi kết nối MongoDB:', err.message));

// View engine và public
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

// Helper (sử dụng trong toàn bộ view)
const firstImage = require('./helpers/firstImage');
app.use((req, res, next) => {
  res.locals.session = req.session;
  res.locals.firstImage = firstImage;

  const err = req.session.error;
  const msg = req.session.success;
  delete req.session.error;
  delete req.session.success;
  res.locals.message = '';
  if (err) res.locals.message = `<span class="text-danger">${err}</span>`;
  if (msg) res.locals.message = `<span class="text-success">${msg}</span>`;
  next();
});

// Routers
const indexRouter = require('./routers/index');
const authRouter = require('./routers/auth');
const taikhoanRouter = require('./routers/taikhoan');
const loaiRouter = require('./routers/loai'); // ✅ sửa lại tên
const thucphamRouter = require('./routers/thucpham'); // ✅ sửa lại tên

app.use('/', indexRouter);
app.use('/', authRouter);
app.use('/taikhoan', taikhoanRouter);
app.use('/loai', loaiRouter);         // Đúng theo module "loai"
app.use('/thucpham', thucphamRouter); // Đúng theo module "thucpham"

// Khởi động server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running at http://127.0.0.1:${PORT}`);
});
