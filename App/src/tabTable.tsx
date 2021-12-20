import { observer } from "mobx-react";
import React from "react";
import { ReactNode } from "react";
import { Message, Tab } from "semantic-ui-react";
import DataStore from "./Main/DataStore";
import "semantic-ui-css/semantic.min.css";
import { roles } from "./roleEnum";
import { BookCard } from "./bookCard";
import { BookOnlyCard } from "./bookOnly";
import { AdminTable } from "./adminTable";
import { action } from "mobx";
import { PublisherTable } from "./publisherTable";

@observer
export class TabTable extends React.Component<
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

  componentDidUpdate() {
    console.log("updating");
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

  @action.bound
  renderTabPanes(): any[] {
    let tabPanes: any[] = [];
    //check user role

    //user should default have collection and book regardsless of loggin or not
    tabPanes.push({
      menuItem: { key: "books", icon: "book", content: "Books" },
      render: () => (
        <Tab.Pane>
          <BookOnlyCard dataStore={this.props.dataStore} search={false} />
        </Tab.Pane>
      ),
    });

    tabPanes.push({
      menuItem: { key: "collection", icon: "dolly", content: "Collection" },
      render: () => (
        <Tab.Pane>
          <BookCard
            dataStore={this.props.dataStore}
            collection={this.props.dataStore.getCollectionMap()}
          />
        </Tab.Pane>
      ),
    });
    if (Number(this.props.dataStore.getLoggedInUser.role) === roles.admin) {
      //if its admin then someting else happens

      tabPanes.push({
        menuItem: { key: "admin", icon: "users", content: "Admin" },
        render: () => (
          <Tab.Pane>
            <AdminTable dataStore={this.props.dataStore} />
          </Tab.Pane>
        ),
      });

      tabPanes.push({
        menuItem: { key: "publisher", icon: "box", content: "publisher" },
        render: () => (
          <Tab.Pane>
            <PublisherTable dataStore={this.props.dataStore} />
          </Tab.Pane>
        ),
      });
    }

    return tabPanes;
  }

  render(): ReactNode {
    //based on roles assign which tabs are open
    const panes = this.renderTabPanes();
    return (
      <div>
        <Tab panes={panes} />
        {this.props.dataStore.loggedIn && <Message positive>Logged In</Message>}
      </div>
    );
  }
}
