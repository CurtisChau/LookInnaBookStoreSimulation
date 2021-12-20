import * as React from "react";
import { Icon, Popup, Table } from "semantic-ui-react";
import "semantic-ui-css/semantic.min.css";

import { observer } from "mobx-react";
import DataStore from "./Main/DataStore";
import { publisher } from "./publisher";
import { Button } from "reactstrap";
import { action } from "mobx";

@observer
export class PublisherTable extends React.Component<{
  dataStore: DataStore;

  //collection then array
}> {
  constructor(props) {
    super(props);
    this.payPublisher = this.payPublisher.bind(this);
  }

  @action.bound
  async payPublisher(publisher: String) {
    try {
      console.log(`Time to pay ${publisher}`);
      await this.props.dataStore.payPublisher(publisher);
    } catch (err) {}
  }

  render() {
    return (
      <Table celled inverted>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>
              <Icon name="user circle" />
              Name
            </Table.HeaderCell>
            <Table.HeaderCell>
              <Icon name="building" />
              Account
            </Table.HeaderCell>
            <Table.HeaderCell>
              <Icon name="mail" />
              Email
            </Table.HeaderCell>
            <Table.HeaderCell>
              <Icon name="money" />
            </Table.HeaderCell>
            <Table.HeaderCell>
              <Icon name="percent" />
              Percentage
            </Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {this.props.dataStore.getPublisherArray.map(
            (publisher: publisher) => (
              <Table.Row>
                <Table.Cell>{publisher.name}</Table.Cell>
                <Table.Cell>{publisher.account}</Table.Cell>
                <Table.Cell textAlign="right">{publisher.email}</Table.Cell>

                <Popup
                  hoverable
                  trigger={<Table.Cell>{publisher.money}</Table.Cell>}
                >
                  <Button
                    onClick={() => this.payPublisher(publisher.name)}
                    labelPosition="right"
                  >
                    <Icon name="payment" />
                    Pay Publisher
                  </Button>
                </Popup>

                <Table.Cell>{publisher.percentage}</Table.Cell>
              </Table.Row>
            )
          )}
        </Table.Body>
      </Table>
    );
  }
}
