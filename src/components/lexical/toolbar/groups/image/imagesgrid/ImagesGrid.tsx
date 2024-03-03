import { Grid, ImageList } from "@mui/material";
import { useState } from "react";
import { ImageItem } from "./ImageItem";

interface IImagesGrid {
    imageLinks: string[];
    onImageSelected: (imageSrc: string) => void;
}
export default function ImagesGrid({ imageLinks, onImageSelected }: IImagesGrid) {
    const [selectedLink, setSelectedLink] = useState<string>("");

    function handleImageSelection(link: string) {
        setSelectedLink(link);
        onImageSelected(link);
    }

    const images = imageLinks.map((imageLink, index) => {
        return (
            <ImageItem key={index} onImageSelected={handleImageSelection} imageLink={imageLink} selected={imageLink === selectedLink} />
        );
    });

    return (
        <Grid container  sx={{p:0, m:0}}>
            <Grid item xs>
                <ImageList variant="masonry" cols={3} gap={4}>
                    {images}
                </ImageList>
            </Grid>
        </Grid>
    );
}
