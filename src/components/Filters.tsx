import useQuery from "@/hooks/useQuery";
import { clsx, unique } from "@/utils";
import Spinner from "./Spinner";
import { useMemo } from "react";
import { useSharedState } from "react-hooks-toolkit";
import { iconSetState, variantState } from "@/shared/states";
import Dropdown from "./Dropdown";

export default function Filters() {
  const [variant, setVariant] = useSharedState(variantState)
  const [iconSet, setIconSet] = useSharedState(iconSetState)
  const { loading, data } = useQuery<IconSets>('/api/icon-sets')

  const variants = useMemo(() => {
    if (!data) return []
    const allVariants = Object.keys(data).reduce<string[]>((result, iconSet) => [...result, ...data[iconSet]], [])
    return unique(allVariants)
  }, [data])

  if (loading) return <Spinner />

  return (
    <div className="flex space-x-4 items-center">
      <Dropdown
        options={Object.keys(data!)}
        value={iconSet}
        onChange={setIconSet}
      />
      <div className="flex space-x-1 rounded-xl bg-blue-900/20 p-[3px]">
        {[undefined, ...variants].map(v => {
          const selected = variant === v

          return (
            <button
              key={v || 'all'}
              onClick={() => setVariant(v)}
              className={clsx(
                  'w-20 rounded-lg py-2 text-sm font-medium leading-5 text-white',
                  'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2',
                  selected
                    ? 'bg-white !text-slate-500 shadow'
                    : 'hover:bg-white/[0.12] hover:text-white focus:bg-white/[0.12] focus:text-white'
                )
              }
            >
              {v || 'all'}
            </button>
          )
        })}
      </div>
    </div>
  )
}