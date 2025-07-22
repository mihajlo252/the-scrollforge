export const Scenes = ({heading, children }: {heading: React.ReactNode; children: React.ReactNode }) => {
    return (
        <>
            <h3 className="text-xl font-bold">{heading}</h3>
            <div className="grid gap-2 p-2">{children}</div>
        </>
    );
};
