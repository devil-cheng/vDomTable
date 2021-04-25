import React, { useMemo, forwardRef } from "react";
import style from "./index.less";

// 头部第二行Cell
const HeaderCell = ({ columns, rowHeight }) => {
return columns.map((item) => (
    <th key={item.dataIndex} style={{
        minWidth: item.width || 120,
        maxWidth: item.width || 120,
        textAlign: item.align || 'left',
        height: rowHeight
    }}>
        <div>{item.title}</div>
    </th>
));
};

const TableHeader = forwardRef(({ columns, height, rowHeight }, ref) => {
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
                    <th
                        colSpan={item.children ? item.children.length : null}
                        rowSpan={item.children ? 1 : rowSpan}
                        key={item.dataIndex}
                        style={{
                            minWidth: item.children ? null : item.width || 120,
                            maxWidth: item.children ? null : item.width || 120,
                            textAlign: item.children ? 'center' : item.align || 'left',
                            height: rowHeight
                        }}
                    >
                        <div>
                        {item.title}
                    </div>
                    </th>
                ))}
                </tr>
                <tr>
                {columns.map((item) => {
                    return item.children ? (
                        <HeaderCell key={item.dataIndex} columns={item.children} rowHeight={rowHeight}/>
                    ) : null;
                })}
                </tr>
            </tbody>
        </table>
    )
})

export default TableHeader