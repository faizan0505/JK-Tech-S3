const mongoose = require("mongoose");

const fileAndFolderSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
    },
    fileName: {
      type: String,
      trim: true,
    },
    fileUrl: {
      type: String,
      trim: true,
    },
    fileType: {
      type: String,
      trim: true,
    },
    fileSize: {
      type: Number,
      default: 0,
    },
    isFolder: {
      type: Boolean,
      default: false,
    },
    isBucket: {
      type: Boolean,
      default: false,
    },
    parentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "buckets",
    },
  },
  {
    timestamps: true,
  }
);

const FILE_AND_FOLDER_MODEL = mongoose.model("buckets", fileAndFolderSchema);

module.exports = FILE_AND_FOLDER_MODEL;
