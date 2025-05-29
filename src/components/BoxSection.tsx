export const BoxSection = ({styles, children}: {styles: string, children: React.ReactNode}) => {
  return (
    <div className={`flex h-full rounded-lg border-2 border-slate-900 bg-base-300 text-neutral ${styles}`}>
      {children}
    </div>
  )
}
