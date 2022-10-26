import { Button } from '@mui/material';

const CreateButton = ({ mode, onOpenModal }) => {
  return (
    <Button
      color="secondary"
      onClick={onOpenModal}
      variant="contained"
    >
      Create {mode}
    </Button>
  );
};

export default CreateButton;