export const StatBlock = ({name, stat}: { name: string; stat: string}) => {
  return (
    <div className='flex flex-col gap-2 text-lg'>
        <p>{name}</p>
        <p>{stat}</p>
    </div>
  )
}
