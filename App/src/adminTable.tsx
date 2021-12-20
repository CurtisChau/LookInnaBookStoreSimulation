import { observer } from "mobx-react";
import React from "react";
import { ReactNode } from "react";
import {
  Header,
  Divider,
  Icon,
  Card,
  Button,
  Message,
  Dropdown,
} from "semantic-ui-react";
import DataStore from "./Main/DataStore";
import "semantic-ui-css/semantic.min.css";

@observer
export class AdminTable extends React.Component<
  { dataStore: DataStore },
  {
    addValues: String[];
    name: string;
    password: string;
    submitted: boolean;
    selectionModal: boolean;
  }
> {
  constructor(props) {
    super(props);
    this.state = {
      addValues: [],
      name: "",
      password: "",
      submitted: false,
      selectionModal: false,
    };

    this.onNameChange = this.onNameChange.bind(this);
    this.onSubmitForm = this.onSubmitForm.bind(this);
    this.onPassChange = this.onPassChange.bind(this);
    this.onAddBookSelection = this.onAddBookSelection.bind(this);
    this.addBookFromCollection = this.addBookFromCollection.bind(this);
  }

  onNameChange(event: React.ChangeEvent<HTMLInputElement>) {
    console.log(event.target.value);
    this.setState({ name: event.target.value });
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

  onAddBookSelection(event: any, data: any) {
    console.log(data);
    this.setState({ addValues: data?.value });
  }

  selectionArray(): any[] {
    let selectionArray: any[] = [];
    this.props.dataStore.getAllBookArray.forEach((book) => {
      selectionArray.push({ key: book.id, text: book.name, value: book.id });
    });

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
    const options: any[] = [];
    return (
      <Card.Group>
        <Card fluid>
          <Card.Content>
            {this.props.dataStore.collectionMap.map((data, index) => (
              <>
                <Divider horizontal>
                  <Header as="h4">
                    <Icon name="tag" />
                    {data?.collectionName}
                  </Header>
                </Divider>
                <Card.Header key={data.id as string}>
                  <Button
                    onClick={() => {
                      this.addBookFromCollection(data.id, data.collectionName);
                    }}
                    color="teal"
                    floated="right"
                  >
                    Add Book
                  </Button>
                  <Card.Content extra>
                    <Dropdown
                      placeholder="Books"
                      multiple
                      selection
                      icon="add circle"
                      options={this.selectionArray()}
                      onChange={this.onAddBookSelection}
                      style={{ margin: "10px 0px 10px 0px" }}
                    />
                  </Card.Content>
                </Card.Header>

                <Card.Group itemsPerRow={3}>
                  {data.books.map((books) => (
                    <Card fluid key={books.id as string}>
                      <Card.Content>
                        <Card.Header>{books.name}</Card.Header>
                        <Card.Meta>{books.genre}</Card.Meta>
                        <Card.Description>
                          <Message>Author:{books.author}</Message>
                          <Message>Price:{books.price}</Message>
                        </Card.Description>
                      </Card.Content>
                      <Card.Content extra>
                        <a>
                          <Icon name="user" />
                          Admin Controls
                        </a>

                        <Button.Group floated="right">
                          <Button
                            onClick={() =>
                              this.onRemoveBookFromCollection(books.id, data.id)
                            }
                            negative
                            attached="right"
                            icon="remove circle"
                          ></Button>
                        </Button.Group>
                      </Card.Content>
                    </Card>
                  ))}
                </Card.Group>
              </>
            ))}
          </Card.Content>
        </Card>
      </Card.Group>
    );
  }
}
