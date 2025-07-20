export const Scenes = ({ children }: { children: React.ReactNode }) => {
    return (
        <>
            <h3 className="text-xl font-bold">Scene</h3>
            <div className="grid gap-2 p-2">{children}</div>
        </>
    );
};
