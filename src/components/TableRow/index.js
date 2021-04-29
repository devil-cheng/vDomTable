import TableCell from "../TableCell";
import classnames from 'classnames'
import style from "./index.less";

const TableRow = ({dataSource, columns, height, trHoverFn }) => {
    return (
        <div className={style.viewContent} style={{height: height}}>
            {dataSource.map((item, index) => (
                <div key={`${item.id}-${index}`} className={classnames(style.viewTr, item.trHover ? style.trHover : null)} onMouseEnter={e => trHoverFn(item)} style={{ transform: `translate3d(0, ${item.transform}px, 0)` }}>
                    <TableCell data={item} columns={columns} key={item.id}/>
                </div>
            ))}
        </div>
    )
}

export default TableRow