export const StatBlock = ({children, name, stat, color }: {children: React.ReactNode; name: string; stat: number; color: string }) => {
  return (
    <div className="grid grid-cols-1 relative place-items-center h-max select-none">
      <p className="col-start-1 row-start-1 col-end-2 row-end-2">{stat}</p>
      <div className={`w-14 aspect-square col-start-1 row-start-1 col-end-2 row-end-2`}>
      {children}
      </div>
      <p className={`bg-${color} rounded-md px-2 text-base-100`}>{name}</p>
    </div>
  );
};
