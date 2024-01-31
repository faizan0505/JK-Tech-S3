const multer = require("multer");
const path = require("path");
const slugify = require("slugify");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./upload");
  },
  filename: function (req, file, cb) {
    console.log({ fielll: req.params.filename });
    const ext = path.extname(file.originalname);

    const sanitizedFilename = slugify(file.originalname, {
      replacement: "-",
      remove: /[*+~.()'"!:@]/g,
      lower: true,
    });

    const timestamp = Date.now();
    const filename = `${sanitizedFilename}-${timestamp}${ext}`;
    cb(null, filename);
  },
});

const upload = multer({ storage });


module.exports = { upload };
