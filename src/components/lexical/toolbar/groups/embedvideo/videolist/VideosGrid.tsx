import { Grid, ImageList } from "@mui/material";
import { useState } from "react";
import { VideoApiList } from "src/types";
import { VideoItem } from "./VideoItem";

interface IVideosGrid {
    videoLinks: VideoApiList[];
    onVideoSelected: (imageSrc: VideoApiList) => void;
}
export default function VideosGrid({ videoLinks, onVideoSelected }: IVideosGrid) {
    const [selectedVideo, setSelectedVideo] = useState<VideoApiList>({ video: "", poster: "" });

    function handleVideoSelection(src: VideoApiList) {
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
