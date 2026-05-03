import { Icon } from "./Primitives";

// import { useNavigate } from "@tanstack/react-router";
export const DeleteButton = ({
    size,
    styles,
    event,
}: {
    size: number;
    styles: string;
    event: () => void;
}) => {
    // const navigate = useNavigate();

    return (
        <button className="button" onClick={event}>
            <Icon name="trash" size={32}/>
        </button>
    );
};
