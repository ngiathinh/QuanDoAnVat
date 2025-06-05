function firstImage(MoTa) {
  if (typeof MoTa !== 'string') return 'https://quandoanvat.onrender.com/images/noimage.png';
  var regExp = /<img[^>]+src=["']?([^"'\s>]+)["']?[^>]*\/?>/i;
  var results = regExp.exec(MoTa);
  var image = 'https://quandoanvat.onrender.com/images/noimage.png';
  if (results) image = results[1];
  return image;
}

module.exports = firstImage;
