import TableCell from "../TableCell";
import style from "./index.less";

const TableRow = ({dataSource, columns, height, rowHeight }) => {
    return (
        <div className={style.viewContent} style={{height: height}}>
            {dataSource.map((item, index) => (
                <div key={`${item.id}-${index}`} className={style.viewTr} style={{ transform: `translate3d(0, ${item.transform}px, 0)` }}>
                    <TableCell data={item} columns={columns} key={item.id} rowHeight={rowHeight}/>
                </div>
            ))}
        </div>
    )
}

export default TableRow