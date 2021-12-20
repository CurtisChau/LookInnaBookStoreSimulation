import * as React from "react";
import { Card, Header, Icon, Divider } from "semantic-ui-react";
import "semantic-ui-css/semantic.min.css";

import { collection } from "./collectionModel";
import { observer } from "mobx-react";
import DataStore from "./Main/DataStore";
import { BookOnlyCard } from "./bookOnly";

@observer
export class BookCard extends React.Component<{
  collection: collection[];
  dataStore: DataStore;

  //collection then array
}> {
  render() {
    return (
      <Card.Group>
        <Card fluid style={{ margin: "0px 0px 20px 0px" }}>
          <Card.Content>
            {this.props.dataStore.collectionMap.map((data, index) => (
              <>
                <Divider horizontal style={{ margin: "20px 0px 20px 0px" }}>
                  <Header as="h4">
                    <Icon name="tag" />
                    {data?.collectionName}
                  </Header>
                </Divider>
                <Card.Header key={data.id as string}></Card.Header>

                <Card.Group itemsPerRow={6}>
                  <BookOnlyCard
                    dataStore={this.props.dataStore}
                    search={false}
                    collection={data.books}
                  />
                </Card.Group>
              </>
            ))}
          </Card.Content>
        </Card>
      </Card.Group>
    );
  }
}
