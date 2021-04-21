import React, { Component } from "react";
import VirtualTable from "../components/VirtualTable/index";
import "../assets/index.css";

import data from "../components/data";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <div className="app-container">
        <VirtualTable
          dataSource={data.salaryList}
          columns={data.headList}
          height={700}
        />
      </div>
    );
  }
}

export default App;
