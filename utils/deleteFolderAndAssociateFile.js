const BUCKET_MODEL = require("../models/BucketAndFilesModel");
const fs = require("fs").promises;
const path = require("path");

async function deleteFolderAndAssociatedFiles(folderId) {
  try {
    const filesToDelete = await BUCKET_MODEL.find({
      parentId: folderId,
    });

    for (const file of filesToDelete) {
      if (file.isFolder) {
        await deleteFolderAndAssociatedFiles(file._id);
      }

      const filePath = file.fileName
        ? path.join(__dirname, "..", "upload", file.fileName)
        : null;

      if (filePath) {
        console.log({ filePath });
        const fileExists = await fs
          .access(filePath)
          .then(() => true)
          .catch(() => false);

        if (fileExists) {
          await fs.unlink(filePath);
        }
      }

      await BUCKET_MODEL.findByIdAndDelete(file._id);
    }
  } catch (error) {
    console.log(error);
  }
}

module.exports = { deleteFolderAndAssociatedFiles };
