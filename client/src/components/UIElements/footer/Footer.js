import React from "react";
import styled from "@emotion/styled";
import { Grid, Image } from "semantic-ui-react";

const Container = styled.div`
  position: absolute;
  bottom: 0;
  width: auto;
  background: #edf2f4;
`;

const Content = styled.div`
  margin-left: 100px;
  text-align: justify;
`;

const Icon = styled.div`
  font-size: 45px;
`;

const footer = ({ props }) => {
  return (
    <Container>
      <Content>
        <Grid divided="vertically">
          <Grid.Row columns={3}>
            <Grid.Column>
              <h3>Lorem</h3>
              <p>
                Duis aute irure dolor in reprehenderit in voluptate velit esse
                cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
                cupidatat non proident.
              </p>
            </Grid.Column>
            <Grid.Column>
              <h3>Help</h3>
              <p>Lorem</p>
              <p>cupidatat reprehenderit</p>
            </Grid.Column>
            <Grid.Column>
              <h4>Connect</h4>
              <Icon>
                <a href=" ">
                  <ion-Icon name="mail-outline"></ion-Icon>
                </a>
                <a href=" ">
                  <ion-Icon name="logo-twitter"></ion-Icon>
                </a>

                <a href=" ">
                  <ion-Icon name="logo-google"></ion-Icon>
                </a>
              </Icon>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Content>
    </Container>
  );
};

export default footer;
