import React, { useState, useEffect, useMemo } from "react";
import { useMount } from "react-use";

import CustomHeader from "./CustomHeader";
import CustomTbody from "./CustomTbody";
import getScrollWidth from "./getScrollWidth";

import { paramTypeFn, convertToColumns } from './utils.js';

import style from "./index.less";

const sortDirections = ['ascend', 'descend']

const VirtualTable = ({ columns: defaultColumns = [], dataSource = [], height, rowHeight = 50 }) => {

  const [scrollBar] = useState(getScrollWidth())
  const [headerHeight, setHeaderHeight] = useState(0)
  const [columnLevel, setColumnLevel] = useState(1)
  const [boxShadow, setBoxShadow] = useState(null)
  const [sortKey, setSortKey] = useState(null)
  const [sortStatus, setSortStatus] = useState(null)
  const [sorterFun, setSorterFn] = useState(null)

  const defaultDataSource = dataSource.slice()

  const baseColumns = useMemo(() => {
    const { list, level } = convertToColumns(defaultColumns)
    setColumnLevel(level)
    return list
  }, [defaultColumns])

  const headerRef = React.createRef();
  const bodyRef = React.createRef();

  const basDataSource = useMemo(function () {
    console.log(sortKey, sortStatus)
    if (!sortKey || !sortStatus) {  
        return dataSource.slice()
    }
    if (sortStatus == sortDirections[0]) {
      return dataSource.slice().sort(sorterFun || ((a, b) => a[sortKey] - b[sortKey]))
    }

    return dataSource.slice().sort(sorterFun || ((a, b) => a[sortKey] - b[sortKey])).reverse()
  }, [dataSource, sortKey, sortStatus, sorterFun])

  console.log(basDataSource)

  //数据初始化
  const pageDataSource = useMemo(function () {
    return dataSource.map((item, index) => {
      return {
        ...item,
        transform: index * rowHeight
      }
    })
  }, [basDataSource])

  const sortInfo = (columns) => {
    console.log(sortKey, sortStatus, columns)
    const { dataIndex, sorter } = columns
    const sort = paramTypeFn(sorter);
    if (dataIndex !== sortKey) {
      setSortKey(dataIndex)
      setSortStatus(sortDirections[0])
      setSorterFn(sort === 'Function' ? sorter : null)
    } else if(dataIndex === sortKey && sortStatus === sortDirections[0]) {
      setSortStatus(sortDirections[1])
    } else {
      setSortKey(null)
      setSortStatus(null)
      setSorterFn(null)
    }
  }

  const columns = useMemo(() => {
    const columnsInitFn = data => {
      return data && data.map(item => {
        const { children, level, sortable } = item
        return {
            ...item,
            sort: sortable ? true : null,
            sortFn: sortable ? (val) => sortInfo(val) : null,
            sortType: null,
            height: rowHeight,
            width: item.width || 150,
            colSpan: children && children.length || 1,
            rowSpan: children && children.length > 0 ? 1 : columnLevel + 1 - level,
            children: columnsInitFn(children)
          }
        })
    }

    return columnsInitFn(baseColumns)
    
  }, [baseColumns, rowHeight, columnLevel, sortKey, sortStatus])

  console.log(columns)

  useMount(() => {
    const headerNode = headerRef.current;
    const bodyNode = bodyRef.current;

    headerNode.scrollLeft = 0
    bodyNode.scrollLeft = 0

    const headerScrollFn = (e) => {
      if(headerNode.scrollLeft !== 0) {
        setBoxShadow(true)
      } else {
        setBoxShadow(false)
      }
      if (headerNode.scrollLeft !== bodyNode.scrollLeft) {
        bodyNode.scrollLeft = headerNode.scrollLeft;
      }
    };

    const bodyScrollFn = (e) => {
      if(bodyNode.scrollLeft !== 0) {
        setBoxShadow(true)
      } else {
        setBoxShadow(false)
      }
      if (headerNode.scrollLeft !== bodyNode.scrollLeft) {
        headerNode.scrollLeft = bodyNode.scrollLeft;
      }
    };

    // 头部scroll监听
    const headerMouseFn = () => {
      bodyNode.removeEventListener("scroll", headerScrollFn);
      headerNode.addEventListener("scroll", headerScrollFn);
    };

    const bodyMouseFn = () => {
      headerNode.removeEventListener("scroll", headerScrollFn);
      bodyNode.addEventListener("scroll", bodyScrollFn);
    };


    if (headerNode) {
      setHeaderHeight(headerNode.clientHeight)
      
      headerNode.addEventListener("mouseover", headerMouseFn);
      bodyNode.addEventListener("mouseover", bodyMouseFn);
    }

    return () => {
      headerNode.removeEventListener("mouseover", headerMouseFn);
      bodyNode.removeEventListener("mouseover", bodyMouseFn);
    };
    
  })

  const containerHeight = useMemo(() => {
    return height ? height - headerHeight : null
  }, [height, headerHeight])

  return (
    <div className={style.container}>
      <div className={style.header} style={{borderRightWidth: scrollBar && scrollBar.scrollBarWidth}}>
        <CustomHeader columns={columns} scrollBar={scrollBar} ref={headerRef} rowHeight={rowHeight} boxShadow={boxShadow}/>
      </div>
      <CustomTbody columns={columns} dataSource={pageDataSource} height={containerHeight} boxShadow={boxShadow} rowHeight={rowHeight} scrollBar={scrollBar} ref={bodyRef}/>
      {/* <footer>
        脚
      </footer> */}
    </div>
  )
}

export default VirtualTable