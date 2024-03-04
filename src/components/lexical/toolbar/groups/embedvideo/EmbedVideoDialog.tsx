import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, IconButton, Typography } from '@mui/material';
import { ICON_SIZE, NewEmbedVideoPayload, VideoApiList } from 'src/types';
import { useCallback, useEffect, useState } from 'react';
import Icon from '@mdi/react';
import { mdiWindowClose } from '@mdi/js';
import { mdiImageOutline } from '@mdi/js';
import { mdiVideo } from '@mdi/js';
import { mdiCheck } from '@mdi/js';
import { InputLink } from './InputLink';
import VideosGrid from './videolist/VideosGrid';
import VideoListLoader from './videolistloader/VideoListLoader';
import { useAppSelector } from 'src/store/hooks';

export interface IEmbedVideoDialogProps {
    open: boolean;
    onClose: () => void;
    onConfirm: (embedVideoData: NewEmbedVideoPayload) => void;
}
const initialData: NewEmbedVideoPayload = { videoUrl: "https://", posterUrl: "https://" };

export function EmbedVideoDialog({ open, onClose, onConfirm }: IEmbedVideoDialogProps) {
    const [embedVideoData, setEmbedVideoData] = useState<NewEmbedVideoPayload>(initialData);
    const [isVideoUrlValid, setIsVideoUrlValid] = useState<boolean | null>(null);
    const [isPosterUrlValid, setIsPosterUrlValid] = useState<boolean | null>(null);
    const [isVerifyingPosterUrl, setIsVerifyingPosterUrl] = useState<boolean>(false);

    const { appData } = useAppSelector(state => state.htmlEditorAppData);

    const [loadedVideoData, setLoadedVideoData] = useState<VideoApiList[]>();

    function handleVideoData(loadedData: VideoApiList[]) {
        if (loadedData.length > 0) {
            setLoadedVideoData(loadedData);
        } else {
            setLoadedVideoData([]);
        }
    }

    useEffect(() => {
        setIsVideoUrlValid(null);
        setIsPosterUrlValid(null);
        setIsVerifyingPosterUrl(false);
        setEmbedVideoData(initialData);
    }, [open]);

    const verifyPosterUrl = useCallback(() => {
        setIsVerifyingPosterUrl(true);
        new Promise((resolve) => {
            const img = new Image();
            img.onload = () => resolve(true);
            img.onerror = () => resolve(false);
            img.src = embedVideoData.posterUrl;
        })
            .then((response) => {
                if (response) {
                    setIsPosterUrlValid(true);
                } else {
                    setIsPosterUrlValid(false);
                }
                setIsVerifyingPosterUrl(false);
            });
    }, [embedVideoData]);

    const verifyVideoUrl = () => {
        const regex = new RegExp('(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?');
        setIsVideoUrlValid(regex.test(embedVideoData.videoUrl));
    };

    return (
        <Dialog onClose={onClose} open={open} fullWidth maxWidth="sm">
            <DialogTitle>
                {/* <DialogContentText> */}
                Insert Embed Video
                {/* </DialogContentText> */}
                <IconButton
                    onClick={onClose}
                    sx={{
                        position: 'absolute',
                        top: 10,
                        right: 10
                    }}
                >
                    <Icon path={mdiWindowClose} size={ICON_SIZE} />
                </IconButton>
            </DialogTitle>
            <DialogContent sx={{ overflowY: 'unset' }}>
                <Grid container alignItems='center' gap={2}>
                    <Grid item xs={12}>
                        <InputLink
                            isVerified={isPosterUrlValid}
                            isVerifying={isVerifyingPosterUrl}
                            icon={<Icon path={mdiImageOutline} size={ICON_SIZE} />}
                            buttonLabel="Verify Poster link"
                            onVerifyLink={verifyPosterUrl}
                            fullWidth
                            autoFocus
                            id="embed-video-poster-url"
                            name="embed-video-poster-url"
                            variant="outlined"
                            size='small'
                            value={embedVideoData.posterUrl}
                            label="Poster URL link:"
                            type="text"
                            disabled={(isVerifyingPosterUrl === true)}
                            InputLabelProps={{
                                shrink: true
                            }}
                            onChange={(e) => {
                                setEmbedVideoData((prevState) => { return { ...prevState, posterUrl: e.target.value }; });
                                setIsPosterUrlValid(null);
                            }}
                            onFocus={event => {
                                event.target.select();
                            }}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <InputLink
                            isVerified={isVideoUrlValid}
                            isVerifying={false}
                            icon={<Icon path={mdiVideo} size={ICON_SIZE} />}
                            buttonLabel="Verify Video link"
                            onVerifyLink={verifyVideoUrl}
                            fullWidth
                            id="embed-video-video-url"
                            name="embed-video-video-url"
                            variant="outlined"
                            size='small'
                            value={embedVideoData.videoUrl}
                            label="Video URL link:"
                            type="text"
                            InputLabelProps={{
                                shrink: true
                            }}
                            onChange={(e) => {
                                setEmbedVideoData((prevState) => { return { ...prevState, videoUrl: e.target.value }; });
                                setIsVideoUrlValid(null);
                            }}
                            onFocus={event => {
                                event.target.select();
                            }}
                        />
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogContent>
                <Grid container alignItems='center' justifyContent='center'>
                    <Grid item xs={12}>
                        {!loadedVideoData && <VideoListLoader path={appData.videosURL} onVideoData={handleVideoData} />}
                        {loadedVideoData && <VideosGrid videoLinks={loadedVideoData} onVideoSelected={(src) => {
                            setEmbedVideoData({ videoUrl: src.video, posterUrl: src.poster });
                            setIsPosterUrlValid(null);
                            setIsVideoUrlValid(null);
                        }} />}
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogContent sx={{ overflowY: 'unset' }}>
                <Grid container alignItems='center' gap={2}>
                    <Grid item>
                        <Typography variant='body1'>Embed Video requires 2 URLs to be entered. Video link and Poster link.</Typography>
                        <Typography variant='subtitle2'>Note: Both 'Poster' and 'Video' URLs must be verified before inserting!</Typography>
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button
                    disabled={(isVerifyingPosterUrl === true) || (isPosterUrlValid !== true) || (isVideoUrlValid !== true)}
                    onClick={() => {
                        onConfirm(embedVideoData);
                    }}
                    variant="text"
                    color="primary"
                    size="small"
                    startIcon={<Icon path={mdiCheck} size={1} />}
                >
                    Insert Embed Video
                </Button>
            </DialogActions>
        </Dialog >
    );
}
