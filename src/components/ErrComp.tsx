import { Link } from "@tanstack/react-router";

export const ErrComp = () => {
    return (
        <div className="flex h-full flex-col items-center justify-center gap-5">
            <div className="flex flex-col gap-2">
                <p>There was an error!</p>
                <p>Please go to the Homepage.</p>
            </div>
            <Link className="btn btn-primary" to="/">
                Home
            </Link>
            <p className="text-sm text-secondary">Note: You might need to click twice!</p>
        </div>
    );
};
