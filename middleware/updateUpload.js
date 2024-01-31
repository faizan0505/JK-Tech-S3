const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./upload");
  },
  filename: function (req, file, cb) {
    let data = req.query.filename
    cb(null, data);
  },
});

const fileUpdate = multer({ storage });

module.exports = {fileUpdate}