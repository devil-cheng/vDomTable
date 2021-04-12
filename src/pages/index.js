import React, { Component } from "react";
import VirtualTable from "../components/VirtualTable/index";
import VirtualTables from "../components/VirtualTables";
import "../assets/index.css";

import data from "../components/data";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    console.log(data);
    return (
      <div className="app-container">
        <VirtualTable
          dataSource={data.salaryList}
          columns={data.headList}
          height={700}
        />
        {/* <VirtualTables
          columns={data.headList}
          dataSource={data.salaryList}
          scroll={{
            y: 700,
            x: "100vw",
          }}
        /> */}
      </div>
    );
  }
}

export default App;
