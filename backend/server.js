import express from "express";

const app = express();
const PORT = 8005 || process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
