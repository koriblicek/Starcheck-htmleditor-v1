import { Grid, ImageList } from "@mui/material";
import { useState } from "react";
import { IVideoApiItem } from "src/types";
import { VideoItem } from "./VideoItem";

interface IVideosGrid {
    videoLinks: IVideoApiItem[];
    onVideoSelected: (imageSrc: IVideoApiItem) => void;
}
export default function VideosGrid({ videoLinks, onVideoSelected }: IVideosGrid) {
    const [selectedVideo, setSelectedVideo] = useState<IVideoApiItem>({ video: "", poster: "" });

    function handleVideoSelection(src: IVideoApiItem) {
        setSelectedVideo({ video: src.video, poster: src.poster });
        onVideoSelected({ video: src.video, poster: src.poster });
    }

    const videos = videoLinks.map((videoLink, index) => {
        return (
            <VideoItem key={index} onVideoSelected={handleVideoSelection} videoLink={videoLink} selected={videoLink.video === selectedVideo.video} />
        );
    });

    return (
        <Grid container sx={{ p: 0, m: 0 }}>
            <Grid item xs>
                <ImageList variant="masonry" cols={3} gap={4}>
                    {videos}
                </ImageList>
            </Grid>
        </Grid>
    );
}
