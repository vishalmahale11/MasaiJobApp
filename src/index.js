const express = require("express");
const app = express();
const cors = require("cors");
const connection = require("../config/db");
const JobModel = require("../models/job.models");
require("dotenv").config();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 8040;

app.get("/", async (req, res) => {
  try {
    const data = await JobModel.find().limit(10);
    res.send({ data });
  } catch (error) {
    console.log(error);
  }
});

app.get("/filterRole", async (req, res) => {
  const { role } = req.query;
  try {
    const data = await JobModel.find({ role: role });
    res.send({ data });
  } catch (error) {
    console.log(error);
  }
});

app.get("/sortByDatedesc", async (req, res) => {
  try {
    const data = await JobModel.aggregate([{ $sort: { postedAt: -1 } }]);
    res.send({ data });
  } catch (error) {}
});

app.get("/sortByDateasc", async (req, res) => {
  try {
    const data = await JobModel.aggregate([{ $sort: { postedAt: 1 } }]);
    res.send({ data });
  } catch (error) {}
});

app.post("/jobPost", async (req, res) => {
  const { company, city, location, role, level, contract, position, language } =
    req.body;

  const job_lists = new JobModel({
    company,
    city,
    location,
    role,
    level,
    contract,
    position,
    language,
  });
  await job_lists.save();
  res.send({ job_lists });
});

app.listen(PORT, async () => {
  try {
    await connection();
    console.log(`http://localhost:${PORT}`);
  } catch (error) {
    console.log(error);
  }
});
