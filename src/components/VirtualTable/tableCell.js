const TableCell = (props) => {
  const { columns, data } = props;

  return (
    <>
      {columns.map((item) => {
        return item.children ? (
          <TableCell
            data={data}
            columns={item.children}
            key={data.index + item.dataIndex + Math.random()}
          />
        ) : (
          <div
            className="view-item-li"
            style={{ width: item.width || 150, textAlign: "center" }}
            key={item.dataIndex + data.id}
          >
            {data[item.dataIndex]}
          </div>
        );
      })}
    </>
  );
};

export default TableCell;
