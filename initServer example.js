const http = require('http');
const express = require('express'); // npm install express --save
const app = express();

// const store = new express.session.MemoryStore; to store session data. It is an alternative to mysqlPool

const server = http.createServer(app);
console.log('server started');

// it creates a cookie for session data, SEE LINE 43 
const session = require('express-session'); // npm install express-session --save

// needed for post request to read url form encooded
const bodyParser = require('body-parser'); // npm install body-parser --save

// create a connection to the db. To consume it use connection.query(sql, (error, result, fields) => {})
const mysql = require('mysql'); // npm install mysql --save
const connection = mysql.createConnection({
    host: '******',
    port: '*****',
    user: '*******',
    password: '********',
    database: '*******'
});

// to store session data into mysql db
const mysqlStore = require('express-mysql-session')(session); // npm install express-mysql-session --save (To store sessions data)
const mysqlPool = mysql.createPool({
    canRetry: true,
    host: '********',
    port: '****',
    user: '********',
    password: '**********',
    database: '******',
    connectionLimit: 100
});

// Create a session object to store session data into mysql
const sessionStore = new mysqlStore({
    expiration: 24 * 60 * 60 * 1000
}, mysqlPool);

app.set('view engine', 'ejs');

app.use(session({
    name: 'id',
    secret: 'ssshhhh',
    store: sessionStore,
    saveUninitialized: true,
    resave: false,
    cookie: {
        path: "/",
        secure: false,
        maxAge: 24 * 60 * 60 * 1000
    }
}));

// parse application/x-www-form-urlencoded 
app.use(bodyParser.urlencoded({ extended: false }));

// define public directory for template dependencies (CSS, JS etc...)
app.use(express.static(__dirname + '/public'));


app.get('/', function(req, res) {
    res.render(__dirname + '/views/game.ejs');
});

app.get('/submit-name', function(req, res) {
    if (req.session && req.session.allowToSign) {
        res.render(__dirname + '/views/form.ejs', {points: req.session.points});
    } else {
        res.redirect('/players-list');
    }
});

app.get('/players-list', function(req, res) {
    let id;
    if (req.session.playerId) {
        id = req.session.playerId;
    }
    const sql = 'SELECT * FROM players';
    connection.query(sql, function(err, result, fields) {
        if (err) throw err;
        let fullList = JSON.stringify(result);
        fullList = JSON.parse(fullList);
        
        fullList.sort(function(a,b) {
            if (a.points > b.points) {
                return -1;
            } else {
                return 1;
            }
        });
        
        let list = fullList.slice(0, 10);
        
        console.log(`passed down id: ${id}`);
        res.render(__dirname + '/views/players-list.ejs', {list: list, id: id});
    });
});

app.post('/allow-sign', function(req, res) {
    req.session.allowToSign = true;
    req.session.points = req.body.nl;
    req.session.save();
    //res.locals.points = req.body.nl
    res.writeHead(200);
    res.send();
});

app.post('/insert-name', function(req, res) {
    const sql = 'INSERT INTO players SET name=?, points=?';
    const params = [req.body.name, Number(req.session.points)];
    connection.query(sql, params, function(err, result) {
        if (err) throw err;
        console.log('name inserted into the database: ', result.insertId);
        req.session.playerId = result.insertId;
        req.session.save();
    });
    req.session.allowToSign = false;
    req.session.save();
    res.writeHead(200);
    res.send();
});


const io = require('socket.io').listen(server); // npm install socket.io --save
io.sockets.on('connect', function(socket) {
    
    socket.on('ask-lower-point', function(data) {
        const sql = 'SELECT * FROM players ORDER BY points DESC LIMIT 10';
        connection.query(sql, function(err, result, fields) {
            if (err) throw err;
            let list = JSON.stringify(result);
            list = JSON.parse(list);
            
            const lowerPoint = list[9].points;
            
            socket.emit('lower-point', lowerPoint);
        });
    });
    
});


server.listen(1818);
console.log('server listening at: 1818');
