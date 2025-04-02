export const ErrComp = () => {
    return (
        <div className="flex h-full flex-col items-center justify-center gap-5">
            <p>There was an error!<br /> Please go to the Homepage</p>
            <button className="btn btn-primary" onClick={() => window.location.href = "/"}>
                Home
            </button>
        </div>
    );
};
