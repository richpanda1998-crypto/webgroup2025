import { NextResponse } from "next/server"
import { cache } from "@/lib/cache"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

/**
 * GET /api/cache - 获取缓存统计信息
 */
export async function GET() {
  try {
    const stats = cache.getStats()
    return NextResponse.json({
      success: true,
      data: stats,
      message: "缓存统计信息获取成功",
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "获取缓存统计失败",
      },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/cache - 清空所有缓存
 */
export async function DELETE() {
  try {
    cache.clear()
    return NextResponse.json({
      success: true,
      message: "缓存已清空",
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "清空缓存失败",
      },
      { status: 500 }
    )
  }
}
