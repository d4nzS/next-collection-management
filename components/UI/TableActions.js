import Link from 'next/link';
import { Box, IconButton, Tooltip } from '@mui/material';
import { Delete, Edit, Launch } from '@mui/icons-material';

const TableActions = ({ link, hasChangeRight, onEditRow, onDeleteRow }) => {
  return (
    <Box sx={{ display: 'flex', gap: '1', justifyContent: 'center' }}>
      <Tooltip arrow title="Link">
        <IconButton color="success">
          <Link href={link}>
            <Launch/>
          </Link>
        </IconButton>
      </Tooltip>
      {hasChangeRight && <>
        <Tooltip arrow title="Edit">
          <IconButton onClick={onEditRow}>
            <Edit/>
          </IconButton>
        </Tooltip>
        <Tooltip arrow title="Delete">
          <IconButton color="error" onClick={onDeleteRow}>
            <Delete/>
          </IconButton>
        </Tooltip>
      </>}
    </Box>
  );
};

export default TableActions;