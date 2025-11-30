export const BorderButton = ({ text, style, event, children, disabled }: {text?: string, style: string, event?: () => void, children?: React.ReactNode, disabled?: boolean}) => {
    return (
        <button
            type="button"   
            className={`btn btn-ghost m-0 h-min min-h-0 border-2 px-4 py-2 hover:text-base-100 [&.active]:font-bold ${style}`}
            onClick={event}
            disabled={disabled}
        >
            {text}
            {children}
        </button>
    );
};
