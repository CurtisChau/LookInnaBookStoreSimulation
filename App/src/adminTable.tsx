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
  Checkbox,
  Form,
  Modal,
} from "semantic-ui-react";
import DataStore from "./Main/DataStore";
import "semantic-ui-css/semantic.min.css";

@observer
export class AdminTable extends React.Component<
  { dataStore: DataStore },
  {
    addValues: String[];
    name: string;
    id: string;
    price: number;
    pages: number;
    author: string;
    genre: string;
    stock: number;
    publisher: string;
    submitted: boolean;
    selectionModal: boolean;
  }
> {
  constructor(props) {
    super(props);
    this.state = {
      addValues: [],
      name: "",
      id: "",
      price: 0,
      pages: 0,
      author: "",
      genre: "",
      publisher: "",
      stock: 0,
      submitted: false,
      selectionModal: false,
    };

    this.onNameChange = this.onNameChange.bind(this);
    this.onSubmitForm = this.onSubmitForm.bind(this);
    this.onPassChange = this.onPassChange.bind(this);
    this.onAddBookSelection = this.onAddBookSelection.bind(this);
    this.addBookFromCollection = this.addBookFromCollection.bind(this);
    this.onPublisherSelection = this.onPublisherSelection.bind(this);
    this.onPriceChange = this.onPriceChange.bind(this);
    this.onPagesChange = this.onPagesChange.bind(this);
    this.onAuthorChange = this.onAuthorChange.bind(this);
    this.onGenreChange = this.onGenreChange.bind(this);
    this.onStockChange = this.onStockChange.bind(this);
  }

  onNameChange(event: React.ChangeEvent<HTMLInputElement>) {
    console.log(event.target.value);
    this.setState({ name: event.target.value });
  }

  onPassChange(event: React.ChangeEvent<HTMLInputElement>) {
    console.log(event.target.value);
    this.setState({ id: event.target.value });
  }

  onPriceChange(event: React.ChangeEvent<HTMLInputElement>) {
    console.log(event.target.value);
    this.setState({ price: Number(event.target.value) });
  }
  onPagesChange(event: React.ChangeEvent<HTMLInputElement>) {
    console.log(event.target.value);
    this.setState({ pages: Number(event.target.value) });
  }
  onAuthorChange(event: React.ChangeEvent<HTMLInputElement>) {
    console.log(event.target.value);
    this.setState({ author: event.target.value });
  }
  onGenreChange(event: React.ChangeEvent<HTMLInputElement>) {
    console.log(event.target.value);
    this.setState({ genre: event.target.value });
  }
  onStockChange(event: React.ChangeEvent<HTMLInputElement>) {
    console.log(event.target.value);
    this.setState({ stock: Number(event.target.value) });
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

  onPublisherSelection(event: any, data: any) {
    this.setState({ publisher: data?.value });
  }
  publisherArray(): any[] {
    let selectionArray: any[] = [];
    this.props.dataStore.getPublisherArray.forEach((publisher) => {
      selectionArray.push({
        key: publisher.name,
        text: publisher.name,
        value: publisher.name,
      });
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
      this.setOpen(false);
      await this.props.dataStore.addNewBookEntry(
        this.state.name,
        this.state.id,
        this.state.pages,
        this.state.price,
        this.state.author,
        this.state.genre,
        this.state.publisher,
        this.state.stock
      );
      this.setOpen(false);
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
                  <Modal
                    onClose={() => this.setOpen(false)}
                    onOpen={() => this.setOpen(true)}
                    open={this.state.selectionModal}
                    trigger={
                      <Button floated="right" icon="add" positive>
                        Add new book entry
                      </Button>
                    }
                  >
                    <Modal.Header>
                      Create a new book entry
                      <Icon name="book" />
                    </Modal.Header>
                    <Modal.Content image>
                      <Form>
                        <Form.Field>
                          <label>ISBN</label>
                          <input onChange={this.onPassChange} />
                        </Form.Field>
                        <Form.Field>
                          <label>name</label>
                          <input onChange={this.onNameChange} />
                        </Form.Field>
                        <Form.Field>
                          <label>
                            Author
                            <input onChange={this.onAuthorChange} />
                          </label>
                        </Form.Field>
                        <Form.Field>
                          <label>
                            Price
                            <input onChange={this.onPriceChange} />
                          </label>
                        </Form.Field>
                        <Form.Field>
                          <label>
                            Pages
                            <input onChange={this.onPagesChange} />
                          </label>
                        </Form.Field>
                        <Form.Field>
                          <label>
                            genre
                            <input onChange={this.onGenreChange} />
                          </label>
                        </Form.Field>
                        <Form.Field>
                          <label>
                            stock
                            <input onChange={this.onStockChange} />
                          </label>
                        </Form.Field>

                        <Dropdown
                          placeholder="publisher"
                          selection
                          icon="add circle"
                          options={this.publisherArray()}
                          onChange={this.onPublisherSelection}
                          style={{ margin: "10px 0px 10px 0px" }}
                        />
                      </Form>
                    </Modal.Content>
                    <Modal.Actions>
                      <Button negative onClick={() => this.setOpen(false)}>
                        Cancel
                      </Button>
                      <Button
                        content="Submit"
                        labelPosition="right"
                        icon="checkmark"
                        type="submit"
                        onClick={() => this.onSubmitForm()}
                        positive
                      />
                    </Modal.Actions>
                  </Modal>
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
