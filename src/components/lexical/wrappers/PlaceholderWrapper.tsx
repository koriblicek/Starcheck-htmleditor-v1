import { Box } from '@mui/material';

const placeholderWrapperSx = {
    position: 'absolute',
    color: 'gray',
    top: '31px',
    left: '50%',
    transform: 'translate(-50%, 0)',
    pointerEvents: 'none'
};

export interface IPlaceholderWrapperProps {
    text: string;
}

export function PlaceholderWrapper({ text }: IPlaceholderWrapperProps) {
    return (
        <Box sx={placeholderWrapperSx}>
            {text}
        </Box>
    );
}
