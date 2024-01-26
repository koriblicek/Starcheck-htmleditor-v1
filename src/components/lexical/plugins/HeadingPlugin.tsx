import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { $getRoot } from 'lexical';
import { useState } from 'react';

export function HeadingPlugin() {

    const [editor] = useLexicalComposerContext();

    const [heading, setHeading] = useState('');

    const handleChange = (event: SelectChangeEvent) => {
        editor.update(() => {
            const root = $getRoot();
            console.log(root.getAllTextNodes());
        });
        setHeading(event.target.value);
        console.log(event.target.value);
    };

    return (
        <FormControl size="small" fullWidth variant="outlined" >
            <InputLabel id="heading-label">Heading</InputLabel>
            <Select
                labelId="heading-label"
                id="demo-select-small"
                value={heading}
                label="Heading"
                onChange={handleChange}
                sx={{p:0}}
            >
                <MenuItem value='p'>Normal</MenuItem>
                <MenuItem value='h1'>Heading 1</MenuItem>
                <MenuItem value='h2'>Heading 2</MenuItem>
            </Select>
        </FormControl>
    );
}
