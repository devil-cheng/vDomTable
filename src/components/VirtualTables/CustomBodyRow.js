import React, { forwardRef } from "react";
import TableRow from "../TableRow";

import style from "./index.less";

const CustomBodyRow = forwardRef(({ columns, dataSource, height, bodyHeight, trHoverFn }, ref) => {
    return (
        <div className={style.tableBody} ref={ref} style={{height: height}}>
            <TableRow dataSource={dataSource} columns={columns} height={bodyHeight} trHoverFn={trHoverFn} />
        </div>
    )
})

export default CustomBodyRow