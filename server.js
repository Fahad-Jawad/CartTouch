const express = require("express");
const bodyParser = require("body-parser");
const twilio = require("twilio");
const cors = require("cors");
const User = require("./firebase");

const app = express();
const port = 3000;
app.use(cors());
app.use(bodyParser.json());

const accountSid = "AC583ca9cf2f5b7aab08790ab7c0c6ddb6";
const authToken = "dc875985ec1c4d0587f8e2b9094d4a9e";
const twilioNumber = "+14243641210";
const recipientNumber = "+923334202460";

const twilioClient = twilio(accountSid, authToken);

// Signup endpoint
app.post("/signup", async (req, res) => {
  const { email, password, phone } = req.body;
  const newUser = {
    phone: phone,
    email: email,
    password: password,
  };
  await User.add(newUser)
    .then((docRef) => {
      const userId = docRef.id;
      console.log("User added with ID:", userId);
      const userData = {
        id: userId,
        phone: newUser.phone,
      };
      res.json(userData);
    })
    .catch((error) => console.error("Error adding user:", error));
});

// API endpoint to send SMS
app.post("/send-sms", (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "POST");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  const { sms, phone } = req.body;
  console.log('bd',req.body,sms,phone)
  twilioClient.messages
    .create({
      body: sms,
      from: twilioNumber,
      to: phone,
    })
    .then((message) => {
      console.log(message);
      res.json({ success: true, messageSid: message.sid });
    })
    .catch((error) => {
      console.error("Error sending SMS:", error);
      res.status(500).json({ success: false, error: error.message });
    });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
