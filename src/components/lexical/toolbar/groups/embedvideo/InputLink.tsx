import { Button, CircularProgress, Grid, InputAdornment, TextField, TextFieldProps, useTheme } from '@mui/material';
import { useMemo } from 'react';
import Icon from '@mdi/react';
import { mdiCheckCircleOutline } from '@mdi/js';
import { mdiAlertCircleOutline } from '@mdi/js';
import { mdiHelpCircleOutline } from '@mdi/js';
import { ICON_SIZE } from 'src/types';

type IInputLinkProps = {
    isVerified: boolean | null;
    isVerifying: boolean;
    icon: JSX.Element;
    buttonLabel: string;
    onVerifyLink: () => void;
} & TextFieldProps;

export function InputLink({ isVerified, isVerifying, icon, buttonLabel, onVerifyLink, ...props }: IInputLinkProps) {

    const theme = useTheme();

    const endIcon = useMemo(() => {
        if (isVerifying) {
            return <CircularProgress size={15} color="inherit" />;
        } else {
            switch (isVerified) {
                case null:
                    return <Icon path={mdiHelpCircleOutline} size={ICON_SIZE} color={theme.palette.grey[400]} />;
                case false:
                    return <Icon path={mdiAlertCircleOutline} size={ICON_SIZE} color={theme.palette.error.light} />;
                case true:
                    return <Icon path={mdiCheckCircleOutline} size={ICON_SIZE} color={theme.palette.success.light} />;
            }
        }

    }, [isVerified, isVerifying, theme]);

    return (
        <Grid container gap={1} alignItems='center'>
            <Grid item xs>
                <TextField
                    {...props}
                    InputProps={{
                        endAdornment: <InputAdornment position="end">{endIcon}</InputAdornment>,
                        startAdornment: <InputAdornment position="start">{icon}</InputAdornment>
                    }}
                />
            </Grid>
            <Grid item>
                <Button
                    variant='contained'
                    disabled={isVerifying || (isVerified === true)}
                    onClick={onVerifyLink}
                >
                    {buttonLabel}
                </Button>
            </Grid>
        </Grid>
    );
}
