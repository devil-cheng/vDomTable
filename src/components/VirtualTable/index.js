import React, { useState, useEffect, useMemo } from "react";
import { Table } from "antd";
import style from "./table.less";
import classnames from "classnames";
import { useMount } from "react-use";

import TableCell from "../TableCell";

export default VirtualTable = ({ columns = [], dataSource = [], height, rowHeight = 30 }) => {

  const [totalH, setTotalH] = React.useState(0);
  

  const [dataList, setDataList] = useState([]);
  const [columnsList, setColumnsList] = useState(columns);
  const [leftColumns, setLeftColumns] = useState([]);

  // 设置滚动区域高度
  useEffect(() => {
    setTotalH(rowHeight * dataSource.length);
  }, [rowHeight, dataSource]);

  //数据初始化
  const newDataSource = useMemo(function () {
    return dataSource.map((item, index) => {
      return {
        ...item,
        transform: index * rowHeight
      }
    })
  }, [dataSource])

  // 可视区域dom结构
  const virtualList = React.createRef();
  const virtualHeader = React.createRef();
  const leftVirtualList = React.createRef();

  // 头部columns
  useEffect(() => {
    setLeftColumns(columnsList.filter((item) => item.fixed));
  }, [columnsList]);

  // 表单行高样式
  const itemStyle = {
    height: rowHeight,
    lineHeight: `${rowHeight}px`,
  };

  // 核心
  useMount(() => {
    const headerTableBody = virtualHeader.current;
    const mainTableBody = virtualList.current;
    const leftTableBody = leftVirtualList.current;

    const updateViewContentFn = () => {
      const clientHeight = mainTableBody.clientHeight;
      // 计算可视区域里能放几个元素
      const viewCount = Math.ceil(clientHeight / rowHeight);

      const halfViewCount = Math.ceil(viewCount / 2);

      return function (scrollTop = 0) {
        // 计算可视区域开始的索引
        const initStart = Math.floor(scrollTop / rowHeight);
        const start = initStart > viewCount ? initStart - halfViewCount : 0;
        // 计算可视区域结束索引
        const end = start + viewCount * 2;
        // 截取可视区域数据
        const viewData = newDataSource.slice(start, end);

        setDataList(viewData);
      };
    };

    const updateViewContent = updateViewContentFn();

    const headerScrollFn = () => {
      if (headerTableBody.scrollLeft !== mainTableBody.scrollLeft) {
        mainTableBody.scrollLeft = headerTableBody.scrollLeft;
      }
    };

    const leftHandleScroll = (e) => {
      if (mainTableBody.scrollTop !== e.target.scrollTop) {
        mainTableBody.scrollTop = e.target.scrollTop;
        updateViewContent(e.target.scrollTop);
      }
    };

    const handleScroll = (e) => {
      if (
        headerTableBody &&
        headerTableBody.scrollLeft !== e.target.scrollLeft
      ) {
        headerTableBody.scrollLeft = e.target.scrollLeft;
      }
      if (leftTableBody && leftTableBody.scrollTop !== e.target.scrollTop) {
        leftTableBody.scrollTop = e.target.scrollTop;
        updateViewContent(e.target.scrollTop);
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
    mainTableBody.scrollTop = 0
    leftTableBody.scrollTop = 0
    updateViewContent(mainTableBody.scrollTop);

    return () => {
      headerTableBody.removeEventListener("mouseover", headerMouseFn);
      mainTableBody.removeEventListener("mouseover", mainMouseFn);
      leftTableBody.removeEventListener("mouseover", leftMouseFn);
    };
  });

  // 头部行数
  const rowSpan = useMemo(function () {
    const columnsChild = columnsList.filter((item) => item.children);
    return columnsChild.length > 0 ? 2 : 1;
  }, [columnsList])

  // 头部第二行Cell
  const HeaderCell = ({ childColumns }) => {
    return childColumns.map((item) => (
      <th key={item.dataIndex}>
        <div style={{ width: item.width || 120 }}>{item.title}</div>
      </th>
    ));
  };

  return (
    <div>1111</div>
  )
}
