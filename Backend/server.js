const http = require("http");
const fs = require("fs");
const express = require("express");
const app = express();
const multer = require("multer");
const sharpMulter = require("sharp-multer");
const db = require("./databases.js");
const path = require("path");
const body_parser = require("body-parser");

app.use(body_parser.json())

const storage = multer.diskStorage ({
    destination: (function(req, file, callback) {
        callback(null, "./Images");
    }),
    filename: (function(req, file, callback) {
        callback(null, file.originalname)
    })
})

const upload = multer({storage: storage});

app.use(express.urlencoded({ extended: true }));
app.use("/home", express.static("../Frontend"));
app.use("/pictures", express.static(path.join( './Images')));

async function dbInsert(name, title, height, width) {
    try {
        let myCommand = `INSERT INTO picture_data(picture_name, picture_title, width, height) VALUES (?, ?, ?, ?)`;
        db.query(myCommand, [name, title, width, height])
    }

    catch(error) {
        console.log(`ERROR: ${error}`);
    }
}


app.post("/picture", upload.single("uploadedPicture"), function(req, res) {
    const FileName = req.file.originalname;
    if(req.body.title == "gabel256") {
        let deleteCommand = "TRUNCATE TABLE picture_data";
        db.query(deleteCommand);
        res.redirect("/home");
        return;
    }
        dbInsert(FileName, req.body.title, req.body.heightPX, req.body.widthPX);
        res.redirect("/home");
    });

app.use("/data", async function(req, res) {
    try {
        let data = await db.query('SELECT * FROM picture_data');
        res.json(data[0]);
    }
    catch (error) {
        console.log(error);
        res.sendStatus(404);
        return;
    }
})

app.put("/update", function(req, res, error) {
    let updateCommand = "UPDATE picture_data SET picture_title = ? WHERE picture_name = ?";
    db.query(updateCommand, [req.body.newInput, req.body.fileName])
    if(error) {
        console.log(`ERROR: ${error}`)
    }
})

app.delete("/delete", function(req, res) {
    let removeCard = "DELETE FROM picture_data WHERE picture_title = ? AND picture_name = ?";
    db.query(removeCard, [req.body.title, req.body.fileName]); 
})

app.listen(3000, '0.0.0.0', function(error) {
    if(error) {
        console.log(error);
    }
})