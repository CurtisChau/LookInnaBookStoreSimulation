import { observer } from "mobx-react";
import React from "react";
import { ReactNode } from "react";
import {
  Header,
  Icon,
  Card,
  Button,
  Dropdown,
  Feed,
  Table,
} from "semantic-ui-react";
import DataStore from "./Main/DataStore";
import "semantic-ui-css/semantic.min.css";

@observer
export class SalesOverView extends React.Component<
  { dataStore: DataStore },
  {
    addValues: String[];
    field: string;
    password: string;
    submitted: boolean;
    selectionModal: boolean;
  }
> {
  constructor(props) {
    super(props);
    this.state = {
      addValues: [],
      field: "",
      password: "",
      submitted: false,
      selectionModal: false,
    };

    this.onSubmitForm = this.onSubmitForm.bind(this);
    this.onPassChange = this.onPassChange.bind(this);
    this.onAddBookSelection = this.onAddBookSelection.bind(this);
    this.addBookFromCollection = this.addBookFromCollection.bind(this);
    this.onfieldBookSelection = this.onfieldBookSelection.bind(this);
  }

  onPassChange(event: React.ChangeEvent<HTMLInputElement>) {
    console.log(event.target.value);
    this.setState({ password: event.target.value });
  }

  async onRemoveBookFromCollection(bookid: String, collectionid: String) {
    try {
      console.log(bookid, collectionid);
      this.props.dataStore.removeBookFromCollection(bookid, collectionid);
    } catch (err) {
      console.log(err);
    }
  }

  onfieldBookSelection(event: any, data: any) {
    console.log(data?.value);
    this.setState({ field: data?.value });
    this.setState({ selectionModal: true });
  }

  onAddBookSelection(event: any, data: any) {
    this.setState({ addValues: data?.value });
  }

  selectionArray(): any[] {
    let selectionArray: any[] = [];

    this.props.dataStore.getAllBookArray.forEach((book) => {
      selectionArray.push({
        key: book.genre,
        text: book.genre,
        value: book.genre,
      });
    });
    console.log(selectionArray);
    return selectionArray;
  }

  setOpen(value: boolean) {
    this.setState({ selectionModal: value });
  }

  async addBookFromCollection(collectionId: String, collectionName?: String) {
    try {
      console.log(collectionId, collectionName);
      console.log(this.state.addValues);
      await this.props.dataStore.addBooksToCollection(
        this.state.addValues,
        collectionId,
        collectionName
      );
      //this.setOpen(false);
    } catch (err) {}
  }

  async onSubmitForm() {
    try {
      console.log("pressed");
      await this.props.dataStore.requestSalesReport(this.state.field);
    } catch (err) {
      console.log(err);
    }
  }

  render(): ReactNode {
    const searchOptions: any[] = [
      { key: "genre", text: "genre", value: "genre" },
      { key: "author", text: "author", value: "author" },
      { key: "publisher", text: "publisher", value: "publisher" },
      { key: "expenses", text: "expenditure", value: "expenses" },
    ];
    return (
      <Card>
        <Card.Content>
          <Card.Header>
            Sales Report
            <Dropdown
              attached
              placeholder="Select field"
              className="icon"
              icon="search"
              fluid
              search
              selection
              options={searchOptions}
              onChange={this.onfieldBookSelection}
              style={{ margin: "10px 0px 10px 0px" }}
            />
            <Button
              onClick={() => this.onSubmitForm()}
              attached="left"
              color="teal"
              icon
              labelPosition="left"
            >
              <Icon name="search" />
              Generate Report
            </Button>
          </Card.Header>
        </Card.Content>
        <Card.Content>
          <Header as="h2" icon textAlign="center">
            <Icon name="users" circular />
            <Header.Content>Report</Header.Content>
          </Header>
          <Feed>
            <Feed.Event>
              <Feed.Content>
                <Table fluid basic celled sortable striped padded>
                  <Table.Header>
                    <Table.Row>
                      <Table.HeaderCell>{this.state.field}</Table.HeaderCell>
                      <Table.HeaderCell sorted="descending">
                        Revenue
                      </Table.HeaderCell>
                    </Table.Row>
                  </Table.Header>

                  <Table.Body>
                    {this.props.dataStore.getSalesArray.map((value) => (
                      <Table.Row>
                        <Table.Cell>
                          {value?.genre ||
                            value?.author ||
                            value?.publisher ||
                            value?.expense}
                        </Table.Cell>
                        <Table.Cell>
                          {value?.sales_by_author ||
                            value?.sales_by_genre ||
                            value?.sales_by_publisher ||
                            value?.sales ||
                            0}
                        </Table.Cell>
                      </Table.Row>
                    ))}
                  </Table.Body>
                </Table>
              </Feed.Content>
            </Feed.Event>
          </Feed>
        </Card.Content>
      </Card>
    );
  }
}
