import style from "./index.less";
const TableCell = (props) => {
  const { columns, data } = props;

  return (
    <>
      {columns.map((item) => {
        const { children, height, width, align, dataIndex, render } = item
        return children && children.length > 0 ? (
          <TableCell
            data={data}
            columns={children}
            key={data.index + dataIndex}
          />
        ) : (
          <div
            className={style.viewItemLi}
            style={{ width: width, minWidth: width, maxWidth: width, textAlign: align, height: height, lineHeight: `${height}px` }}
            key={dataIndex + data.id}
          >
              {
                !!!render ? data[dataIndex] :  render(data[dataIndex], item)
            }
          </div>
        );
      })}
    </>
  );
};

export default TableCell;
