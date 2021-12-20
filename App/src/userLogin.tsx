import { observer } from "mobx-react";
import React from "react";
import { ReactNode } from "react";
import "semantic-ui-css/semantic.min.css";
import {
  Segment,
  Header,
  Divider,
  Icon,
  Card,
  Image,
  Button,
} from "semantic-ui-react";
import { roles } from "./roleEnum";
import DataStore from "./Main/DataStore";
import { user } from "./Main/user";
import { UserOrderModal } from "./userOrderModal";

@observer
export class UserLogin extends React.Component<
  { user: user; dataStore: DataStore },
  { orderModal: boolean }
> {
  constructor(props) {
    super(props);
    this.state = { orderModal: false };
  }

  setModal(value: boolean) {
    this.setState({ orderModal: value });
  }

  render(): ReactNode {
    return (
      <Segment basic>
        <Header as="h3" textAlign="center">
          Profile
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
          <Image
            src="https://image.flaticon.com/icons/png/512/64/64572.png"
            wrapped
            ui={false}
          />
          <Card.Content>
            <Card.Header>UserName: {this.props.user.name}</Card.Header>
            <Card.Meta>Address: {this.props.user?.address}</Card.Meta>
            <Card.Meta>Billing: {this.props.user?.billing}</Card.Meta>
            <Card.Description style={{ color: "black" }}>
              {Number(this.props.user.role) === roles.user && (
                <UserOrderModal user={this.props.user} />
              )}
            </Card.Description>
          </Card.Content>
          <Card.Content extra>
            <a>
              <Icon name="users" />
              {roles[Number(this.props.user.role)]}
            </a>
            {this.props.dataStore.loggedIn && (
              <Button
                negative
                floated="right"
                onClick={() => this.props.dataStore.logOut()}
              >
                {" "}
                Log out
              </Button>
            )}
          </Card.Content>
        </Card>
      </Segment>
    );
  }
}
