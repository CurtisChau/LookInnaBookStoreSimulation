import { observer } from "mobx-react";
import React from "react";
import { ReactNode } from "react";
import {
  Segment,
  Header,
  Divider,
  Icon,
  Card,
  Button,
  Modal,
  Grid,
  Image,
} from "semantic-ui-react";
import DataStore from "./Main/DataStore";
import "semantic-ui-css/semantic.min.css";
import { book } from "./book";

@observer
export class BookOnlyCard extends React.Component<
  { dataStore: DataStore; search: boolean; collection?: book[] },
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

  //assign randomBookCoverImage to simulate bookstore
  randomBookCoverImage(): String {
    //4 avaliable
    const randomNum = Math.floor(Math.random() * 4);

    console.log(randomNum);
    const randomBookCoverPng: String[] = [
      "https://d2slcw3kip6qmk.cloudfront.net/marketing/press/images/template-gallery/wild-flower-book-cover.png",
      "https://www.templateupdates.com/wp-content/uploads/2019/02/Free-Vector-Motivational-Book-Cover-Template.jpg",
      "https://indesignskills.com/wp-content/uploads/2017/07/Paperback-Cover-Screenshot-1024x773.jpg",
      "http://www.dotxes.com/wp-content/uploads/edd/2016/03/Book-cover-template-for-Word.png",
    ];
    return randomBookCoverPng[randomNum];
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

  renderBookArray(): book[] {
    if (this.props.search) {
      return this.props.dataStore.getSearchArray;
    } else if (this.props?.collection) {
      //exist toss it to render
      return this.props.collection;
    } else {
      console.log("only book no search");
      return this.props.dataStore.getAllBookArray;
    }
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
    return (
      <Card.Group style={{ margin: "0px 0px 10px 0px" }}>
        {this.renderBookArray().map((books) => (
          <Modal
            trigger={
              <Card
                style={{
                  boxShadow:
                    "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
                }}
              >
                <Image src={this.randomBookCoverImage()} />
                <Card.Content>
                  <Card.Header>{books.name}</Card.Header>
                  <Card.Description style={{ color: "black" }}>
                    {books.author}
                  </Card.Description>
                </Card.Content>
              </Card>
            }
            size={this.props?.collection ? "large" : "small"}
          >
            <Header icon="address card" />

            <Modal.Content>
              <Grid columns={2} divided>
                <Grid.Row stretched>
                  <Grid.Column>
                    <Image src={this.randomBookCoverImage()} />
                  </Grid.Column>
                  <Grid.Column>
                    <Segment.Group>
                      <Header as="h3" content="Info" icon="clipboard" />
                      <Segment>
                        <Header as="h4">
                          <Divider horizontal />
                          <p>
                            <Icon name="pencil alternate" />
                            Author:{books.author}
                          </p>
                          <Divider horizontal />
                          <p>
                            <Icon name="file" />
                            Genre:
                            {books.genre}
                          </p>
                          <Divider horizontal />
                          <p>
                            <Icon name="book" />
                            Page:{books.pages}
                          </p>
                          <Divider horizontal />
                          <p>
                            <Icon name="dollar sign" />
                            Price:
                            {books.price}
                          </p>
                          <p>
                            <Icon name="box" />
                            Publisher:
                            {books.publisher}
                          </p>
                          <p>
                            <Icon name="warehouse" />
                            Stock:
                            {
                              this.props.dataStore.getInvetoryArray[
                                this.props.dataStore.getStock(books.id)
                              ]?.stock
                            }
                          </p>
                        </Header>
                      </Segment>
                    </Segment.Group>
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            </Modal.Content>

            <Modal.Actions>
              <Button
                disabled={
                  !this.props.dataStore.getLoggedIn ||
                  !(
                    this.props.dataStore.getInvetoryArray[
                      this.props.dataStore.getStock(books.id)
                    ]?.stock > 0
                  )
                }
                onClick={() => this.props.dataStore.addToCheckOut(books)}
              >
                <Icon name="add to cart" />
              </Button>
            </Modal.Actions>
          </Modal>
        ))}
      </Card.Group>
    );
  }
}
