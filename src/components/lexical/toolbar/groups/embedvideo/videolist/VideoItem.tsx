import { ImageListItem, useTheme } from "@mui/material";
import { IVideoApiItem } from "src/types";

export interface IVideoItemProps {
    videoLink: IVideoApiItem;
    selected: boolean;
    onVideoSelected: (src: IVideoApiItem) => void;
}

export function VideoItem({ videoLink, onVideoSelected, selected }: IVideoItemProps) {
    const theme = useTheme();
    return (
        <ImageListItem sx={{ cursor: 'pointer' }} onClick={() => onVideoSelected(videoLink)}>
            <img
                src={`${videoLink.poster}`}
                style={{ border: selected ? `3px ${theme.palette.secondary.dark} solid` : `3px ${theme.palette.grey[300]} solid` }}
                alt=""
            />
        </ImageListItem>
    );
}
