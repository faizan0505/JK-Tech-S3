const { connection } = require("./config/db");
const express = require("express");
const app = express();
const fileRoutes = require("./routes/BucketAndFiles");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/", fileRoutes);

const PORT = process.env.PORT || 8080;
app.listen(PORT, async () => {
  try {
    await connection();
    console.log(`DB connected sucessfully on port ${PORT}`);
  } catch (error) {
    console.log(error);
    console.log("Error while connection");
  }
});
