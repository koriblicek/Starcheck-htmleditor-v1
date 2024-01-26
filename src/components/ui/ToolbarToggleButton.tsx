import { ToggleButton, ToggleButtonProps } from "@mui/material";
import { useCallback } from "react";

interface IToolbarToggleButtonProps extends ToggleButtonProps {
    icon: JSX.Element;
    onClick: (event: React.MouseEvent) => void;
}

export default function ToolbarToggleButton({ icon, onClick, ...props }: IToolbarToggleButtonProps) {
    const handleClick = useCallback((event: React.MouseEvent) => {
        event.preventDefault();
        onClick(event);
    }, [onClick]);

    return (
        <ToggleButton {...props}
            onMouseDown={handleClick}
            sx={{ p: 0.5, borderRadius: 1 }}
        >
            {icon}
        </ToggleButton>
    );
}