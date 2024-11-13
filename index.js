require("dotenv").config();

const cors = require("cors");
const express = require("express");
const { connectDB } = require("./config/database.js");
const cookieParser = require("cookie-parser");
const bodyParser = require('body-parser');

const userRoute = require("./routes/userRoute.js");
const courseRoute = require("./routes/courseRoute.js");
const reviewRoute = require("./routes/reviewRoute.js");
const cartRoute = require("./routes/cartRoute.js");
const categoryRoute = require("./routes/categoryRoute.js");
const AssignmentRoute = require("./routes/assignmentRoute.js");
const StudyPlanRoute = require("./routes/studyPlanRoute.js");
const stripeRoute = require('./routes/stripeRoute.js');
const authRoute = require("./routes/authRoute.js");

const app = express();
const port = process.env.PORT || 4500; // Ensure default value if PORT is not set

// Connect to Database
connectDB();

// Basic route for testing connection
app.get('/', async (req, res) => { res.send('Connected'); });

// Middleware
app.use(
  cors({
    credentials: true,
    origin: true,
  })
);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/user", userRoute);
app.use("/course", courseRoute);
app.use("/rating", reviewRoute);
app.use("/cart", cartRoute);
app.use("/category", categoryRoute);
app.use("/assignment", AssignmentRoute);
app.use("/studyPlan", StudyPlanRoute);
app.use("/auth", authRoute);
app.use('/payment', stripeRoute);

// Listen on specified port
app.listen(port, () => {
  console.log(`App Listening on port ${port}`);
});

// Export app for Vercel compatibility
module.exports = app;
