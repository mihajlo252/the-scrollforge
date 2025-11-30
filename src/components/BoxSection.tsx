export const BoxSection = ({styles, children}: {styles?: string, children: React.ReactNode}) => {
  return (
    <div className={`flex rounded-[50px] corner-squircle h-full border-2 bg-opacity-70 border-slate-900 bg-base-300 text-neutral ${styles}`}>
      {children}
    </div>
  )
}
