import * as React from "react";
import "./App.css";

import "semantic-ui-css/semantic.min.css";
import LandingPageComponent from "./Main/LandingPageComponent";
import DataStore from "./Main/DataStore";
import { Provider } from "mobx-react";

export default class App extends React.Component<{}, {}> {
  private dataStore: DataStore;

  constructor(props) {
    super(props);
    this.dataStore = new DataStore();
  }

  componentDidMount() {
    this.dataStore.init();
  }

  render() {
    return (
      <div className="App">
        <Provider DataStore={this.dataStore}>
          <LandingPageComponent dataStore={this.dataStore} />
        </Provider>
      </div>
    );
  }
}
