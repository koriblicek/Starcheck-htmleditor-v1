import { ImageListItem, useTheme } from "@mui/material";

export interface IImageItemProps {
    imageLink: string;
    selected: boolean;
    onImageSelected: (imageSrc: string) => void;
}

export function ImageItem({ imageLink, onImageSelected, selected }: IImageItemProps) {
    const theme = useTheme();
    return (
        <ImageListItem sx={{ cursor: 'pointer' }} onClick={() => onImageSelected(imageLink)}>
            <img
                src={`${imageLink}`}
                style={{ border: selected ? `3px ${theme.palette.secondary.dark} solid` : `3px ${theme.palette.grey[300]} solid` }}
                alt=""
            />
        </ImageListItem>
    );
}
