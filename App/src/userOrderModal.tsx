import { observer } from "mobx-react";
import React from "react";
import { ReactNode } from "react";
import "semantic-ui-css/semantic.min.css";
import { Icon, Button, Modal, Message } from "semantic-ui-react";
import { user } from "./Main/user";

@observer
export class UserOrderModal extends React.Component<
  { user: user },
  { orderModal: boolean }
> {
  constructor(props) {
    super(props);
    this.state = { orderModal: false };
  }

  setModal(value: boolean) {
    this.setState({ orderModal: value });
  }

  render(): ReactNode {
    return (
      <Modal
        open={this.state.orderModal}
        onClose={() => this.setModal(false)}
        onOpen={() => this.setModal(true)}
        trigger={<Button>Your Orders</Button>}
      >
        <Modal.Header>Orders</Modal.Header>
        <Modal.Content scrolling>
          <Message>
            {this.props.user.orders.map((data, index) => (
              <>
                <Message.Header>Order Id:{data.id}</Message.Header>
                <Message.List>
                  {data.orders.map((order) => (
                    <>
                      <Message.Item>Book Id:{order.book_id}</Message.Item>
                      <Message.Item>Order Amount:{order.amount}</Message.Item>
                      <Message.Item>
                        Third party shipping services: UPS
                      </Message.Item>
                    </>
                  ))}
                </Message.List>
              </>
            ))}
          </Message>
        </Modal.Content>
        <Modal.Actions>
          <Button negative onClick={() => this.setModal(false)}>
            Close <Icon name="chevron right" />
          </Button>
        </Modal.Actions>
      </Modal>
    );
  }
}
