import { clsx } from "@/utils"
import { useState } from "react"

interface Props {
  options: string[]
  value: string | undefined
  onChange: (value: string | undefined) => void
}

export default function Dropdown({ options, value, onChange }: Props) {
  const [open, setOpen] = useState(false)

  return (
    <div className="relative inline-block text-left">
      <div>
        <button
          type="button"
          className="inline-flex w-full justify-center gap-x-1.5 px-3 py-2 text-sm font-semibold hover:bg-gray-50 hover:text-gray-900 rounded-md"
          id="menu-button"
          aria-expanded="true"
          aria-haspopup="true"
          onClick={() => setOpen(!open)}
        >
          {value || 'all'}
          <svg className="-mr-1 h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
          </svg>
        </button>
      </div>

      <div
        className={clsx(
          "absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none",
          !open && 'hidden',
        )}
        role="menu"
        aria-orientation="vertical"
        aria-labelledby="menu-button"
        tabIndex={-1}
      >
        <div className="py-1" role="none">
          {[undefined, ...options].map(o => (
            <button
              key={o || 'all'}
              className={clsx("w-full block px-4 py-2 text-sm", value !== o ? 'text-gray-700' : 'bg-gray-100 text-gray-900')}
              role="menuitem"
              tabIndex={-1}
              id={"menu-item-" + (o || 'all')}
              onClick={() => {
                onChange(o)
                setOpen(false)
              }}
            >
              {o || 'all'}
            </button>
          ))}

        </div>
      </div>
    </div>
  )
}