# tetris
It needs a mySql db installed on your machine and nodejs.

the db is just a table "players" with three fields:
id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
name TEXT,
points INT

all the npm pakages needed are listed in package.json

About Javascript:
I transpile ES6 to ES5 with Babel and then bundled it with webpack.

> npx babel --presets env --minified ES6 --out-dir ES5

then run:

> node node_modules/.bin/webpack -d


To init the server run

> node initServer.js

The game should be available at:
127.0.0.1/8098
