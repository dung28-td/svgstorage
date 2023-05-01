'use client'

import IconGrid from '@/components/IconGrid'
import Search from '@/components/Search'
import Filters from '@/components/Filters'

export default function Home() {
  return (
    <main className="flex h-screen flex-col items-center justify-between p-8">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex space-x-4">
        <Search />
        <Filters />
      </div>

      <div className="relative flex place-items-center before:absolute before:h-[300px] before:w-[480px] before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-[240px] after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700 before:dark:opacity-10 after:dark:from-sky-900 after:dark:via-[#0141ff] after:dark:opacity-40 before:lg:h-[360px] lg:my-8 mt-16 mb-5">
        <h1 className="relative text-4xl font-semibold drop-shadow-[0_0_0.3rem_#ffffff70]">
          svgstorage
        </h1>
      </div>

      <IconGrid />
    </main>
  )
}
