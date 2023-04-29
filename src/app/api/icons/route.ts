import { readdirSync } from "fs";
import { NextResponse } from "next/server";
import { resolve } from "path";

interface Icon {
  name: string
  iconSet: string
  variant: string
}

const icons = readdirSync(resolve('public', 'icon-sets')).reduce<Icon[]>((result, iconSet) => {
  readdirSync(resolve('public', 'icon-sets', iconSet)).forEach(variant => {
    readdirSync(resolve('public', 'icon-sets', iconSet, variant)).forEach(filename => {
      const name = filename.replace('.svg', '')
      result.push({ name, variant, iconSet })
    })
  })
  return result
}, [])


interface IconsSearchParams {
  keyword?: string
  iconSet?: string
  variant?: string
  limit?: number
  offset?: number
}

const normalizeString = (str: string) => str.trim().toLowerCase()

export function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const { keyword, iconSet, variant, limit = 50, offset = 0 } = Array.from(searchParams.entries()).reduce<IconsSearchParams>((result, [key, value]) => {
    switch (key) {
      case 'limit':
        result.limit = parseInt(value) || undefined
        break
      case 'offset':
        result.offset = parseInt(value) || undefined
        break
      default:
        result[key as keyof Omit<IconsSearchParams, 'limit' | 'offset'>] = value
        break
    }

    return result
  }, {  })

  let data = icons
  if (iconSet) data = data.filter(i => i.iconSet === iconSet)
  if (variant) data = data.filter(i => i.variant === variant)
  if (keyword) data = data.filter(i => normalizeString(i.name).indexOf(normalizeString(keyword))  > -1)

  return NextResponse.json(data.slice(offset, offset + limit))
}