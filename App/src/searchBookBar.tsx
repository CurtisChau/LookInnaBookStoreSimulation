import { observer } from "mobx-react";
import React from "react";
import { ReactNode } from "react";
import {
  Icon,
  Card,
  Button,
  Message,
  Dropdown,
  Input,
} from "semantic-ui-react";
import DataStore from "./Main/DataStore";
import "semantic-ui-css/semantic.min.css";
import { BookOnlyCard } from "./bookOnly";

@observer
export class SearchBookBar extends React.Component<
  { dataStore: DataStore },
  {
    addValues: String[];
    field: string;
    search: string;
    submitted: boolean;
    selectionModal: boolean;
  }
> {
  constructor(props) {
    super(props);
    this.state = {
      addValues: [],
      field: "",
      search: "",
      submitted: false,
      selectionModal: false,
    };

    this.onSubmitForm = this.onSubmitForm.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
    this.onAddBookSelection = this.onAddBookSelection.bind(this);
    this.addBookFromCollection = this.addBookFromCollection.bind(this);
    this.onfieldBookSelection = this.onfieldBookSelection.bind(this);
  }

  onSearchChange(event: React.ChangeEvent<HTMLInputElement>) {
    console.log(event.target.value);
    this.setState({ search: event.target.value });
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
      console.log(this.state.field, this.state.search);
      await this.props.dataStore.searchBooks(
        this.state.field,
        this.state.search
      );
      this.setState({ submitted: true });
    } catch (err) {
      console.log(err);
    }
  }

  render(): ReactNode {
    const searchOptions: any[] = [
      { key: "genre", text: "genre", value: "genre" },
      { key: "author", text: "author", value: "author" },
      { key: "name", text: "name", value: "name" },
      { key: "ISBN", text: "ISBN", value: "id" },
      { key: "pages", text: "pages", value: "pages" },
      { key: "price", text: "price", value: "price" },
    ];
    return (
      <Card color="blue" fluid>
        <Card.Content>
          <Card.Header>
            <Input
              onChange={this.onSearchChange}
              icon="search"
              placeholder="Search..."
            />
            <Dropdown
              attached
              placeholder="Select field"
              className="icon"
              icon="search"
              search
              selection
              options={searchOptions}
              onChange={this.onfieldBookSelection}
              style={{ margin: "10px 5px 10px 5px" }}
            />
          </Card.Header>
          <Button
            onClick={() => this.onSubmitForm()}
            attached="left"
            color="teal"
            icon
            labelPosition="left"
          >
            <Icon name="search" />
            Search
          </Button>
        </Card.Content>

        <Card.Content>
          {this.props.dataStore.getSearchArray.length > 0 ? (
            <>
              <Message positive>Search Success</Message>
              <BookOnlyCard dataStore={this.props.dataStore} search={true} />
            </>
          ) : (
            this.state.submitted && (
              <Message negative>
                Search Failed, no item matches criteria
              </Message>
            )
          )}
        </Card.Content>
      </Card>
    );
  }
}
