import useQuery from "@/hooks/useQuery"
import Icon from "./Icon"
import { FixedSizeGrid, GridOnItemsRenderedProps, areEqual } from "react-window"
import { memo, useCallback, useMemo, useRef } from "react"
import useLayout from "@/hooks/useLayout"
import { GridChildComponentProps } from "react-window"
import { useSharedState, useRerender } from "react-hooks-toolkit"
import { keywordState } from "@/shared/states"

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
  const { loading, data, hasNextPage, fetchMore } = useIcons({ keyword })

  // force remount grid when new data comes
  const gridKey = useMemo(() => crypto.randomUUID(), [data])

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
          <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        </div>
      )}
    </div>
  )
}

interface IconFilters {
  keyword?: string
}

const useIcons = ({ keyword }: IconFilters) => {
  const offsetRef = useRef(0)

  // reset offset when filters changed
  useMemo(() => {
    offsetRef.current = 0
  }, [keyword])

  const offset = offsetRef.current
  const limit = LIMIT
  const query = useMemo(() => {
    const searchParams = new URLSearchParams()
    searchParams.set('limit', limit.toString())
    searchParams.set('offset', offset.toString())
    if (keyword) searchParams.set('keyword', keyword)
    return searchParams.toString()
  }, [keyword, offset, limit])

  const { loading, data } = useQuery<Icon[]>(`/api/icons?${query}`)

  const icons = useRef<Icon[]>()
  const prevData = useRef<Icon[]>()

  if (data && prevData.current !== data) {
    prevData.current = data
    icons.current ||= []
    if (offset === 0) icons.current = [...data]
    else icons.current.push(...data)
  }

  const rerender = useRerender()
  const lastOverscanRowStopIndex = useRef<number>()
  const fetchMore = useCallback(({ overscanRowStopIndex }: GridOnItemsRenderedProps) => {
    const rowCount = Math.ceil((icons.current || []).length / COL)
    if (overscanRowStopIndex < rowCount - 1) return
    if (lastOverscanRowStopIndex.current === overscanRowStopIndex) return
    lastOverscanRowStopIndex.current = overscanRowStopIndex
    offsetRef.current += limit
    rerender()
  }, [rerender])

  return {
    loading,
    fetchMore,
    data: icons.current,
    hasNextPage: data?.length === limit,
  }
}
