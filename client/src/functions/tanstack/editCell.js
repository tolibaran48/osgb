
const EditCell = ({ row, table }) => {
  const meta = table.options.meta;
  const setEditedRows = (e) => {
    const elName = e.currentTarget.name;
    meta?.setEditedRows((old) => ({
      ...old,
      [row.id]: !old[row.id],
    }));
    if (elName !== "edit") {
      e.currentTarget.name === "cancel" ? meta?.revertData(row.index) : meta?.updateRow(row.index);
    }
  };
  const removeRow = () => {
    meta?.removeRow(row.index);
  };

  return (
    <div className="edit-cell-container">
      {meta?.editedRows[row.id] ? (
        <div className="edit-cell-action">
          <button onClick={setEditedRows} name="cancel">
            ⚊
          </button>{" "}
          <button onClick={setEditedRows} name="done">
            ✔
          </button>
        </div>
      ) : (
        <div className="edit-cell-action">
          <button onClick={setEditedRows} name="edit">
            ✐
          </button>
          <button onClick={removeRow} name="remove">
            X
          </button>
        </div>
      )}
       <input
        type="checkbox"
        checked={row.getIsSelected()}
        onChange={row.getToggleSelectedHandler()}
      />
    </div>
  );
};

export default EditCell;