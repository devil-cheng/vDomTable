import React, { useMemo, forwardRef, memo, useState } from 'react';
import classnames from 'classnames';

import TableHeader from "./TableHeader";
import style from './index.less'

const getMaxLevel = (treeData) => {
  let maxLevel = 0
  function loop (data, level) {
    data.forEach(item => {
      item.level = level
      if (level > maxLevel) {
        maxLevel = level
      }
      if (item.children && item.children.length > 0) {
        loop(item.children, level + 1)
      }
    })             
  }
  loop(treeData, 1)
  return maxLevel
}

const CustomHeader = forwardRef(({ columns, rowHeight, boxShadow }, ref) => {
    
    const leftFixedColumns = useMemo(() => {
        return columns.filter(item => item.fixed || item.fixed === 'left')
    }, [columns])
  
  
    const leftFixedRef = React.createRef();
    const headerRef = React.createRef();
  
  const height = useMemo(() => {
    if (leftFixedColumns && leftFixedColumns.length) {
      const tableLevel = getMaxLevel(columns)
      const leftLevel = getMaxLevel(leftFixedColumns)

      if (tableLevel !== leftLevel) {
          return rowHeight * tableLevel
      }
    }
    return getMaxLevel(columns)
  }, [leftFixedColumns, columns])

    return (
        <div className={style.headerContainer} ref={ref}>
            {
                leftFixedColumns && leftFixedColumns.length !== 0 ? (
                    <div className={classnames(style.leftFixed, boxShadow ? null : style.hideShadow)} ref={leftFixedRef}>
                        <TableHeader columns={leftFixedColumns} height={height} rowHeight={rowHeight}/>
                    </div>
                ) : null
            }
            <TableHeader ref={headerRef} columns={columns} rowHeight={rowHeight}/>
        </div>
    )
})

export default memo(CustomHeader)