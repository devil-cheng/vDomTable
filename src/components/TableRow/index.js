import TableCell from "../TableCell";
import style from "./index.less";

const TableRow = ({dataSource, columns, height }) => {
    return (
        <div className={style.viewContent} style={{height: height}}>
            {dataSource.map((item, index) => (
                <div className={style.viewItem} style={{ transform: `translate3d(0, ${item.transform}px, 0)` }}>
                <TableCell data={item} columns={columns} key={item.id} />
                </div>
            ))}
        </div>
    )
}

export default TableRow