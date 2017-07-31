var express = require('express'),
    path = require('path'),
    app = express(),
    port = 3000;


app.use(express.static(path.join(__dirname, './')));

app.listen(port);

console.log('Vanilla autosuggest Server is Up and Running at Port: ' + port);
