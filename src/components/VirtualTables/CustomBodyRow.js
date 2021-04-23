import React, { useMemo, forwardRef } from "react";
import TableRow from "../TableRow";

import style from "./index.less";

const CustomBodyRow = forwardRef(({ columns, dataSource, height, bodyHeight }, ref) => {
    return (
        <div className={style.tableBody} ref={ref} style={{height: height}}>
            <TableRow dataSource={dataSource} columns={columns} height={bodyHeight} />
        </div>
    )
})

export default CustomBodyRow