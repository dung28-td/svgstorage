import useQuery from "@/hooks/useQuery"
import Icon from "./Icon"
import { FixedSizeGrid, GridOnItemsRenderedProps, areEqual } from "react-window"
import { memo, useCallback, useMemo, useRef } from "react"
import useLayout from "@/hooks/useLayout"
import { GridChildComponentProps } from "react-window"
import { useSharedState, useRerender } from "react-hooks-toolkit"
import { iconSetState, keywordState, variantState } from "@/shared/states"
import Spinner from "./Spinner"

const COL = 8
const LIMIT = 64

function Cell({ data, columnIndex, rowIndex, style }: GridChildComponentProps<Icon[]>) {
  const icon = data[rowIndex * COL + columnIndex]

  if (!icon) return null

  return (
    <div
      className="flex items-center justify-center p-2"
      style={style}
    >
      <Icon {...icon} />
    </div>
  )
}

const MemoCell = memo(Cell, areEqual)

export default function IconGrid() {
  const ref = useRef<HTMLDivElement>(null)
  const { contentBoxSize } = useLayout(ref)
  const [keyword] = useSharedState(keywordState)
  const [iconSet] = useSharedState(iconSetState)
  const [variant] = useSharedState(variantState)
  const { loading, data, hasNextPage, fetchMore } = useIcons({ keyword, iconSet, variant })

  // force remount grid when new data comes
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const gridKey = useMemo(() => Math.random(), [data])

  return (
    <div ref={ref} className="w-full max-w-5xl flex-1 overflow-hidden">
      {contentBoxSize?.width && data && (
        <FixedSizeGrid
          key={gridKey}
          columnCount={COL}
          columnWidth={contentBoxSize.width / COL}
          rowCount={Math.ceil(data.length / COL)}
          rowHeight={120}
          width={contentBoxSize.width}
          height={contentBoxSize.height}
          itemData={data}
          {...(hasNextPage && !loading && {
            onItemsRendered: fetchMore
          })}
        >
          {MemoCell}
        </FixedSizeGrid>
      )}
      {loading && (
        <div className="flex justify-center">
          <Spinner />
        </div>
      )}
    </div>
  )
}

interface IconFilters {
  keyword?: string
  iconSet?: string
  variant?: string
}

const useIcons = ({ keyword, iconSet, variant }: IconFilters) => {
  const offsetRef = useRef(0)
  const lastOverscanRowStopIndex = useRef<number>()

  // reset offset when filters changed
  useMemo(() => {
    offsetRef.current = 0
    lastOverscanRowStopIndex.current = undefined
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keyword, iconSet, variant])

  const offset = offsetRef.current
  const limit = LIMIT
  const query = useMemo(() => {
    const searchParams = new URLSearchParams()
    searchParams.set('limit', limit.toString())
    searchParams.set('offset', offset.toString())
    if (keyword) searchParams.set('keyword', keyword)
    if (iconSet) searchParams.set('iconSet', iconSet)
    if (variant) searchParams.set('variant', variant)
    return searchParams.toString()
  }, [keyword, iconSet, variant, offset, limit])

  const { loading, data } = useQuery<Icon[]>(`/api/icons?${query}`)

  const icons = useRef<Icon[]>()
  const prevData = useRef<Icon[]>()

  if (data && prevData.current !== data) {
    prevData.current = data
    if (offset === 0) icons.current = []
    icons.current ||= []
    icons.current.push(...data)
  }

  const rerender = useRerender()
  const fetchMore = useCallback(({ overscanRowStopIndex }: GridOnItemsRenderedProps) => {
    const rowCount = Math.ceil((icons.current || []).length / COL)
    if (overscanRowStopIndex < rowCount - 1) return
    if (lastOverscanRowStopIndex.current === overscanRowStopIndex) return
    lastOverscanRowStopIndex.current = overscanRowStopIndex
    offsetRef.current += limit
    rerender()
  }, [rerender, limit])

  return {
    loading,
    fetchMore,
    data: icons.current,
    hasNextPage: data?.length === limit,
  }
}
