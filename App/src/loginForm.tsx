import { observer } from "mobx-react";
import React from "react";
import { ReactNode } from "react";
import {
  Segment,
  Header,
  Divider,
  Icon,
  Card,
  Form,
  Button,
  Message,
} from "semantic-ui-react";
import DataStore from "./Main/DataStore";
import "semantic-ui-css/semantic.min.css";

@observer
export class LoginForm extends React.Component<
  { dataStore: DataStore },
  { name: string; password: string; submitted: boolean }
> {
  constructor(props) {
    super(props);
    this.state = { name: "", password: "", submitted: false };

    this.onNameChange = this.onNameChange.bind(this);
    this.onSubmitForm = this.onSubmitForm.bind(this);
    this.onPassChange = this.onPassChange.bind(this);
  }

  onNameChange(event: React.ChangeEvent<HTMLInputElement>) {
    console.log(event.target.value);
    this.setState({ name: event.target.value });
  }

  onPassChange(event: React.ChangeEvent<HTMLInputElement>) {
    console.log(event.target.value);
    this.setState({ password: event.target.value });
  }

  async onSubmitForm() {
    try {
      console.log("subbmited");
      await this.props.dataStore.requestLogin(
        this.state.name,
        this.state.password
      );
      this.setState({ submitted: true });
    } catch (err) {
      console.log(err);
    }
  }

  render(): ReactNode {
    return (
      <Segment basic>
        <Header as="h3" textAlign="center">
          User Profile
        </Header>
        <Divider horizontal inverted>
          <Header as="h4">
            <Icon name="user secret" />
            Account Info
          </Header>
        </Divider>

        <Card
          color="grey"
          style={{
            boxShadow:
              "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
          }}
        >
          <Card.Content>
            <Form inverted size="large">
              <Form.Group widths="equal">
                <Form.Input
                  fluid
                  id="form-subcomponent-shorthand-input-user-name"
                  label="Username"
                  placeholder="Username"
                  onChange={this.onNameChange}
                />
                <Form.Input
                  fluid
                  id="form-subcomponent-shorthand-input-password"
                  label="Password"
                  placeholder="Password"
                  onChange={this.onPassChange}
                />
              </Form.Group>
              <Card.Content extra>
                <Button primary onClick={this.onSubmitForm}>
                  Login
                </Button>
                {this.props.dataStore.getLoggedInUser.name === "default" &&
                  this.state.submitted && (
                    <Message negative>
                      <Message.Header>Login Failed</Message.Header>
                      <p>username or password incorrect</p>
                    </Message>
                  )}
                )
              </Card.Content>
            </Form>
          </Card.Content>
        </Card>
      </Segment>
    );
  }
}
