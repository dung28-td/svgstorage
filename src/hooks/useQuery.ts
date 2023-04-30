import { canUseDOM } from "@/utils"
import { useCallback, useRef, useState } from "react"

export default function useQuery<T>(api: string) {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<T>()

  const fetcher = useCallback(async (api: string) => {
    setLoading(true)

    const res = await fetch(api)
    const data = await res.json()

    setData(data)
    setLoading(false)
  }, [])

  const prevApi = useRef<string>()
  if (canUseDOM && prevApi.current !== api) {
    fetcher(api)
    prevApi.current = api
  }

  return { loading, data }
}