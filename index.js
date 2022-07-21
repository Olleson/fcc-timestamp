const express = require('express');
const app = express();

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC 
const cors = require('cors');
app.use(cors({ optionsSuccessStatus: 200 }));  // some legacy browsers choke on 204

app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} - ${req.ip}`);
  next();
});

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});

// listen for requests :)
let listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});

// your first API endpoint... 
app.get("/api/:date", function (req, res) {
  res.json(getDate(req.params.date));
});

app.get("/api/", (req, res) => {
  res.json(getDate(0));
})

const getDate = (date) => {
  if (date === 0) { let currentDate = new Date(); return { unix: Date.parse(currentDate), utc: currentDate.toUTCString() } }

  let utcDate;
  const regex = /(%20)|(-)|(GMT)/gi;
  let newDate = date.replace(regex, ' ').split(' ');

  if (newDate.length > 1) {
    utcDate = new Date(newDate.join(' ') + ' GMT');
  } else {
    utcDate = new Date(parseInt(newDate[0]));
  }

  if (utcDate.toString() === "Invalid Date") {
    return { error: utcDate.toString() }
  }

  return {
    unix: Date.parse(utcDate),
    utc: utcDate.toUTCString()
  }
}