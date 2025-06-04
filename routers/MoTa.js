// mota.js
function createMoTaWithImages(tenMon) {
  // Mình ví dụ băm tên món để chọn 1 ảnh từ 1..6
  let sum = 0;
  if (tenMon) {
    for (let i = 0; i < tenMon.length; i++) {
      sum += tenMon.charCodeAt(i);
    }
  }
  const imgIndex = (sum % 6) + 1;

  // Tạo đoạn HTML mô tả kèm ảnh minh họa tương ứng
  return `
    <p>Món ăn <strong>${tenMon}</strong> gồm các thành phần sau:</p>
    <p><img src="/images/articles/${imgIndex}.jpg" alt="Ảnh minh họa món ăn" style="max-width:100%;"/></p>
    <p>Đây là ảnh minh họa đặc trưng cho món ăn này.</p>
  `;
}

module.exports = createMoTaWithImages;
