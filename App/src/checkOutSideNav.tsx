import { observer } from "mobx-react";
import React from "react";
import "semantic-ui-css/semantic.min.css";
import {
  Feed,
  Card,
  Button,
  Modal,
  Form,
  Checkbox,
  Icon,
} from "semantic-ui-react";
import DataStore from "./Main/DataStore";

@observer
export class CheckoutSideNav extends React.Component<
  { dataStore: DataStore },
  { visible: boolean; billing: String; shipping: String; same: boolean }
> {
  constructor(props) {
    super(props);
    this.state = { visible: false, billing: "", shipping: "", same: false };
    this.onShippingChange = this.onShippingChange.bind(this);
    this.onSubmitForm = this.onSubmitForm.bind(this);
    this.onBillingChange = this.onBillingChange.bind(this);
  }

  setOpen() {
    this.setState({ visible: true });
  }
  setClose() {
    this.setState({ visible: false });
  }

  setSame(value: boolean) {
    console.log(value);
    this.setState({ same: value });
  }

  onShippingChange(event: React.ChangeEvent<HTMLInputElement>) {
    console.log(event.target.value);
    this.setState({ shipping: event.target.value });
  }

  onBillingChange(event: React.ChangeEvent<HTMLInputElement>) {
    console.log(event.target.value);
    this.setState({ billing: event.target.value });
  }

  async onSubmitForm() {
    await this.props.dataStore.sendCheckoutArray(
      this.state.billing,
      this.state.billing,
      this.state.same
    );

    this.setClose();
  }

  render() {
    return (
      <Card>
        <Card.Content>
          <Card.Header>Shopping Cart </Card.Header>

          <Modal
            onClose={() => this.setClose()}
            onOpen={() => this.setOpen()}
            open={this.state.visible}
            trigger={
              this.props.dataStore.getCheckoutArray.length && (
                <Button>
                  {" "}
                  <Icon color="blue" name="shopping cart" />
                </Button>
              )
            }
          >
            <Modal.Header>
              Checkout
              <Icon name="shopping cart" />
            </Modal.Header>
            <Modal.Content image>
              <Form>
                <Form.Field>
                  <label>Shipping</label>
                  <input
                    placeholder={
                      (this.props.dataStore.getLoggedInUser
                        ?.address as string) || "Shipping"
                    }
                    onChange={this.onShippingChange}
                  />
                </Form.Field>
                <Form.Field>
                  <label>Billing</label>
                  <input
                    placeholder={
                      (this.props.dataStore.getLoggedInUser
                        ?.billing as string) || "billing"
                    }
                    onChange={this.onBillingChange}
                  />
                </Form.Field>
                <Form.Field>
                  <Checkbox
                    onClick={() => this.setSame(true)}
                    label="My shipping and billing address is the same"
                  />
                </Form.Field>
              </Form>
            </Modal.Content>
            <Modal.Actions>
              <Button negative onClick={() => this.setClose()}>
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
        </Card.Content>
        <Card.Content>
          <Feed>
            {this.props.dataStore.checkoutArray.map((books, index) => (
              <Feed.Event>
                <Feed.Label icon="book" />
                <Feed.Content>
                  <Feed.Date content={books.name} />
                  <Feed.Summary>
                    You added <a>{books.name}</a> to your <a>shopping</a> cart.
                  </Feed.Summary>
                  <Button
                    negative
                    size="small"
                    icon="remove circle"
                    onClick={() =>
                      this.props.dataStore.removeFromArray(books.id, index)
                    }
                  ></Button>
                </Feed.Content>
              </Feed.Event>
            ))}
          </Feed>
        </Card.Content>
      </Card>
    );
  }
}
