import { useCallback, useMemo, useState } from 'react';
import MaterialReactTable from 'material-react-table';
import { Container, MenuItem } from '@mui/material';
import ReactMarkdown from 'react-markdown';

import classes from './Table.module.css';
import CreateNewRowModal from './CreateNewRowModal';
import CreateButton from './CreateButton';
import TableActions from './TableActions';

const Table = ({ mode, url, features, modalFields, data, hasChangeRight, onCreateRow, onEditRow, onDeleteRow }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tableData, setTableData] = useState(data);
  const [validationErrors, setValidationErrors] = useState({});

  const createNewRowHandler = async values => {
    const newRowId = await onCreateRow(values);

    setTableData(prevData => prevData.concat({ ...values, _id: newRowId }));
  };

  const saveRowEditsHandler = async ({ exitEditingMode, row, values }) => {
    Object.entries(values).forEach(([key, val]) => values[key] = val.trim());

    if (!Object.keys(validationErrors).length) {
      const collection = {
        ...values,
        _id: tableData[row.index]._id,
      };

      await onEditRow(collection);

      setTableData(prevData => {
        prevData[row.index] = collection;

        return [...prevData];
      });

      exitEditingMode();
    }
  };

  const deleteRowHandler = useCallback(async row => {
      if (!confirm(`Are you sure you want to delete ${row.getValue('name')}?`)) {
        return;
      }

      await onDeleteRow(tableData[row.index]._id);

      setTableData(prevData => {
        prevData.splice(row.index, 1);

        return [...prevData];
      });
    },
    [tableData]
  );

  const openModalHandler = () => {
    setIsModalOpen(true);
  };

  const closeModalHandler = () => {
    setIsModalOpen(false);
  };

  const getCommonEditTextFieldProps = useCallback(
    (cell, inputType) => {
      return {
        multiline: inputType === 'textarea',
        error: !!validationErrors[cell.id],
        helperText: validationErrors[cell.id],
        onBlur: event => {
          const value = event.target.value.trim();
          const isValid = !!value;

          if (!isValid) {
            setValidationErrors({
              ...validationErrors,
              [cell.id]: `The field ${cell.column.columnDef.header} is required!`,
            });
          } else {
            delete validationErrors[cell.id];
            setValidationErrors({ ...validationErrors });
          }
        }
      };
    }, [validationErrors]
  );

  const columns = useMemo(
    () => features.map(feature => ({
      accessorKey: feature.name,
      header: feature.label,
      size: 100,
      enableEditing: feature.enableEditing,
      Cell: ({ row }) => feature.isMarkdown
        ? <ReactMarkdown className={classes.markdown}>{row.original[feature.name]}</ReactMarkdown>
        : row.original[feature.name],
      muiTableBodyCellEditTextFieldProps: feature.type === 'select'
        ? {
          select: true,
          children: feature.options.map(option => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))
        }
        : ({ cell }) => ({ ...getCommonEditTextFieldProps(cell, feature.type) })
    })),
    [features, getCommonEditTextFieldProps]
  );

  return (
    <Container component="main" maxWidth="xl" sx={{ p: { xs: 2, sm: 3 } }}>
      <MaterialReactTable
        displayColumnDefOptions={{
          'mrt-row-actions': {
            muiTableHeadCellProps: {
              align: 'center',
            },
            size: 120,
          }
        }}
        columns={columns}
        data={tableData}
        editingMode="modal"
        enableEditing
        enableGlobalFilter={false}
        enableHiding={false}
        onEditingRowSave={saveRowEditsHandler}
        renderRowActions={({ row, table }) => (
          <TableActions
            link={url + '/' + tableData[row.index]._id}
            hasChangeRight={hasChangeRight}
            onEditRow={() => table.setEditingRow(row)}
            onDeleteRow={() => deleteRowHandler(row)}
          />
        )}
        renderTopToolbarCustomActions={() => hasChangeRight
          ? <CreateButton mode={mode} onOpenModal={openModalHandler}/>
          : null}
      />
      <CreateNewRowModal
        fields={modalFields}
        isOpen={isModalOpen}
        onClose={closeModalHandler}
        onSubmit={createNewRowHandler}
      />
    </Container>
  );
};

export default Table;