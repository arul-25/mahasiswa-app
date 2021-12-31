const express = require("express");
const app = express();
const morgan = require("morgan");
const expressLayout = require("express-ejs-layouts");
const path = require("path");
const session = require("express-session");
const flash = require("connect-flash");
require("dotenv").config();
const router = require("./routes");
const methodOverride = require("method-override");

const PORT = process.env.PORT || 8000;
// set view engine
app.set("view engine", "ejs");

// middleware
app.use(expressLayout);
app.use(express.urlencoded({ extended: true }));
app.use("/css", express.static(path.resolve(__dirname, "assets/css")));
app.use("/js", express.static(path.resolve(__dirname, "assets/js")));
app.use("/images", express.static(path.resolve(__dirname, "assets/images")));
app.use(methodOverride("_method"));

app.use(
	session({
		cookie: { maxAge: 6000 },
		secret: "secret",
		resave: "true",
		saveUninitialized: "true"
	})
);
app.use(flash());

app.use(router);

app.listen(PORT, () => {
	console.log(`server started at http://localhost:${PORT}`);
});
