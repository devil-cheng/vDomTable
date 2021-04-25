import style from "./index.less";
const TableCell = (props) => {
  const { columns, data, rowHeight } = props;

  return (
    <>
      {columns.map((item) => {
        return item.children ? (
          <TableCell
            data={data}
            columns={item.children}
            key={data.index + item.dataIndex}
            rowHeight={rowHeight}
          />
        ) : (
          <div
            className={style.viewItemLi}
            style={{ width: item.width || 120, textAlign: item.align || "left", height: rowHeight, lineHeight: `${rowHeight}px` }}
            key={item.dataIndex + data.id}
          >
              {
                !!!item.render ? data[item.dataIndex] :  item.render(data[item.dataIndex], item)
            }
          </div>
        );
      })}
    </>
  );
};

export default TableCell;
