import { keywordState } from '@/shared/states'
import { useSharedState } from 'react-hooks-toolkit'

export default function Search() {
  const [value, setValue] = useSharedState(keywordState)

  return (
    <div className="fixed left-0 top-0 flex w-full items-center justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto lg:rounded-xl lg:border lg:bg-gray-200 lg:px-4 lg:py-0 lg:dark:bg-zinc-800/30">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
      </svg>

      <input
        type='text'
        className='bg-transparent border-0 focus:ring-0'
        placeholder="Search icon"
        value={value}
        onChange={e => setValue(e.currentTarget.value)}
      />
    </div>
  )
}