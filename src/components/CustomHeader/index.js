import React, { useMemo, useEffect, memo, useState } from 'react';
import { useMount } from "react-use";
import { Table } from 'antd';

import TableHeader from "../TableHeader";
import style from './index.less'

const CustomHeader = ({ columns }) => {
    
    const leftFixedColumns = useMemo(() => {
        return columns.filter(item => item.fixed || item.fixed === 'left')
    }, [columns])
  
    const [height, setHeight] = useState(null)
  
    const leftFixedRef = React.createRef();
    const headerRef = React.createRef();

    console.log(columns)
  console.log(leftFixedColumns)
  useMount(() => {
      console.log(leftFixedRef)
    console.log(headerRef)
    if (leftFixedRef.current && headerRef.current && leftFixedRef.current.clientHeight !== headerRef.current.clientHeight) {
      setHeight(headerRef.current.clientHeight - 2)
      }
    })

    return (
        <div className={style.headerContainer}>
            {
                leftFixedColumns && leftFixedColumns.length !== 0 ? (
                    <div className={style.leftFixed} ref={leftFixedRef} style={{height: height}}>
                      <TableHeader columns={leftFixedColumns} height={height} />
                    </div>
                ) : null
            }
            <TableHeader ref={headerRef} columns={columns} />
        </div>
    )
}

export default memo(CustomHeader)