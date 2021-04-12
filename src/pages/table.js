import React, { useState, useEffect } from "react";
import style from "./table.less";
import classnames from "classnames";
import { useMount } from "react-use";

import data from "../components/data";
import TableCell from "../components/TableCell/index";

const CustomTable = (props) => {
  const { height = 500, rowHeight = 30, dataSource = data.salaryList } = props;

  const [totalH, setTotalH] = React.useState(0);
  const [transform, setTransform] = React.useState("");

  const [dataList, setDataList] = useState([]);
  const [columns, setColumns] = useState([]);
  const [leftColumns, setLeftColumns] = useState([]);

  useEffect(() => {
    setTotalH(rowHeight * dataSource.length);
  }, [rowHeight, dataSource]);

  const virtualList = React.createRef();
  const virtualHeader = React.createRef();
  const virtualFooter = React.createRef();
  const leftVirtualList = React.createRef();

  useEffect(() => {
    setColumns(data.headList);
    setLeftColumns(data.headList.filter((item) => item.fixed));
  }, []);

  const itemStyle = {
    height: rowHeight,
    lineHeight: `${rowHeight}px`,
  };

  // 核心
  useMount(() => {
    const headerTableBody = virtualHeader.current;
    const mainTableBody = virtualList.current;
    const leftTableBody = leftVirtualList.current;

    const headerScrollFn = () => {
      if (headerTableBody.scrollLeft !== mainTableBody.scrollLeft) {
        mainTableBody.scrollLeft = headerTableBody.scrollLeft;
      }
    };

    const updateViewContentFn = () => {
      const clientHeight = mainTableBody.clientHeight;
      return function (scrollTop = 0) {
        // 计算可视区域里能放几个元素
        const viewCount = Math.ceil(clientHeight / rowHeight);
        // 计算可视区域开始的索引
        const initStart = Math.floor(scrollTop / rowHeight);
        const start = initStart > viewCount ? initStart - viewCount : 0;
        // 计算可视区域结束索引
        const end = start + viewCount * 3;
        // 截取可视区域数据
        const viewData = dataSource.slice(start, end);

        setDataList(viewData);
        setTransform(start * rowHeight);
      };
    };

    const updateViewContent = updateViewContentFn();

    const leftHandleScroll = (e) => {
      mainTableBody.scrollTop = e.target.scrollTop;
      updateViewContent(e.target.scrollTop);
    };

    const handleScroll = (e) => {
      if (
        headerTableBody &&
        headerTableBody.scrollLeft !== e.target.scrollLeft
      ) {
        headerTableBody.scrollLeft = e.target.scrollLeft;
      }
      if (leftTableBody && leftTableBody.scrollTop !== e.target.scrollTop) {
        updateViewContent(e.target.scrollTop);
        leftTableBody.scrollTop = e.target.scrollTop;
      }
    };

    // 头部scroll监听
    const headerMouseFn = () => {
      mainTableBody.removeEventListener("scroll", handleScroll);
      leftTableBody.removeEventListener("scroll", leftHandleScroll);
      headerTableBody.addEventListener("scroll", headerScrollFn);
    };

    // 主体scroll监听
    const mainMouseFn = () => {
      headerTableBody.removeEventListener("scroll", headerScrollFn);
      leftTableBody.removeEventListener("scroll", leftHandleScroll);
      mainTableBody.addEventListener("scroll", handleScroll);
    };

    // 左侧fixed scroll监听
    const leftMouseFn = () => {
      headerTableBody.removeEventListener("scroll", headerScrollFn);
      mainTableBody.removeEventListener("scroll", handleScroll);
      leftTableBody.addEventListener("scroll", leftHandleScroll);
    };

    headerTableBody.addEventListener("mouseover", headerMouseFn);
    mainTableBody.addEventListener("mouseover", mainMouseFn);
    leftTableBody.addEventListener("mouseover", leftMouseFn);

    updateViewContent(0);

    return () => {
      headerTableBody.removeEventListener("mouseover", headerMouseFn);
      mainTableBody.removeEventListener("mouseover", mainMouseFn);
      leftTableBody.removeEventListener("mouseover", leftMouseFn);
    };
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
          <div className={style.tableBody} ref={leftVirtualList}>
            <div
              className={style.virtualListHeight}
              style={{ height: `${totalH}px` }}
            />
            <div className={style.viewContent}>
              {dataList.map((item, index) => (
                <div className={style.viewItem} style={{ position: 'absolute', top: 0, transform: `translate3d(0, ${transform + index * rowHeight}px, 0)` }}>
                  <TableCell data={item} columns={leftColumns} key={item.id} />
                </div>
              ))}
            </div>
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
        <div className={style.tableBody} ref={virtualList}>
          <div
            className={style.virtualListHeight}
            style={{ height: `${totalH}px` }}
          />
          <div className={style.viewContent}>
            {dataList.map((item, index) => (
              <div className={style.viewItem} style={{ position: 'absolute', top: 0, transform: `translate3d(0, ${transform + index * rowHeight}px, 0)` }}>
                <TableCell data={item} columns={columns} key={item.id} />
              </div>
            ))}
          </div>
        </div>
        <div className={style.tableFooter}>尾巴</div>
      </div>
    </div>
  );
};
export default CustomTable;
