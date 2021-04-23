import React, { useMemo, forwardRef } from "react";
import TableRow from "../TableRow";

import style from "./index.less";

const CustomBodyRow = forwardRef(({ columns, dataSource, bodyHeight }, ref) => {
    return (
        <div className={style.tableBody} ref={ref}>
            <TableRow dataSource={dataSource} columns={columns} height={bodyHeight} />
        </div>
    )
})

export default CustomBodyRow