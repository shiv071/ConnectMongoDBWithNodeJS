const { MongoClient } = require('mongodb');
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const path = require('path');
const hbs = require('hbs');
const bodyParser = require('body-parser');

const tempPath = path.join(__dirname, "files");
app.set("view engine", "hbs");     
app.set("views", tempPath);
app.use(express.static(tempPath));

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.render("login");
});
app.get("/login", (req, res) => {
  res.render("login");
});
app.get("/signup", (req, res) => {
  res.render("signup");
});


const url = 'mongodb://127.0.0.1:27017';
const client = new MongoClient(url);

// Database Name
const dbName = 'LoginForm';

app.post("/signup", async (req, res) => {
  await client.connect();
  console.log('Connected successfully to server');
  const db = client.db(dbName);
  const collection = db.collection('logindata');
  const formdata = {
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  };
  try {
    await collection.insertOne(formdata); 
    res.render("login");
  } catch (error) {
    console.error(error);
    res.render('signup');
  }
});

app.post('/login', async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  await client.connect();
  console.log('Connected successfully to server');
  const db = client.db(dbName);
  const collection = db.collection('logindata');

  const user = await collection.findOne({ email });

  if (!user) {
    // User with this email does not exist
    res.render('login', { error: 'Invalid email or password' });
    return;
  }

  if (user.password !== password) {
    // Passwords do not match
    res.render('login', { error: 'Invalid email or password' });
    return;
  }

  // Login successful, redirect to the dashboard
  res.redirect('/dashboard');
});



app.get("/dashboard", (req, res) => {
  res.send("Welcome to the dashboard!");
});

app.listen(port, () => {
  console.log("Listening on port ${port}");
})








// // Set up the user schema
// const userSchema = new mongoose.Schema({
//   name: String,
//   email: String,
//   password: String,
// });

// const User = mongoose.model("User", userSchema);


// app.post("/login", (req, res) => {
//   const { email, password } = req.body;
//   User.findOne({ email: email, password: password }, (err, user) => {
//     if (err) {
//       console.log(err);
//       res.redirect("/login");
//     } else {
//       if (user) {
//         console.log("User logged in!");
//         res.redirect("/dashboard");
//       } else {
//         console.log("Invalid email or password.");
//         res.redirect("/login");
//       }
//     }
//   });
// });



