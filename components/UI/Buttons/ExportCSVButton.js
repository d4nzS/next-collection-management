import { ExportToCsv } from 'export-to-csv';
import { Button } from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';

const ExportCSVButton = ({ columns, data }) => {
  const csvOptions = {
    fieldSeparator: ',',
    quoteStrings: '"',
    decimalSeparator: '.',
    showLabels: true,
    useBom: true,
    useKeysAsHeaders: false,
    headers: columns.map(col => col.header),
  };

  const csvExporter = new ExportToCsv(csvOptions);

  const exportDataHandler = () => {
    csvExporter.generateCsv(data);
  };

  return (
    <Button
      color="primary"
      onClick={exportDataHandler}
      startIcon={<FileDownloadIcon/>}
      variant="contained"
    >
      Export All Data
    </Button>
  );
};

export default ExportCSVButton;