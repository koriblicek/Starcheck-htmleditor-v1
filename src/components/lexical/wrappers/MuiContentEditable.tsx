import styled from "@emotion/styled";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { Grid, Slider } from "@mui/material";
import { Fragment, useState } from "react";

const marks = [
  {
    value: 25,
    label: '25%',
  },
  {
    value: 50,
    label: '50%',
  },
  {
    value: 75,
    label: '75%',
  },
  {
    value: 100,
    label: '100%',
  },
];

function valuetext(value: number) {
  return `${value}%`;
}

export const StyledContentEditable = styled(ContentEditable) <{ width: number; }>`
  position: relative;
  padding: 5px 10px;
  margin: 10px;
  outline: 1px lightgray dashed;
  transition: outline .2s;
  width: calc(${({ width }) => width}% - 20px);
  // maxHeight: '400px',
  // overflowY: 'auto',
  &:focus {
    outline: '1px gray dashed';
  }
`;

export function MuiContentEditable() {
  const [size, setSize] = useState<number>(100);

  const handleChange = (_: Event, newValue: number | number[]) => {
    setSize(newValue as number);
  };

  return (
    <Fragment>
      <Grid container justifyContent='center'>
        <Grid item xs={12}>
          <Grid container justifyContent='center'>
            <StyledContentEditable width={size} />
          </Grid>
        </Grid>
        <Grid item xs={10}>
          <Slider
            onChange={handleChange}
            //valueLabelFormat={valueLabelFormat}
            getAriaValueText={valuetext}
            size="small"
            color="warning"
            step={1}
            min={25}
            max={100}
            value={size}
            aria-label="Small"
            marks={marks}
          />
        </Grid>
      </Grid>
    </Fragment>
  );
}
