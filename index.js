const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();

// set up database
let db = new sqlite3.Database('blogpostsdb');
db.serialize(() => {
    db.run("CREATE TABLE IF NOT EXISTS posts (id BIGINT, date_posted varchar(55), title varchar(55), day varchar(20), image varchar(512), caption text)");
})

const app = express();

const port = process.env.PORT || 5000
app.listen(port, () => console.log(`starting server on port ${port}`));

app.use(express.json());
app.use(cors());

app.post('/posts', (req, res) => {
    // select all the ids in the db
    db.all("SELECT id FROM posts", (err, rows) => {
        // check if the post is new
        let isNewPost = true;
        rows.forEach(row => {
            if(parseInt(req.body.id) === parseInt(row.id)){
                isNewPost = false;
            }
        });

        if(isNewPost){
            db.run('INSERT INTO posts VALUES (?, ?, ?, ?, ?, ?)', [req.body.id, req.body.date_posted, req.body.title, req.body.day, req.body.image, req.body.caption], (err) => {
                if(err) {
                    console.log('an error has occurred while attempting to insert to the database (index.js: 21)')
                } else {
                    console.log(`A post has been inserted with post id ${req.body.id}`)
                }
            });
        } else {
            console.log('this post is already in the database');
        }
    });
});

app.get('/posts', (req, res) => {
    db.all("SELECT * FROM posts", (err, rows) => {
        res.send(rows);
    });
});