export const FooterCell = ({ table }) => {
    const meta = table.options.meta
    const selectedRows = table.getSelectedRowModel().rows
    const removeRows = () => {
        meta.removeSelectedRows(
          table.getSelectedRowModel().rows.map(row => row.index)
        )
        table.resetRowSelection()
      }
    return (
      <div className="footer-buttons">
        {selectedRows.length > 0 ? (
        <button className="remove-button" onClick={removeRows}>
          Seçilenleri Sil
        </button>
      ) : null}
        <button className="add-button" onClick={meta?.addRow}>
          Satır Ekle
        </button>
        <button className="add-button" onClick={meta?._adjustColumnSize}>
          Sütun Genişliği
        </button>
        <button style={{float:'right'}} className="add-button" onClick={meta?._addColumn}>
          Sütun Ekle
        </button>
        <button style={{float:'right'}} className="add-button" onClick={meta?._pdfPrint}>
          Pdf Yazdır
        </button>
      </div>
    )
  }