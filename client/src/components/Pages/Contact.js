import React, { useState } from "react";
import Axios from "axios";
import Modal from "react-modal";
import { Grid } from "semantic-ui-react";
import "../../css/Contact.css";

const Contact = () => {
  const [contactFirstName, setContactFirstName] = useState("");
  const [contactLastName, setContactLastName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactMessage, setContactMessage] = useState("");

  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [successModalMsg, setSuccessModalMsg] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    Axios.post("http://localhost:5000/api/contact", {
      firstname: contactFirstName,
      lastname: contactLastName,
      email: contactEmail,
      message: contactMessage,
    }).then((res) => {
      if (res.data.status === "1") {
        setSuccessModalMsg(res.data.message);
        setIsSuccessModalOpen(true);
      }
    });

    setContactFirstName("");
    setContactLastName("");
    setContactEmail("");
    setContactMessage("");
  };

  return (
    <div className="container">
      <Grid divided="vertically">
        <Grid.Row columns={1}>
          <div className="ContactIntro">
            <h1>Get in contact with us!</h1>
          </div>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Morbi
            tincidunt augue interdum velit euismod.{" "}
          </p>
        </Grid.Row>

        <Grid.Row columns={3}>
          <Grid.Column>
            <div className="SubmitForm">
              <form onSubmit={(e) => handleSubmit(e)}>
                <div align="left" width="50%">
                  <div className="label">First Name: </div>
                  <input
                    size="40"
                    type="text"
                    id="fname"
                    value={contactFirstName}
                    onChange={(e) => setContactFirstName(e.target.value)}
                  />
                  <br />
                  <div className="label">Last Name: </div>
                  <input
                    size="40"
                    type="text"
                    id="lname"
                    value={contactLastName}
                    onChange={(e) => setContactLastName(e.target.value)}
                  />
                  <br />
                  <div className="label">Email: </div>

                  <input
                    size="40"
                    type="text"
                    id="email"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                  />
                  <br />
                  <br />
                  <div className="TextForm">
                    <textarea
                      className="form-control"
                      id="exampleFormControlTextarea1"
                      rows="3"
                      value={contactMessage}
                      onChange={(e) => setContactMessage(e.target.value)}
                    ></textarea>
                    <input type="submit" value="Submit" />
                  </div>
                </div>
              </form>
            </div>
            <Modal
              isOpen={isSuccessModalOpen}
              onRequestClose={() => setIsSuccessModalOpen(false)}
            >
              <div>
                <button onClick={() => setIsSuccessModalOpen(false)}>
                  Close
                </button>
              </div>
              <p>{successModalMsg}</p>
            </Modal>
          </Grid.Column>
          <Grid.Column>
            <div className="ContactInfo">
              <div className="List">
                <ul className="list-unstyled mb-4">
                  <li>
                    <div className="Icon">
                      <ion-icon name="location-outline"></ion-icon>
                    </div>
                    Seattle, WA 98118, USA
                  </li>
                  <br />
                  <li>
                    <div className="Icon">
                      <ion-icon name="call-outline"></ion-icon>
                    </div>
                    1-800-123-4567
                  </li>
                  <br />
                  <li>
                    <div className="Icon">
                      <ion-icon name="mail-outline"></ion-icon>
                    </div>
                    contact@inventory.com
                  </li>
                </ul>
              </div>
            </div>
          </Grid.Column>

          <Grid.Column>
            <div className="Social">
              <h4>Connect:</h4>

              <div className="IconSocial">
                <a href=" ">
                  <ion-Icon name="mail-outline"></ion-Icon>
                </a>
                <a href=" ">
                  <ion-Icon name="logo-twitter"></ion-Icon>
                </a>

                <a href=" ">
                  <ion-Icon name="logo-google"></ion-Icon>
                </a>
              </div>
            </div>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </div>
  );
};

export default Contact;
