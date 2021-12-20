import { inject, observer } from "mobx-react";
import * as React from "react";
import { Header, Icon, Grid } from "semantic-ui-react";
import "semantic-ui-css/semantic.min.css";
import { UserLogin } from "../userLogin";
import { LoginForm } from "../loginForm";
import { CheckoutSideNav } from "../checkOutSideNav";
import { SalesOverView } from "../salesOverView";
import { SearchBookBar } from "../searchBookBar";
import { TabTable } from "../tabTable";
import { roles } from "../roleEnum";
import { AdminFeed } from "../adminFeed";
import DataStore from "./DataStore";

@inject("DataStore")
@observer
export default class LandingPageComponent extends React.Component<
  { dataStore: DataStore },
  { Title: string; IsCompleted: boolean; todoError: Error | null }
> {
  constructor(props) {
    super(props);
    this.state = { Title: "", IsCompleted: false, todoError: null };
  }

  render() {
    return (
      <React.Fragment>
        <Header
          as="h1"
          block
          inverted
          style={{
            boxShadow:
              "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
            marginRight: "auto",
          }}
        >
          <Header.Content>
            <Icon name="book" /> Look Inna Book
          </Header.Content>
        </Header>

        <Grid celled>
          <Grid.Row>
            <Grid.Column width={10}>
              <SearchBookBar dataStore={this.props.dataStore} />
            </Grid.Column>
          </Grid.Row>

          <Grid.Row>
            <Grid.Column width={3}>
              {this.props.dataStore.getLoggedIn ? (
                <UserLogin
                  user={this.props.dataStore.getLoggedInUser}
                  dataStore={this.props.dataStore}
                />
              ) : (
                <LoginForm dataStore={this.props.dataStore} />
              )}
            </Grid.Column>
            <Grid.Column width={10}>
              <TabTable dataStore={this.props.dataStore} />
            </Grid.Column>
            <Grid.Column width={3}>
              {Number(this.props.dataStore.loggedInUser.role) ===
              roles.admin ? (
                <AdminFeed dataStore={this.props.dataStore} />
              ) : (
                <CheckoutSideNav dataStore={this.props.dataStore} />
              )}
              {Number(this.props.dataStore.loggedInUser.role) ===
                roles.admin && (
                <SalesOverView dataStore={this.props.dataStore} />
              )}
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </React.Fragment>
    );
  }
}
