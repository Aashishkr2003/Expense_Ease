import { useMemo, useState } from "react";
import {
  type FinancialRecord,
  useFinancialRecords,
} from "../../contexts/financial-record-context";
import { useTable, type Column, type CellProps, type Row } from "react-table";

// Add these for dropdown options
const CATEGORY_OPTIONS = [
  "Food",
  "Rent",
  "Salary",
  "Utilities",
  "Entertainment",
  "Other",
];
const PAYMENT_METHOD_OPTIONS = [
  "Credit Card",
  "Cash",
  "Bank Transfer",
];

interface EditableCellProps extends CellProps<FinancialRecord> {
  updateRecord: (rowIndex: number, columnId: string, value: any) => void;
  editable: boolean;
  type?: string;
  options?: string[];
}

const EditableCell: React.FC<EditableCellProps> = ({
  value: initialValue,
  row,
  column,
  updateRecord,
  editable,
  type,
  options,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(initialValue);

  const onBlur = () => {
    setIsEditing(false);
    // For number type, convert to number
    if (type === "number") {
      const numValue = Number(value);
      if (!isNaN(numValue)) {
        updateRecord(row.index, column.id, numValue);
      }
    } else {
      updateRecord(row.index, column.id, value);
    }
  };

  // Only allow numbers for amount
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (type === "number") {
      // Prevent non-numeric input
      const val = e.target.value.replace(/[^0-9.]/g, "");
      setValue(val);
    } else {
      setValue(e.target.value);
    }
  };

  return (
    <div
      onClick={() => editable && setIsEditing(true)}
      style={{ cursor: editable ? "pointer" : "default" }}
    >
      {isEditing ? (
        options ? (
          <select
            value={value}
            onChange={handleChange}
            onBlur={onBlur}
            autoFocus
            style={{ width: "100%" }}
          >
            {options.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        ) : (
          <input
            type={type || "text"}
            value={value}
            onChange={handleChange}
            autoFocus
            onBlur={onBlur}
            style={{ width: "100%" }}
            inputMode={type === "number" ? "decimal" : undefined}
            pattern={type === "number" ? "[0-9.]*" : undefined}
          />
        )
      ) : typeof value === "string" ? (
        value
      ) : (
        value.toString()
      )}
    </div>
  );
};

export const FinancialRecordList = () => {
  const { records, updateRecord, deleteRecord } = useFinancialRecords();

  const updateCellRecord = (rowIndex: number, columnId: string, value: any) => {
    const id = records[rowIndex]?._id;
    updateRecord(id ?? "", { ...records[rowIndex], [columnId]: value });
  };

  const columns: Array<Column<FinancialRecord>> = useMemo(
    () => [
      {
        Header: "Description",
        accessor: "description",
        Cell: (props) => (
          <EditableCell
            {...props}
            updateRecord={updateCellRecord}
            editable={true}
          />
        ),
      },
      {
        Header: "Amount",
        accessor: "amount",
        Cell: (props) => (
          <EditableCell
            {...props}
            updateRecord={updateCellRecord}
            editable={true}
            type="number"
          />
        ),
      },
      {
        Header: "Category",
        accessor: "category",
        Cell: (props) => (
          <EditableCell
            {...props}
            updateRecord={updateCellRecord}
            editable={true}
            options={CATEGORY_OPTIONS}
          />
        ),
      },
      {
        Header: "Payment Method",
        accessor: "paymentMethod",
        Cell: (props) => (
          <EditableCell
            {...props}
            updateRecord={updateCellRecord}
            editable={true}
            options={PAYMENT_METHOD_OPTIONS}
          />
        ),
      },
      {
        Header: "Date",
        accessor: "date",
        Cell: (props) => (
          <EditableCell
            {...props}
            updateRecord={updateCellRecord}
            editable={false}
          />
        ),
      },
      {
        Header: "Delete",
        id: "delete",
        Cell: ({ row }) => (
          <button
            onClick={() => {
              if (
                window.confirm(
                  "Are you sure you want to delete this record? This action cannot be undone."
                )
              ) {
                deleteRecord(row.original._id ?? "");
              }
            }}
            className="button"
          >
            Delete
          </button>
        ),
      },
    ],
    [records]
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({
      columns,
      data: records,
    });
  return (
    <div className="table-container">
      <table {...getTableProps()} className="table">
        <thead>
          {headerGroups.map((hg) => {
            const { key, ...restHeaderGroupProps } = hg.getHeaderGroupProps();
            return (
              <tr key={key} {...restHeaderGroupProps}>
                {hg.headers.map((column) => {
                  const { key: colKey, ...restColProps } =
                    column.getHeaderProps();
                  return (
                    <th key={colKey} {...restColProps}>
                      {column.render("Header")}
                    </th>
                  );
                })}
              </tr>
            );
          })}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row, idx) => {
            prepareRow(row);
            const { key: rowKey, ...restRowProps } = row.getRowProps();
            return (
              <tr key={rowKey} {...restRowProps}>
                {row.cells.map((cell) => {
                  const { key: cellKey, ...restCellProps } =
                    cell.getCellProps();
                  return (
                    <td key={cellKey} {...restCellProps}>
                      {cell.render("Cell")}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
