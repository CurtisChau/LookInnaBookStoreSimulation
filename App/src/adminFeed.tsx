import { observer } from "mobx-react";
import React from "react";
import { ReactNode } from "react";
import { Card, Feed, Message } from "semantic-ui-react";
import DataStore from "./Main/DataStore";
import "semantic-ui-css/semantic.min.css";

@observer
export class AdminFeed extends React.Component<{ dataStore: DataStore }> {
  render(): ReactNode {
    return (
      <Card>
        <Card.Content>
          <Card.Header>Recent Activity</Card.Header>
        </Card.Content>
        <Card.Content>
          <Feed>
            {this.props.dataStore.getAdminLogs.map((logs) => (
              <Feed.Event>
                <Feed.Label icon="users" />
                <Feed.Content>
                  <Feed.Date content={logs.timeStamp} />
                  <Feed.Summary>
                    {!logs?.paid ? (
                      <Message compact>
                        {" "}
                        Sent publisher with {logs.email} to restock an amount of{" "}
                        {logs?.amount}
                      </Message>
                    ) : (
                      <Message compact>
                        {" "}
                        Paid publisher with {logs.email} an amount of{" "}
                        {logs?.paid}
                      </Message>
                    )}
                  </Feed.Summary>
                </Feed.Content>
              </Feed.Event>
            ))}
          </Feed>
        </Card.Content>
      </Card>
    );
  }
}
