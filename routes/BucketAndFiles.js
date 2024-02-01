const express = require("express");
const router = express.Router();
const fs = require("fs").promises;
const path = require("path");
const { upload } = require("../middleware/upload");
const BUCKET_MODEL = require("../models/BucketAndFilesModel");
const {
  deleteFolderAndAssociatedFiles,
} = require("../utils/deleteFolderAndAssociateFile");
const ERROR_RESPONSE = require("../utils/handleError");
const { default: mongoose } = require("mongoose");
const { fileUpdate } = require("../middleware/updateUpload");

router.get("/", async (req, res) => {
  res.send("Welcome to JK-Tech (S3)");
});

/* API to upload multiple files or one files */
router.post("/upload/:bucketId", upload.any(), async (req, res) => {
  try {
    const { bucketId } = req.params;
    if (!bucketId) {
      return res.status(400).json({
        status: false,
        message: "Please select the bucket or folder",
      });
    }

    const isBucket = await BUCKET_MODEL.findById(bucketId);

    if (!isBucket) {
      return res.status(404).json({
        status: false,
        message: "Bucket not found",
      });
    }
    console.log("body", req.body);
    console.log("files", req.files);

    if (req.files.length == 0) {
      return res.status(400).json({
        status: false,
        message: "Please select the file",
      });
    }

    let result = [];
    const currentDomain = `${req.protocol}://${req.get("host")}`;
    const createDoc = req.files.map((item) => {
      let payload = {
        name: item?.fieldname,
        fileName: item?.filename,
        // fileUrl: `${currentDomain}/${item?.path}`,
        fileUrl: `${currentDomain}/fetch/${item?.filename}`,
        fileType: item?.mimetype,
        fileSize: item?.size,
        isFolder: false,
        parentId: bucketId,
      };
      result.push(`${currentDomain}/fetch/${item?.filename}`);

      return payload;
    });
    await BUCKET_MODEL.insertMany(createDoc);

    return res.status(200).json({
      status: true,
      message: "Files uploaded sucessfully",
      data: result
    });
  } catch (error) {
    ERROR_RESPONSE(res, error);
  }
});

/* API to create a bucket */
router.post("/create/bucket", async (req, res) => {
  try {
    let payload = {
      name: req.body.name,
      isBucket: true,
      isFolder: false,
      parentId: null,
    };

    const isCreated = await BUCKET_MODEL.create(payload);

    if (!isCreated) {
      return res.status(500).json({
        status: false,
        message: "Something wrong while bucket creation!!!",
      });
    }

    res.status(200).json({
      status: true,
      message: `${payload.name} bucket created sucessfully`,
    });
  } catch (error) {
    ERROR_RESPONSE(res, error);
  }
});

/* API to create list of buckets */
router.post("/create/bucket-list", async (req, res) => {
  try {
    const { bucketList } = req.body;
    /* In bucketList contains only buckets name */
    let createList = bucketList.map((item) => {
      let payload = {
        name: item,
        isBucket: true,
        isFolder: false,
        parentId: null,
      };
      return payload;
    });

    await BUCKET_MODEL.insertMany(createList);

    return res.status(200).json({
      status: true,
      message: "All buckets created successfully",
    });
  } catch (error) {
    ERROR_RESPONSE(res, error);
  }
});

/* API to create a folder */
router.post("/create/folder/:bucketId", async (req, res) => {
  try {
    const { bucketId } = req.params;
    let payload = {
      name: req.body.name,
      isBucket: false,
      isFolder: true,
      parentId: bucketId,
    };

    const isCreated = await BUCKET_MODEL.create(payload);

    if (!isCreated) {
      return res.status(500).json({
        status: false,
        message: "Something wrong while folder creation!!!",
      });
    }

    res.status(200).json({
      status: true,
      message: `${payload.name} folder created sucessfully`,
    });
  } catch (error) {
    ERROR_RESPONSE(res, error);
  }
});

/* API to create list of buckets */
router.post("/create/folder-list/:bucketId", async (req, res) => {
  try {
    const { folderList } = req.body;
    const { bucketId } = req.params;
    /* In folderList contains only buckets name */
    let createList = folderList.map((item) => {
      let payload = {
        name: item,
        isBucket: false,
        isFolder: true,
        parentId: bucketId,
      };
      return payload;
    });

    await BUCKET_MODEL.insertMany(createList);

    return res.status(200).json({
      status: true,
      message: "All folders created successfully",
    });
  } catch (error) {
    ERROR_RESPONSE(res, error);
  }
});

/* Retrive all the bucket list and search the bucket by name, and pagination also */
router.get("/all-bucket", async (req, res) => {
  try {
    let { search, page = 1, limit = 10 } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);
    let skip = (page - 1) * limit;

    let queryCondition = { isBucket: true };
    const searchQuery = new RegExp(search, "i");
    if (searchQuery) {
      queryCondition.name = searchQuery;
    }

    const [bucketList, totalCount] = await Promise.all([
      BUCKET_MODEL.aggregate([
        {
          $match: queryCondition,
        },
        {
          $skip: skip,
        },
        {
          $limit: limit,
        },
      ]),
      BUCKET_MODEL.countDocuments(queryCondition),
    ]);

    if (bucketList.length == 0) {
      return res.status(404).json({
        status: false,
        message: "Bucket not found",
      });
    }

    res.status(200).json({
      status: true,
      data: bucketList,
      totalCount,
    });
  } catch (error) {
    ERROR_RESPONSE(res, error);
  }
});

/* Retrive one file */
router.get("/file/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const isFile = await BUCKET_MODEL.findById(id);

    if (!isFile) {
      return res.status(404).json({
        status: false,
        message: "File not found",
      });
    }

    res.status(200).json({
      status: true,
      data: isFile,
    });
  } catch (error) {
    ERROR_RESPONSE(res, error);
  }
});

/* API Retrive all the data from bucket or from folder by bucketId/folderId and 
 search the file/folder by name,fileName,fileUrl,fileType and pagination also */
router.get("/all-data/:id", async (req, res) => {
  try {
    const { id } = req.params;
    let { search, page = 1, limit = 10 } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);
    let skip = (page - 1) * limit;

    let queryCondition = {
      isBucket: false,
      parentId: new mongoose.Types.ObjectId(id),
    };
    const searchQuery = new RegExp(search, "i");
    if (searchQuery) {
      queryCondition.$or = [
        { name: searchQuery },
        { fileName: searchQuery },
        { fileUrl: searchQuery },
        { fileType: searchQuery },
      ];
    }

    const [fileList, totalCount] = await Promise.all([
      BUCKET_MODEL.aggregate([
        {
          $match: queryCondition,
        },
        {
          $skip: skip,
        },
        {
          $limit: limit,
        },
      ]),
      BUCKET_MODEL.countDocuments(queryCondition),
    ]);

    if (fileList.length == 0) {
      return res.status(404).json({
        status: false,
        message: "Bucket not found",
      });
    }

    res.status(200).json({
      status: true,
      data: fileList,
      totalCount,
    });
  } catch (error) {
    ERROR_RESPONSE(res, error);
  }
});

/* API to edit bucket name or any folder name by id */
router.patch("/update/bucket", async (req, res) => {
  try {
    const { _id, name } = req.body;

    const isUpdate = await BUCKET_MODEL.findByIdAndUpdate(_id, {
      $set: { name },
    });

    if (!isUpdate) {
      return res.status(404).json({
        status: false,
        message: "Bucket/Folder not found",
      });
    }

    res.status(200).json({
      status: true,
      message: "Bucket/Folder name updated sucessfully",
    });
  } catch (error) {
    ERROR_RESPONSE(res, error);
  }
});

/* API to edit bucket name or any file by id */
router.patch("/update-file", fileUpdate.any(), async (req, res) => {
  try {
    const { filename } = req.query;

    const isFile = await BUCKET_MODEL.findOne({
      fileName: filename,
      isBucket: false,
      isFolder: false,
    });

    if (!isFile) {
      return res.status(404).json({
        status: false,
        message: "File not found",
      });
    }

    let item = req.files[0];
    isFile.fileType = item?.mimetype;
    isFile.fileSize = item?.size;
    await isFile.save();

    res.status(200).json({
      status: true,
      message: `File update sucessfully`,
    });
  } catch (error) {
    ERROR_RESPONSE(res, error);
  }
});

/* API route to delete a file or folder with associated files and folders */
router.delete("/delete/:fileId", async (req, res) => {
  try {
    const { fileId } = req.params;
    if (!fileId) {
      return req.status(400).json({
        status: false,
        message: "Please select the any file to delete",
      });
    }

    const isFile = await BUCKET_MODEL.findById(fileId);
    if (!isFile) {
      return req.status(404).json({
        status: false,
        message: "File not found",
      });
    }

    if (isFile.isFolder || isFile.isBucket) {
      await deleteFolderAndAssociatedFiles(fileId);
    } else {
      const filePath = path.join(__dirname, "..", "upload", isFile.fileName);

      const fileExists = await fs
        .access(filePath)
        .then(() => true)
        .catch(() => false);

      if (!fileExists) {
        return res.status(404).send("File not found");
      }

      await fs.unlink(filePath);
    }

    // await BUCKET_MODEL.findByIdAndDelete(fileId);
    return res.status(200).json({
      status: true,
      message: "Deleted Sucessfully",
    });
  } catch (error) {
    ERROR_RESPONSE(res, error);
  }
});

const uploadDirectory = path.join(__dirname, "..", "upload");
router.use("/files", express.static(uploadDirectory));

/* Route to get/fetch the object using the provided path */
router.get("/fetch/:filename", async (req, res) => {
  try {
    const { filename } = req.params;
    const isFile = await BUCKET_MODEL.findOne({ fileName: filename });

    if (!isFile) {
      return res.status(404).json({
        status: false,
        message: "File not found",
      });
    }

    const filePath = path.join(uploadDirectory, filename);
    const fileExists = await fs
      .access(filePath)
      .then(() => true)
      .catch(() => false);

    if (!fileExists) {
      return res.status(404).send("File not found");
    }

    const contentType = isFile.fileType;
    console.log({ contentType });
    if (!contentType) {
      return res.status(500).send("Unsupported file type");
    }

    const fileContent = await fs.readFile(filePath);
    res.setHeader("Content-Type", contentType);
    res.setHeader("Content-Disposition", "inline; filename=" + filename);

    res.send(fileContent);
  } catch (error) {
    console.log(error);
    return res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
