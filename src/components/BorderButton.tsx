export const BorderButton = ({ text, style, event }: {text: string, style: string, event?: () => void}) => {
    return (
        <button
            className={`btn btn-ghost m-0 h-min min-h-0 border-2 px-4 py-2 hover:text-base-100 [&.active]:font-bold ${style}`}
            onClick={event}
        >
            {text}
        </button>
    );
};
