import { Button, Paper, Stack, Typography } from '@mui/material';
import { mdiPencil } from '@mdi/js';
import { ICON_SIZE } from 'src/types';
import Icon from '@mdi/react';

export interface IComponentsActionsBarProps {
  onEditClicked: () => void;
  label: string;
}

export function ComponentsActionsBar({ onEditClicked, label }: IComponentsActionsBarProps) {
  return (
    <Paper elevation={0} sx={{ borderRadius: 0, border: '2px #757ce8 solid', backgroundColor: 'white', position: 'absolute', bottom: 0, left: -2, transform: 'translate(0,100%)', p: .5, zIndex: 1000 }}>
      <Stack direction='row' alignItems='center' gap={1}>
        <Typography>{label}</Typography>
        <Button variant="outlined" size="small" endIcon={<Icon path={mdiPencil} size={ICON_SIZE} />}
          onClick={(e) => {
            e.stopPropagation();
            onEditClicked();
          }}
          sx={{ top: 0 }}>
          Edit
        </Button>
      </Stack>
    </Paper>

  );
}
