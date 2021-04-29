import React, { useMemo, forwardRef } from "react";
import classnames from 'classnames';
import style from "./index.less";

const HeaderColumns = ({ item, ...otherProps }) => {
    const { title, dataIndex, width, align, sortable, sortFn, height } = item
    return (
        <th
            key={dataIndex}
            style={{
                textAlign: align,
                height: height,
                minWidth: width,
                maxWidth: width
            }}
            {...otherProps}
        >
            <span>{title}</span>
            {
                sortable ? (
                    <span className={style.sort} onClick={() => sortFn(item)}>
                        <em className={classnames(style.sortUp, style.on)}></em>
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

const Colgroup = ({ columns }) => {
    return (
        columns.map(item => {
            const {width, children, key } = item
            return children && children.length > 0 ? <Colgroup key={key} columns={children} />  : (
                <col
                    key={key}
                    width={width}
                    style={{
                        minWidth: width,
                        maxWidth: width
                    }}
                    />
            )
        })
    )
}

const TableHeader = forwardRef(({ columns, height }, ref) => {
    // 头部行数
  const rowSpan = useMemo(function () {
    const columnsChild = columns.filter((item) => item.children);
    return columnsChild.length > 0 ? 2 : 1;
  }, [columns])
    
  const tableWidth = useMemo(function () {
        const totalWidthFn = (data) => {
            return data.reduce((total, item) => {
                const {width, children} = item
                return total += children && children.length ? totalWidthFn(children) : width
            }, 0)
        }
        return totalWidthFn(columns)
  }, [columns])
    
    return (
        <table border="1" className={style.table} style={{ height: height, width: tableWidth }} ref={ref}>
            <colgroup>
                <Colgroup columns={columns} />
            </colgroup>
            <thead>
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
            </thead>
        </table>
    )
})

export default TableHeader