import { Button, Card, CardContent, Chip, Divider, Grid, Menu, MenuItem, Typography } from '@mui/material';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { mdiChevronDown } from '@mdi/js';
import { ICON_SIZE } from 'src/types';
import Icon from '@mdi/react';

export interface IClassesSelectionProps {
    componentClasses: string;
    availableClasses: string[];
    updateComponentClasses: (classes: string) => void;
    open: boolean;
}

function getArrayFromString(s: string): string[] {
    return s.split(" ").filter(item => item !== '');
}

export function ClassesSelection({ componentClasses, availableClasses, updateComponentClasses, open }: IClassesSelectionProps) {

    const [anchorEl, setAnchorEl] = useState<null | Element>(null);

    const [listClasses, setListClasses] = useState<string[]>([]);

    useEffect(() => {
        if (open) {
            setListClasses(getArrayFromString(componentClasses));
        }
    }, [componentClasses, open]);

    const onOpenMenu = useCallback((event: React.MouseEvent) => {
        setAnchorEl(event.currentTarget);
    }, []);

    const handleCloseMenu = useCallback(() => {
        setAnchorEl(null);
    }, []);


    const chips = useMemo(() => {
        return listClasses.map((item, index) => {
            return (
                <Grid key={index}>
                    <Chip label={item} variant="outlined" size="small" color={availableClasses.includes(item) ? "primary" : "warning"} onDelete={() => {
                        const data = listClasses.filter(data => data !== item);
                        updateComponentClasses(data.join(" "));
                        setListClasses(data);
                    }} />
                </Grid>
            );
        });
    }, [listClasses, availableClasses, updateComponentClasses]);

    const menuItems = useMemo(() => {
        return (<Menu
            id="list-classes-menu"
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleCloseMenu}
            disableAutoFocusItem
        >
            {availableClasses.map((className) => {
                return (
                    <MenuItem
                        onClick={() => {
                            if (!listClasses.includes(className)) {
                                updateComponentClasses([...listClasses, className].join(" "));
                                setListClasses(prevValue => [...prevValue, className]);
                            }
                            handleCloseMenu();
                        }}
                        disabled={listClasses.includes(className)}
                        key={className}
                        sx={{ py: 0 }}
                    >
                        {<Typography variant='subtitle1' sx={{ px: 0.5 }}>{className}</Typography>}
                    </MenuItem>
                );
            })}


        </Menu>
        );
    }, [availableClasses, anchorEl, handleCloseMenu, listClasses, updateComponentClasses]);


    return (
        <Card>
            <CardContent sx={{ p: 1 }} >
                <Grid container gap={1}>
                    {/* <Grid item xs={12}>
                <TextField fullWidth autoFocus id="figure-classes" name="figure-classes" variant="outlined" size='small' value={componentClasses} type="text"
                    onChange={(e) => {

                    }}
                    label="Figure classes:"
                    InputLabelProps={{
                        shrink: true
                    }}
                />
            </Grid> */}
                    <Grid item xs={12}>
                        <Typography>Select CSS classes for component:</Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Button
                            fullWidth
                            disabled={availableClasses.length === 0}
                            variant='outlined'
                            color="primary"
                            endIcon={<Icon path={mdiChevronDown} size={ICON_SIZE} />}
                            title=''
                            onClick={(e) => onOpenMenu(e)}
                        >Pre-defined class</Button>
                    </Grid>
                    <Grid item xs={12}>
                        <Divider />
                    </Grid>
                    <Grid item xs={12}>
                        {chips.length === 0 && <Chip label="undefined" variant="outlined" size="small" color="default" />}
                        {chips &&
                            <Grid container gap={1}>
                                {chips}
                            </Grid>
                        }
                    </Grid>
                    {menuItems}
                </Grid>
            </CardContent>
        </Card>
    );
}
