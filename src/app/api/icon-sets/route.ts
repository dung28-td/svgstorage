import { readdirSync } from 'fs'
import { resolve } from 'path'
import { NextResponse } from 'next/server'

export const iconSets = readdirSync(resolve('public', 'icon-sets')).reduce<Record<string, string[]>>((result, iconSet) => {
  const variants = readdirSync(resolve('public', 'icon-sets', iconSet))
  result[iconSet] = variants
  return result
}, {})

export async function GET(request: Request) {
  return NextResponse.json(iconSets)
}
