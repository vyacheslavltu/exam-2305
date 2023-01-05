const express = require("express");
const app = express();
const port = 3003;
app.use(express.json({ limit: '10mb' }));
const cors = require("cors");
app.use(cors());
const md5 = require('js-md5');
const uuid = require('uuid');
const mysql = require("mysql");
app.use(
    express.urlencoded({
        extended: true,
    })
);
app.use(express.json());


const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "localeventservices",
});

////////////////////LOGIN/////////////////
/* ** role flag list
 *    10 - is for admin
 *     1 - is for user
 */
const doAuth = function(req, res, next) {
    if (0 === req.url.indexOf('/server')) { 
        const sql = `
        SELECT
        name, role
        FROM users
        WHERE session = ?
    `;
        con.query(
            sql, [req.headers['authorization'] || ''],
            (err, results) => {
                if (err) throw err;
                if (!results.length || results[0].role !== 10) {
                    res.status(401).send({});
                    req.connection.destroy();
                } else {
                    next();
                }
            }
        );
    } else if (0 === req.url.indexOf('/login-check') || 0 === req.url.indexOf('/login')|| 0 === req.url.indexOf('/register')) {
        next();
    } else { 
        const sql = `
        SELECT
        name, role
        FROM users
        WHERE session = ?
    `;
        con.query(
            sql, [req.headers['authorization'] || ''],
            (err, results) => {
                if (err) throw err;
                if (!results.length) {
                    res.status(401).send({});
                    req.connection.destroy();
                } else {
                    next();
                }
            }
        );
    }
}

app.use(doAuth);

// AUTH
/* ** auth status list
 *    1 - not logged
 *    2 - not an admin
 *    3 - is auth as admin
 *    4 - is auth as user
 */
app.get("/login-check", (req, res) => {
    const sql = `
         SELECT
         name, role
         FROM users
         WHERE session = ?
        `;
    con.query(sql, [req.headers['authorization'] || ''], (err, result) => {
        if (err) throw err;
        if (!result.length) {
            res.send({ msg: 'error', status: 1 }); 
        } else {
            if ('admin' === req.query.role) {
                if (result[0].role !== 10) {
                    res.send({ msg: 'error', status: 2 }); 
                } else {
                    res.send({ msg: 'ok', status: 3 }); 
                }
            } else {
                res.send({ msg: 'ok', status: 4 }); 
            }
        }
    });
});

app.post("/login", (req, res) => {
    const key = uuid.v4();
    const sql = `
    UPDATE users
    SET session = ?
    WHERE name = ? AND password = ?
  `;
    con.query(sql, [key, req.body.user, md5(req.body.pass)], (err, result) => {
        if (err) throw err;
        if (!result.affectedRows) {
            res.status(401).send({ msg: 'error', key: '' });
        } else {
            res.send({ msg: 'ok', key, text: 'Welcome back ' + req.body.user + ' ! :)', type: 'info' });
        }
    });
});

app.post("/register", (req, res) => {
    const key = uuid.v4();
    const sql = `
    INSERT INTO users (name, password, session)
    VALUES (?, ?, ?)
  `;
    con.query(sql, [req.body.name, md5(req.body.pass), key], (err, result) => {
        if (err) throw err;
        res.send({ msg: 'ok', key, text: 'Welcome ', type: 'info' });
    });
});


/////////////////////////////////

//CREATE MUNICIPALITY
app.post("/server/cities", (req, res) => {
    const sql = `
    INSERT INTO cities (title, image)
    VALUES (?, ?)
    `;
    con.query(sql, [req.body.title, req.body.image], (err, result) => {
        if (err) throw err;
        res.send({ msg: 'OK', text: 'A new city has been added.', type: 'success' });
    });
});

//CREATE SERVICE
app.post("/server/events", (req, res) => {
    const sql = `
    INSERT INTO/events (title)
    VALUES (?)
    `;
    con.query(sql, [req.body.title], (err, result) => {
        if (err) throw err;
        res.send({ msg: 'OK', text: 'A new event has been added.', type: 'success' });
    });
});

//CREATE COMMENT
app.post("/home/comments", (req, res) => {
    const sql = `
    INSERT INTO comments (post, mun_id, service_id)
    VALUES (?, ?, ?)
    `;
    con.query(sql, [req.body.post, req.body.mun_id, req.body.service_id], (err, result) => {
        if (err) throw err;
        res.send({ msg: 'OK', text: 'Thanks for the post. It will be approved soon.', type: 'info' });
    });
});



// READ MUNICIPALITY for admin
app.get("/server/cities", (req, res) => {
    const sql = `
    SELECT *
    FROM cities
    ORDER BY id DESC
    `;
    con.query(sql, (err, result) => {
        if (err) throw err;
        res.send(result);
    });
});

// READ MUNICIPALITY for home
app.get("/home/cities", (req, res) => {
    const sql = `
    SELECT *
    FROM cities
    ORDER BY id DESC
    `;
    con.query(sql, (err, result) => {
        if (err) throw err;
        res.send(result);
    });
});

// READ SERVICE for admin
app.get("/server/events", (req, res) => {
    const sql = `
    SELECT *
    FROM/events
    ORDER BY id DESC
    `;
    con.query(sql, (err, result) => {
        if (err) throw err;
        res.send(result);
    });
});

// READ SERVICE for home
app.get("/home/events", (req, res) => {
    const sql = `
    SELECT *
    FROM/events
    ORDER BY id DESC
    `;
    con.query(sql, (err, result) => {
        if (err) throw err;
        res.send(result);
    });
});

// READ COMMENTS for home
app.get("/home/comments", (req, res) => {
    const sql = `
    SELECT c.*, m.title AS municipalityTitle, mun_id AS mid, m.image AS municipalityImage, s.title AS serviceTitle, s.id AS sid
    FROM comments AS c
    INNER JOIN cities AS m 
    ON c.mun_id = m.id
    INNER JOIN/events AS s
    ON c.service_id = s.id
    WHERE c.status = 1
    `;
    con.query(sql, (err, result) => {
        if (err) throw err;
        res.send(result);
    });
});

// READ COMMENTS for admin

app.get("/server/comments", (req, res) => {
    const sql = `
    SELECT  m.title AS municipalityTitle, mun_id AS mid, s.title AS serviceTitle, c.post, c.status, c.id as comment_id
    FROM comments AS c
    INNER JOIN cities AS m
    ON c.mun_id = m.id
    INNER JOIN/events AS s
    ON c.service_id = s.id
    `;
    con.query(sql, (err, result) => {
      if (err) throw err;
      res.send(result);
    });
  });



// DELETE CITY
app.delete("/server/cities/:id", (req, res) => {
    const sql = `
    DELETE FROM cities
    WHERE id = ?
    `;
    con.query(sql, [req.params.id], (err, result) => {
        if (err) throw err;
        res.send({ msg: 'OK', text: 'The city has been deleted.', type: 'info' });
    });
});

// DELETE EVENT
app.delete("/server/events/:id", (req, res) => {
    const sql = `
    DELETE FROM/events
    WHERE id = ?
    `;
    con.query(sql, [req.params.id], (err, result) => {
        if (err) throw err;
        res.send({ msg: 'OK', text: 'The event has been deleted.', type: 'info' });
    });
});

//DELETE comments
app.delete("/server/comments/:id", (req, res) => {
    const sql = `
    DELETE FROM comments
    WHERE id = ?
    `;
    con.query(sql, [req.params.id], (err, result) => {
        if (err) throw err;
        res.send({ msg: 'OK', text: 'Unappropriate comment has been deleted.', type: 'info' });
    });
});


//UPDATE MUNICIPALITY
app.put("/server/cities/:id", (req, res) => {
    let sql;
    let r;
    if (req.body.deletePhoto) {
        sql = `
        UPDATE cities
    
        SET title = ?, image = null
        WHERE id = ?
        `;
        r = [req.body.title, req.params.id];
    } else if (req.body.image) {
        sql = `
        UPDATE cities
    
        SET title = ?, image = ?
        WHERE id = ?
        `;
        r = [req.body.title, req.body.image, req.params.id];
    } else {
        sql = `
        UPDATE cities
    
        SET title = ?,
        WHERE id = ?
        `;
        r = [req.body.title, req.params.id]
    }
    con.query(sql, r, (err, result) => {
        if (err) throw err;
        res.send({ msg: 'OK', text: 'The city has been edited.', type: 'success' });
    });
});

//UPDATE/events
app.put("/server/events/:id", (req, res) => {
    const sql = `
      UPDATE/events
      SET title = ?
      WHERE id = ?
      `;
    con.query(sql, [req.body.title, req.params.id], (err, result) => {
      if (err) throw err;
      res.send({ msg: 'OK', text: 'The event has been edited.', type: 'success' });
    });
  });

  // UPDATE COMMENTS for admin

app.put("/server/comments/:id", (req, res) => {
    const sql = `
      UPDATE comments
      SET status = ?
      WHERE id = ?
      `;
    con.query(sql, [req.body.status, req.params.id], (err, result) => {
      if (err) throw err;
      res.send({ msg: 'OK', text: 'The comment has been approved.', type: 'success' });
    });
  });

/////////////////////////////////
// // ** CHECK THAT API IS RUNNING

// // check db connection
// // read all users
// app.get("/users", (req, res) => {
//     const sql = `
//       SELECT name
//       FROM users
//       `;
//     con.query(sql, (err, result) => {
//       if (err) throw err;
//       res.send(result);
//     });
//   });
  
//   // check endpoint
//   app.get("/api", (req, res) => {
//     res.send("Respond success from endpoint root/");
//   });
  
  // init app
  app.listen(port, () => {
    console.log(`API listen at port ${port} `);
  });