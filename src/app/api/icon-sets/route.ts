import { readdirSync } from 'fs'
import { resolve } from 'path'
import { NextResponse } from 'next/server'

const iconSets = readdirSync(resolve('public', 'icon-sets'))

export async function GET(request: Request) {
  return NextResponse.json(iconSets)
}
