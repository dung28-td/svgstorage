import { useMemo } from "react"

interface Props extends Icon {
}

export default function Icon({ iconSet, variant, name }: Props) {
  const path = `/icon-sets/${iconSet}/${variant}/${name}.svg`

  const style = useMemo(() => ({
    maskImage: `url(${path})`,
    WebkitMaskImage: `url(${path})`
  }), [path])

  return (
    <div className="flex flex-col overflow-hidden">
      <div className="p-3 rounded-md self-center bg-white dark:dark:bg-zinc-800/30 border border-slate-900/[0.08] dark:border-neutral-800">
        <div
          className="bg-slate-900 dark:bg-white w-6 h-6"
          style={style}
        />
      </div>
      <div className="mt-2 text-center text-slate-500 text-xs truncate">
        {name}
      </div>
    </div>
  )
}