require("dotenv").config();
const express = require("express");
const cors = require("cors");
const PORT = process.env.PORT;


const {
  branchRouter,
} = require("./routers");

const app = express();
app.use(cors());
app.use(express.json());
// app.use(bearerToken())
// const auth = require("./middleware/auth")
// app.use(express.static(__dirname + '/public'));
// app.use(auth)
// app.use("/post", postRouter);
// app.use("/user", userRouter);
// app.use("/auth", authRouter);
// app.use("/upload", uploadRouter);
// app.use("/api", routes)
app.use("/branch", branchRouter)


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
