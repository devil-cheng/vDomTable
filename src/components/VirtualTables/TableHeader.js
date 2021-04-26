import React, { useMemo, forwardRef } from "react";
import classnames from 'classnames';
import style from "./index.less";

const HeaderColumns = ({ item, ...otherProps }) => {
    const { title, dataIndex, width, align, sortable, sortFn, height } = item
    return (
        <th
            key={dataIndex}
            style={{
                minWidth: width || 120,
                maxWidth: width || 120,
                textAlign: align,
                height: height
            }}
            {...otherProps}
        >
            <span>{title}</span>
            {
                sortable ? (
                    <span className={style.sort} onClick={() => sortFn(dataIndex, item)}>
                        <em className={classnames(style.sortUp)}></em>
                        <em className={classnames(style.sortDown, style.on)}></em>
                    </span>
                ) : null
            }
        </th>
    )
}

// 头部第二行Cell
const HeaderCell = ({ columns }) => {
    return columns.map((item) => (
        <HeaderColumns item={item} key={item.dataIndex} />
    ));
};

const TableHeader = forwardRef(({ columns, height }, ref) => {
    // 头部行数
  const rowSpan = useMemo(function () {
    const columnsChild = columns.filter((item) => item.children);
    return columnsChild.length > 0 ? 2 : 1;
  }, [columns])
    
    return (
        <table border="1" className={style.table} style={{height: height}} ref={ref}>
            <tbody>
                <tr style={{height: height}}>
                    {columns.map((item) => (
                        <HeaderColumns
                            colSpan={item.children ? item.children.length : null}
                            rowSpan={item.children ? 1 : rowSpan}
                            item={item}
                            key={item.dataIndex} 
                        />
                    ))}
                </tr>
                <tr>
                    {columns.map((item) => {
                        return item.children ? (
                            <HeaderCell key={item.dataIndex} columns={item.children}/>
                        ) : null;
                    })}
                </tr>
            </tbody>
        </table>
    )
})

export default TableHeader