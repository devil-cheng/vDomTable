import React, { useMemo, forwardRef } from "react";
import style from "./index.less";

// 头部第二行Cell
const HeaderCell = ({ columns }) => {
return columns.map((item) => (
    <th key={item.dataIndex}>
        <div style={{ width: item.width || 120 }}>{item.title}</div>
    </th>
));
};

const TableHeader = forwardRef(({ columns, height, borderRight }, ref) => {
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
                    >
                    <div
                        style={{
                        width: item.children ? null : item.width || 120,
                        }}
                    >
                        {item.title}
                    </div>
                    </th>
                ))}
                </tr>
                <tr>
                {columns.map((item) => {
                    return item.children ? (
                    <HeaderCell columns={item.children} />
                    ) : null;
                })}
                </tr>
            </tbody>
        </table>
    )
})

export default TableHeader