/**
 * server/routes/inventories/invetory.js
 *
 * @routes /api/contact
 * post / Sends email
 *
 * @todos finish
 *
 * @issues
 *
 */

const EXPRESS = require("express");
const ROUTER = EXPRESS.Router();
const EMAIL = require("../../config/keys").sendGridURI;
const SGMAIL = require("@sendgrid/mail");
/**
 * @purpose Handles Activity for the contact form! YAY CONTACT!
 * @complete --> NO
 * @working no
 *
 * @todos Connect to Form
 * @todos Build email sending capablity with NPM dependency sendgrid/mail
 *
 * @notes
 *  uses dependency sendgrid/mail, see readme.md for link to documentation
 */

// This
// Anthony
// Message
ROUTER.post("/", (req, res) => {
  SGMAIL.setApiKey(EMAIL);
  console.log(req.body);
  // FROM has to be stenbergdigeronimo@gmail.com
  // how the API works is that the email needs to be approved.
  // This can be from a domain!
  const msg = {
    to: "stenbergdigeronimo@gmail.com",
    from: "stenbergdigeronimo@gmail.com",
    subject: "Inventory Contact Form Submission",
    text: `${req.body.firstname} ${req.body.lastname} sent the following message ${req.body.message} and asked to be emailed back at ${req.body.email}`,
    html: `<p>${req.body.firstname} ${req.body.lastname} sent the following message <br> ${req.body.message} <br> and asked to be emailed back at ${req.body.email}</p>`,
  };

  SGMAIL.send(msg)
    .then((result) => {
      res.status(200).json({
        success: true,
      });
    })
    .catch((error) => {
      console.log("errors: " + error);
      res.status(401).json({
        success: false,
      });
    });
});

// Enter no text below this point

module.exports = ROUTER;
