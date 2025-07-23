export const GM = ({className, children} : {className?: string, children: React.ReactNode}) => {
  return (
    <p className={`text-accent ${className}`}>{children}</p>
  )
}
