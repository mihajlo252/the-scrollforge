export const GM = ({className, children} : {className?: string, children: React.ReactNode}) => {
  return (
    <div className={`text-accent ${className}`}>{children}</div>
  )
}
