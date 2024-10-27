require("dotenv").config();

const cors = require("cors");
const express = require("express");
const { connectDB } = require("./config/database.js");
const cookieParser = require("cookie-parser");
const bodyParser = require('body-parser')

const userRoute = require("./routes/userRoute.js");
const courseRoute = require("./routes/courseRoute.js");
const reviewRoute = require("./routes/reviewRoute.js");
const cartRoute = require("./routes/cartRoute.js");
const categoryRoute = require("./routes/categoryRoute.js");
const AssignmentRoute = require("./routes/assignmentRoute.js");
const StudyPlanRoute = require("./routes/studyPlanRoute.js");

const authRoute = require("./routes/authRoute.js");

const app = express();
const port = process.env.PORT;

connectDB();

app.use(
  cors({
    credentials: true,
    origin: true,
  })
);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

app.use("/user", userRoute);
app.use("/course", courseRoute);
app.use("/rating", reviewRoute);
app.use("/cart", cartRoute);
app.use("/category", categoryRoute);
app.use("/assignment", AssignmentRoute);
app.use("/studyPlan", StudyPlanRoute);

app.use("/auth", authRoute);

app.listen(port, () => {
  console.log(`App Listening on port ${port}`);
});
