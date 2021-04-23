import React, { useState, useEffect, useMemo } from "react";
import { useMount } from "react-use";

import CustomHeader from "./CustomHeader";
import CustomTbody from "./CustomTbody";
import getScrollWidth from "./getScrollWidth";

import style from "./index.less";

const VirtualTable = ({ columns = [], dataSource = [], height, rowHeight = 30 }) => {

  const [scrollBar] = useState(getScrollWidth())
  const [headerHeight, setHeaderHeight] = useState(0)

  
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

  

  useMount(() => {
    const headerNode = headerRef.current;
    const bodyNode = bodyRef.current;

    const headerScrollFn = () => {
      if (headerNode.scrollLeft !== bodyNode.scrollLeft) {
        bodyNode.scrollLeft = headerNode.scrollLeft;
      }
    };

    const bodyScrollFn = () => {
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
        <CustomHeader columns={columns} scrollBar={scrollBar} ref={headerRef}/>
      </div>
      <CustomTbody columns={columns} dataSource={newDataSource} height={containerHeight} scrollBar={scrollBar} ref={bodyRef}/>
      {/* <footer>
        脚
      </footer> */}
    </div>
  )
}

export default VirtualTable