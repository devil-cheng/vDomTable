import React, { useMemo, useEffect, memo, useState } from 'react';
import CustomBodyRow from "../CustomBodyRow";
import style from './index.less'

const CustomTbody = ({ columns, dataSource, rowHeight = 30 }) => {
    
    const leftFixedColumns = useMemo(() => {
        return columns.filter(item => item.fixed || item.fixed === 'left')
    }, [columns])

    const leftFixedWidth = useMemo(() => {
        return leftFixedColumns.reduce((total, item) => {
            total += (item.width + 14) || 120
            return total
        } , 0)
    }, [leftFixedColumns])
  
    const [height, setHeight] = useState(0)
    console.log('leftFixedWidth===', leftFixedWidth)
    // 设置滚动区域高度
    useEffect(() => {
        setHeight(rowHeight * dataSource.length);
    }, [rowHeight, dataSource]);
  
    const leftFixedRef = React.createRef();
    const tBodyRef = React.createRef();

    return (
        <div className={style.tbodyContainer}>
            {
                leftFixedColumns && leftFixedColumns.length !== 0 ? (
                    <div className={style.leftFixedTbody} style={{width: leftFixedWidth}}>
                        <CustomBodyRow columns={leftFixedColumns} dataSource={dataSource} bodyHeight={height} ref={leftFixedRef} />
                   </div>
               ) : null
            }
            <div className={style.tbody}>
                <CustomBodyRow columns={columns} dataSource={dataSource} bodyHeight={height} ref={tBodyRef} />
            </div>
        </div>
    )
}

export default memo(CustomTbody)