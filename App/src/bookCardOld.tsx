import * as React from "react";
import {
  Transition,
  Modal,
  Card,
  Header,
  Grid,
  Segment,
  Flag,
  Button,
  Icon,
  Label,
  Divider,
  Container,
} from "semantic-ui-react";
import "semantic-ui-css/semantic.min.css";

import { collection } from "./collectionModel";
import { observer } from "mobx-react";
import ToDoStore from "./Main/DataStore";

@observer
export class DefaultBookCard extends React.Component<{
  collection: collection[];
  dataStore: ToDoStore;

  //collection then array
}> {
  render() {
    return (
      <Card.Group centered itemsPerRow={6}>
        {this.props.collection.map((data, index) => (
          <Container fluid>
            <div>
              {data.collectionName}
              {data.id}
              <Divider horizontal>
                {data.books.map((books, index) => (
                  <Modal
                    trigger={
                      <Card
                        style={{
                          boxShadow:
                            "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
                        }}
                      >
                        <Card.Content>
                          <Card.Header>{books.name}</Card.Header>
                          <Card.Description style={{ color: "black" }}>
                            {books.author}
                          </Card.Description>
                        </Card.Content>
                      </Card>
                    }
                    size="small"
                  >
                    <Header icon="address card" />

                    <Modal.Content>
                      <Grid columns={2} divided>
                        <Grid.Row stretched>
                          <Grid.Column>TEXT</Grid.Column>
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
                        onClick={() =>
                          this.props.dataStore.addToCheckOut(books)
                        }
                      >
                        <Icon name="add to cart" />
                      </Button>
                      <Label color="teal" tag>
                        {data.collectionName}
                      </Label>
                    </Modal.Actions>
                  </Modal>
                ))}
              </Divider>
            </div>
          </Container>
        ))}
      </Card.Group>
    );
  }
}
