import useQuery from "@/hooks/useQuery"
import Icon from "./Icon"
import { FixedSizeGrid, GridOnItemsRenderedProps, areEqual } from "react-window"
import { memo, useCallback, useRef, useState } from "react"
import useLayout from "@/hooks/useLayout"
import { GridChildComponentProps } from "react-window"

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
  const [offset, setOffset] = useState(0)
  const { loading, data } = useQuery<Icon[]>(`/api/icons?limit=${LIMIT}&offset=${offset}`)

  const prevData = useRef<Icon[]>()
  const icons = useRef<Icon[]>([])
  if (data && prevData.current !== data) {
    prevData.current = data
    icons.current = [...icons.current, ...data]
  }

  const count = icons.current.length
  const rowCount = Math.ceil(count / COL)
  const hasNextPage = data?.length === LIMIT

  const lastOverscanRowStopIndex = useRef<number>()
  const handleItemsRendered = useCallback(({ overscanRowStopIndex }: GridOnItemsRenderedProps) => {
    if (overscanRowStopIndex < rowCount - 1) return
    if (lastOverscanRowStopIndex.current === overscanRowStopIndex) return
    lastOverscanRowStopIndex.current = overscanRowStopIndex
    setOffset(offset => offset + LIMIT)
  }, [rowCount])

  return (
    <div ref={ref} className="w-full">
      {contentBoxSize?.width && data && (
        <FixedSizeGrid
          columnCount={COL}
          columnWidth={contentBoxSize.width / COL}
          rowCount={rowCount}
          rowHeight={120}
          width={contentBoxSize.width}
          height={400}
          itemData={icons.current}
          {...(hasNextPage && !loading && {
            onItemsRendered: handleItemsRendered
          })}
        >
          {MemoCell}
        </FixedSizeGrid>
      )}
      {loading && <p>Loading...</p>}
    </div>
  )
}