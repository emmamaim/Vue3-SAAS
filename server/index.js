const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// 測試：第一條API路徑
app.get("/api/test", (req, res) => {
  res.json({ message: "連綫成功！" });
});

app.listen(3000, () => {
  console.log("後端伺服器運作中：http://localhost:3000");
});
