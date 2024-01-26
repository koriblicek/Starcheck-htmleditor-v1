import { Box } from '@mui/material';

const placeholderWrapperSx = {
    position: 'absolute',
    color: 'gray',
    top: '10px',
    left: '10px',
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
