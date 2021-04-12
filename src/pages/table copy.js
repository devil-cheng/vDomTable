import React, { useState, useEffect } from "react";
import style from "./table.less";
import classnames from "classnames";
import { useMount } from "react-use";

import data from "../components/data";

const CustomTable = (props) => {
  const { height = 500, rowHeight = 30, dataSource = data.salaryList } = props;

  const [totalH, setTotalH] = React.useState(0);
  const [transform, setTransform] = React.useState("");

  const [dataList, setDataList] = useState([]);
  const [columns, setColumns] = useState([]);
  const [leftColumns, setLeftColumns] = useState([]);
  //   const [rightColumns, setRightColumns] = React.useState([]);

  useEffect(() => {
    setTotalH(rowHeight * dataSource.length);
  }, [rowHeight, dataSource]);

  const virtualList = React.createRef();
  const virtualHeader = React.createRef();
  const virtualFooter = React.createRef();
  const leftVirtualList = React.createRef();

  const handleScroll = (e) => {
    const headerBox = virtualHeader.current;
    const footerBox = virtualFooter.current;
    const leftVirtualBox = leftVirtualList?.current;
    if (leftVirtualBox) {
      leftVirtualBox.scrollTop = e.target.scrollTop;
    }
    if (headerBox) {
      headerBox.scrollLeft = e.target.scrollLeft;
    }
    if (footerBox) {
      footerBox.scrollLeft = e.target.scrollLeft;
    }
    updateViewContent(e.target.scrollTop);
  };

  const updateViewContent = (scrollTop = 0) => {
    // 计算可视区域里能放几个元素
    const viewCount =
      Math.ceil(virtualList.current.clientHeight / rowHeight) + 4;
    // 计算可视区域开始的索引
    const initStart = Math.floor(scrollTop / rowHeight);
    const start = initStart > 2 ? initStart - 2 : 0;
    // 计算可视区域结束索引
    const end = start + viewCount;
    // 截取可视区域数据
    const viewData = dataSource.slice(start, end);

    setDataList(viewData);
    setTransform(`translate3d(0, ${start * rowHeight}px, 0)`);
  };

  useEffect(() => {
    setColumns(data.headList);
    setLeftColumns(data.headList.filter((item) => item.fixed));
  }, []);

  useEffect(() => {
    updateViewContent();
  }, [rowHeight, columns, dataSource]);

  const itemStyle = {
    height: rowHeight,
    lineHeight: `${rowHeight}px`,
  };

  useMount(() => {
    const headerTableBody = virtualHeader.current;

    const mainTableBody = virtualList.current;

    const footerTableBody = virtualFooter.current;

    if (headerTableBody && mainTableBody) {
      const headerScrollFn = () => {
        if (headerTableBody.scrollLeft !== mainTableBody.scrollLeft) {
          mainTableBody.scrollLeft = headerTableBody.scrollLeft;
          // footerTableBody.scrollLeft = headerTableBody.scrollLeft;
        }
      };

      const mainScrollFn = () => {
        if (headerTableBody.scrollLeft !== mainTableBody.scrollLeft) {
          headerTableBody.scrollLeft = mainTableBody.scrollLeft;
          // footerTableBody.scrollLeft = mainTableBody.scrollLeft;
        }
      };

      headerTableBody.addEventListener("scroll", headerScrollFn);
      mainTableBody.addEventListener("scroll", mainScrollFn);

      return () => {
        headerTableBody.removeEventListener("scroll", headerScrollFn);
        mainTableBody.removeEventListener("scroll", mainScrollFn);
      };
    }
    return null;
  });

  const columnsChild = columns.filter((item) => item.children);

  const rowSpan = columnsChild.length > 0 ? 2 : 1;

  const HeaderCell = ({ childColumns }) => {
    return childColumns.map((item) => (
      <th key={item.dataIndex}>
        <div style={{ width: item.width || 120 }}>{item.title}</div>
      </th>
    ));
  };

  return (
    <div className={style.tableContainer}>
      <div className={classnames(style.tableFixed, style.leftSide)}>
        <div className={style.table}>
          <div className={style.tableHeader}>
            <table border="1">
              <tbody>
                <tr style={{ height: 60 }}>
                  {leftColumns.map((item) => (
                    <th
                      rowSpan={item.children ? 1 : rowSpan}
                      key={item.dataIndex}
                    >
                      <div style={{ width: item.width || 120 }}>
                        {item.title}
                      </div>
                    </th>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
          <div
            className={style.tableBody}
            ref={leftVirtualList}
            onScroll={handleScroll}
          >
            <div
              className={style.virtualListHeight}
              style={{ height: `${totalH}px` }}
            />
            <table style={{ transform }}>
              <tbody>
                {dataList.map((item) => (
                  <tr key={item.id}>
                    {leftColumns.map((it) => {
                      return it.children ? null : (
                        <td>
                          <div
                            style={{
                              width: it.children ? null : it.width || 120,
                            }}
                          >
                            {item[it.dataIndex]}
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className={style.tableFooter}>尾巴</div>
        </div>
      </div>
      <div className={style.table}>
        <div className={style.tableHeader} ref={virtualHeader}>
          <table border="1">
            <tbody>
              <tr>
                {columns.map((item) => (
                  <th
                    colSpan={item.children ? item.children.length : null}
                    rowSpan={item.children ? 1 : rowSpan}
                    key={item.dataIndex}
                  >
                    <div
                      style={{
                        width: item.children ? null : item.width || 120,
                      }}
                    >
                      {item.title}
                    </div>
                  </th>
                ))}
              </tr>
              <tr>
                {columns.map((item) => {
                  return item.children ? (
                    <HeaderCell childColumns={item.children} />
                  ) : null;
                })}
              </tr>
            </tbody>
          </table>
        </div>
        <div
          className={style.tableBody}
          onScroll={handleScroll}
          ref={virtualList}
        >
          <div
            className={style.virtualListHeight}
            style={{ height: `${totalH}px` }}
          />
          <table style={{ transform }}>
            <tbody>
              {dataList.map((item) => (
                <tr key={item.id}>
                  {columns.map((it) => {
                    return it.children ? null : (
                      <td>
                        <div
                          style={{
                            width: it.children ? null : it.width || 120,
                          }}
                        >
                          {item[it.dataIndex]}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className={style.tableFooter}>尾巴</div>
      </div>
      {/* <div className={classnames(style.tableFixed, style.rightSide)}>
        <div className={style.table}>
          <div className={style.tableHeader}>头</div>
          <div className={style.tableBody}>身体</div>
          <div className={style.tableFooter}>尾巴</div>
        </div>
      </div> */}
    </div>
  );
};
export default CustomTable;
