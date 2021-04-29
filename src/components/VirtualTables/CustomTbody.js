import React, { useMemo, useEffect, memo, useState, forwardRef } from 'react';
import { useMount } from "react-use";
import classnames from 'classnames';

import CustomBodyRow from "./CustomBodyRow";
import style from './index.less'

function throttle(fn,delay = 60){
    let valid = true
    return function() {
       if(!valid){
           return false 
       }
        valid = false
        setTimeout(() => {
            fn()
            valid = true;
        }, delay)
    }
}

const CustomTbody = forwardRef(({ columns, dataSource, height, scrollBar, rowHeight = 30, boxShadow }, ref) => {
    console.warn(dataSource)
    const leftFixedColumns = useMemo(() => {
        return columns.filter(item => item.fixed || item.fixed === 'left')
    }, [columns])

    const leftFixedWidth = useMemo(() => {
        return leftFixedColumns.reduce((total, item) => {
            total += item.width
            return total
        } , 0)
    }, [leftFixedColumns])
  
    const [bodyHeight, setBodyHeight] = useState(0)
    
    const [dataList, setDataList] = useState([]);

    // 设置滚动区域高度
    useEffect(() => {
        const bHeight = rowHeight * dataSource.length
        if (bHeight && bodyHeight !== bHeight) {
            setBodyHeight(bHeight);
        }
    }, [rowHeight, dataSource]);
  
    const leftFixedRef = React.createRef();
    
    const trHoverFn = (item) => {
        const list = dataList.map(child => {
            return {
                ...child,
                trHover: item.id === child.id ? true : false
            }
        })

        setDataList(list)
    }
  

  const updateViewContentFn = () => {
      const clientHeight = ref.current && ref.current.clientHeight;
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
          const viewData = dataSource.slice(start, end);

          setDataList(viewData);
      };
  };

    useMount(() => {
    const leftNode = leftFixedRef.current;
    const bodyNode = ref.current;
        
    bodyNode.scrollTop = 0
    leftNode.scrollTop = 0
        
    const updateViewContent = updateViewContentFn();

    const leftScrollFn = (e) => {
        if (leftNode.scrollTop !== bodyNode.scrollTop) {
            bodyNode.scrollTop = leftNode.scrollTop;
            throttle(updateViewContent(e.target.scrollTop))
        }
    };

    const bodyScrollFn = (e) => {
        if (leftNode.scrollTop !== bodyNode.scrollTop) {
            leftNode.scrollTop = bodyNode.scrollTop;
            throttle(updateViewContent(e.target.scrollTop))
        }
    };
    updateViewContent(0);

    // 头部scroll监听
    const leftMouseFn = () => {
        bodyNode.removeEventListener("scroll", bodyScrollFn);
        leftNode.addEventListener("scroll", leftScrollFn);
    };

    const bodyMouseFn = () => {
        leftNode.removeEventListener("scroll", leftScrollFn);
        bodyNode.addEventListener("scroll", bodyScrollFn);
    };
      
    leftNode.addEventListener("mouseover", leftMouseFn);
    bodyNode.addEventListener("mouseover", bodyMouseFn);

    return () => {
        leftNode.removeEventListener("mouseover", leftMouseFn);
        bodyNode.removeEventListener("mouseover", bodyMouseFn);
    };
    
  })

    return (
        <div className={style.tbodyContainer} style={{height: height}}>
            {
                leftFixedColumns && leftFixedColumns.length !== 0 ? (
                    <div className={classnames(style.leftFixedTbody, boxShadow ? null : style.hideShadow)} style={{width: leftFixedWidth, bottom: scrollBar.scrollBarHeight }}>
                        <CustomBodyRow trHoverFn={trHoverFn} columns={leftFixedColumns} dataSource={dataList} height={height - scrollBar.scrollBarHeight} bodyHeight={bodyHeight} ref={leftFixedRef} />
                   </div>
               ) : null
            }
            <div className={style.tbody}>
                <CustomBodyRow trHoverFn={trHoverFn} columns={columns} dataSource={dataList} height={height} bodyHeight={bodyHeight} ref={ref} />
            </div>
        </div>
    )
})

export default memo(CustomTbody)