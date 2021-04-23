import React, { useState, useEffect, useMemo } from "react";
import style from "./table.less";

import CustomHeader from "../CustomHeader";
import CustomTbody from "../CustomTbody";
import getScrollWidth from "./getScrollWidth";


const VirtualTable = ({ columns = [], dataSource = [], height, rowHeight = 30 }) => {

  //数据初始化
  const newDataSource = useMemo(function () {
    return dataSource.map((item, index) => {
      return {
        ...item,
        transform: index * rowHeight
      }
    })
  }, [dataSource])

  console.log(getScrollWidth())

  return (
    <div className={style.container}>
      <div className={style.header}>
        <CustomHeader columns={columns} />
      </div>
      <CustomTbody columns={columns} dataSource={newDataSource}/>
      <footer>
        脚
      </footer>
    </div>
  )
}

export default VirtualTable