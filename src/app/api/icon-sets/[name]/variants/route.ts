import { readdirSync } from "fs";
import { NextResponse } from "next/server";
import { resolve } from "path";

export function GET(request: Request, { params }: {
  params: { name: string }
}) {
  try {
    const variants = readdirSync(resolve('public', 'icon-sets', params.name))
    return NextResponse.json(variants)
  } catch (error) {
    return NextResponse.json(error, { status: 404 })
  }
}