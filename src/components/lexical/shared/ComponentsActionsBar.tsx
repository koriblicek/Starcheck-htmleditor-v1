import { Button, Paper, Stack, Typography } from '@mui/material';
import { Fragment } from 'react';

type ActionBarConfigItem = {
  onButtonClick: () => void;
  buttonLabel: string;
  buttonIcon: JSX.Element;
};

export interface IComponentsActionsBarProps {
  label: string;
  actions: ActionBarConfigItem[];
}

export function ComponentsActionsBar({ actions, label }: IComponentsActionsBarProps) {
  return (
    <Paper elevation={0} sx={{ borderRadius: 0, border: '2px #757ce8 solid', backgroundColor: 'white', position: 'absolute', bottom: 0, left: -2, transform: 'translate(0,100%)', p: .5, zIndex: 1000 }}>
      <Stack direction='row' alignItems='center' gap={1}>
      <Typography>{label}</Typography>
        {actions.map((action, index) => {
          return (<Fragment key={index}>
            <Button variant="outlined" size="small" endIcon={action.buttonIcon}
              onClick={(e) => {
                e.stopPropagation();
                action.onButtonClick();
              }}
              sx={{ top: 0 }}>
              {action.buttonLabel}
            </Button>
          </Fragment>
          );
        })}
      </Stack>
    </Paper>

  );
}
