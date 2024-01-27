import { ToggleButton, ToggleButtonProps } from "@mui/material";
import { useCallback } from "react";

interface IToolbarToggleButtonProps extends ToggleButtonProps {
    label: JSX.Element;
    onClick: (event: React.MouseEvent) => void;
}

export default function ToolbarToggleButton({ label, onClick, ...props }: IToolbarToggleButtonProps) {
    const handleClick = useCallback((event: React.MouseEvent) => {
        event.preventDefault();
        onClick(event);
    }, [onClick]);

    return (
        <ToggleButton {...props}
            onMouseDown={handleClick}
            sx={Object.assign({ borderRadius: 1, backgoundColor:'white' }, props.size ? {} : { p: 0.5 })}
        >
            {label}
        </ToggleButton>
    );
}