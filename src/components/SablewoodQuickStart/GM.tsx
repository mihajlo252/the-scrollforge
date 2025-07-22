export const GM = ({className, children} : {className?: string, children: React.ReactNode}) => {
  return (
    <span className={`text-accent ${className}`}>{children}</span>
  )
}
