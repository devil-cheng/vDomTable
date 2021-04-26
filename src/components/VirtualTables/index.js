import React, { useState, useEffect, useMemo } from "react";
import { useMount } from "react-use";

import CustomHeader from "./CustomHeader";
import CustomTbody from "./CustomTbody";
import getScrollWidth from "./getScrollWidth";

import { paramTypeFn, headerSource } from './utils.js';

import style from "./index.less";

const VirtualTable = ({ columns: defaultColumns = [], dataSource = [], height, rowHeight = 50 }) => {

  const [scrollBar] = useState(getScrollWidth())
  const [headerHeight, setHeaderHeight] = useState(0)
  const [ boxShadow={boxShadow}, setBoxShadow] = useState(null)

  
  const headerRef = React.createRef();
  const bodyRef = React.createRef();

  //数据初始化
  const newDataSource = useMemo(function () {
    return dataSource.map((item, index) => {
      return {
        ...item,
        transform: index * rowHeight
      }
    })
  }, [dataSource])

  const sortFn = (key, item) => {
    const { sortType } = item
    console.log(key, item)
    newDataSource.sort((a, b) => {
      return sortType === 'ascend' ? a[key] - b[key] : b[key] - a[key]
    })
  }

  console.warn(headerSource(defaultColumns))

  const columns = useMemo(() => {
    const columnsInitFn = data => {
      return data && data.map(item => {
        const { sortable, children } = item
        const sort = paramTypeFn(sortable);
        return {
            ...item,
            sort: sortable ? true : null,
            sortFn: sort === 'Function' ? sort : sortFn,
            sortType: null,
            height: rowHeight,
            colSpan: null,
            rowSpan: null,
            children: columnsInitFn(children)
          }
        })
    }

    return columnsInitFn(defaultColumns)
    
  }, [defaultColumns])

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
      <CustomTbody columns={columns} dataSource={newDataSource} height={containerHeight} boxShadow={boxShadow} rowHeight={rowHeight} scrollBar={scrollBar} ref={bodyRef}/>
      {/* <footer>
        脚
      </footer> */}
    </div>
  )
}

export default VirtualTable