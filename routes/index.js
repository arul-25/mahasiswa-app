const express = require("express");
const app = express();
const home = require("./HomeRoute");
const JurusanRoute = require("./JurusanRoute");
const FakultasRoute = require("./FakultasRoute");
const MahasiswaRoute = require("./MahasiswaRoute");

app.use("/", home);
app.use("/jurusan", JurusanRoute);
app.use("/fakultas", FakultasRoute);
app.use("/mahasiswa", MahasiswaRoute);

module.exports = app;
