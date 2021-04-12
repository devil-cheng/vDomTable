import TableCell from "./tableCell";
import { Table } from "antd";
export default class VirtualTable extends React.Component {
  static itemH = 30;
  constructor(props) {
    super(props);
    // 可视区域dom结构
    this.virtualList = React.createRef();
    this.virtualHeader = React.createRef();
    this.virtualFooter = React.createRef();
    this.leftVirtualList = React.createRef();
    // 计算总高度
    console.warn(props);
    const { columns, dataSource, height } = props;
    const totalH = dataSource.length * VirtualTable.itemH + "px";
    this.state = {
      dataSource,
      columns,
      data: [], // 可视区域数据
      index: 0, // 可视区域最初索引
      totalHeight: totalH, // 长列表总高度 列表中每一项数据高度总和
      transform: "",
      scrollLeft: 0,
    };
  }

  componentDidMount() {
    this.updateViewContent();
  }

  handleScroll = (e) => {
    /*
     * 获取scrollTop
     * 此属性可以获取或者设置对象的最顶部到对象在当前窗口显示的范围内的顶边的距离
     * 也就是元素滚动条被向下拉动的距离
     * */
    console.log(e.target.scrollLeft);
    const headerBox = this.virtualHeader.current.querySelector(
      ".ant-table-body"
    );
    const footerBox = this.virtualFooter.current;
    const leftVirtualBox = this.leftVirtualList?.current;
    if (leftVirtualBox) {
      leftVirtualBox.scrollTop = e.target.scrollTop;
    }
    headerBox.scrollLeft = e.target.scrollLeft;
    footerBox.scrollLeft = e.target.scrollLeft;
    this.updateViewContent(e.target.scrollTop, e.target.scrollLeft);
  };

  leftHandleScroll = (e) => {
    /*
     * 获取scrollTop
     * 此属性可以获取或者设置对象的最顶部到对象在当前窗口显示的范围内的顶边的距离
     * 也就是元素滚动条被向下拉动的距离
     * */

    const virtualBox = this.virtualList?.current;
    if (virtualBox) {
      virtualBox.scrollTop = e.target.scrollTop;
    }
    this.updateViewContent(e.target.scrollTop);
  };

  updateViewContent = (scrollTop = 0, scrollLeft = 0) => {
    // 计算可视区域里能放几个元素
    const viewCount = Math.ceil(
      this.virtualList.current.clientHeight / VirtualTable.itemH
    );
    // 计算可视区域开始的索引
    const start = Math.floor(scrollTop / VirtualTable.itemH);
    // 计算可视区域结束索引
    const end = start + viewCount;
    // 截取可视区域数据
    const viewData = this.state.dataSource.slice(start, end);

    this.setState({
      data: viewData,
      index: start,
      scrollLeft,
      // 把可见区域的 top 设置为起始元素在整个列表中的位置
      transform: `translate3d(0, ${start * VirtualTable.itemH}px, 0)`,
    });
  };

  render() {
    const { totalHeight, transform, data, columns, index } = this.state;
    console.log(data);
    console.log(index);

    const initColumns = (data) => {
      return data.map((item) => {
        if (item.children) {
          item.children = initColumns(item.children);
        }
        item.width = item.width ? item.width : 150;
        return item;
      });
    };

    const newColumns = initColumns(columns);

    // const leftFixedColumns = newColumns.filter((item) => item.fixed);
    // const leftNoFixedColumns = leftFixedColumns.slice().map((item) => {
    //   item.fixed = false;
    //   return item;
    // });
    // const containerFixedColumns = newColumns.filter((item) => !item.fixed);

    // console.log(leftFixedColumns);
    console.log(newColumns);
    const footerData = data.slice(0, 1);

    return (
      <div className="virtual-body">
        {/* <div className="virtual-side">
          <div className="virtual-header" style={{ height: "56px" }}>
            <Table
              columns={leftFixedColumns}
              pagination={false}
              dataSource={[{}]}
              scroll={{ x: "max-content" }}
            />
          </div>
          <div
            className="virtual-list"
            // onScroll={this.leftHandleScroll}
            ref={this.leftVirtualList}
          >
            <div
              className="virtual-list-height"
              style={{ height: totalHeight }}
            />
            <div className="view-content" style={{ transform: transform }}>
              {data.map((item) => (
                <div className="view-item">
                  <TableCell
                    data={item}
                    columns={leftFixedColumns}
                    key={"left" + item.id}
                  />
                </div>
              ))}
            </div>
          </div>
          <div className="virtual-footer" style={{ height: "56px" }}>
            <Table
              columns={leftFixedColumns}
              pagination={false}
              dataSource={[{}]}
              scroll={{ x: "max-content" }}
            />
          </div>
        </div> */}
        <div className="virtual-main">
          <div className="virtual-header" ref={this.virtualHeader}>
            <Table
              columns={newColumns}
              pagination={false}
              dataSource={[{}]}
              scroll={{ x: "max-content" }}
            />
          </div>
          <div
            className="virtual-list"
            onScroll={this.handleScroll}
            ref={this.virtualList}
          >
            <div
              className="virtual-list-height"
              style={{ height: totalHeight }}
            />
            <div className="view-content" style={{ transform: transform }}>
              {data.map((item) => (
                <div className="view-item">
                  <TableCell data={item} columns={newColumns} key={item.id} />
                </div>
              ))}
            </div>
          </div>
          <div className="virtual-footer" ref={this.virtualFooter}>
            <div>
              {footerData.map((item) => (
                <div className="view-item">
                  <TableCell data={item} columns={newColumns} key={item.id} />
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* <div className="virtual-side-right"></div> */}
      </div>
    );
  }
}
