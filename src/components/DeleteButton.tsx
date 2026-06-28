import { Icon } from "./Primitives";

export const DeleteButton = ({ event }: { event: () => void }) => {
    return (
        <button className="button" onClick={event}>
            <Icon name="trash" size={32} />
        </button>
    );
};
