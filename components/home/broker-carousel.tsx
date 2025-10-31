"use client"

import { useEffect, useRef, useMemo } from "react"
import { BrokerRankingCard } from "./broker-ranking-card"
import type { BrokerParsed } from "@/lib/types"

interface BrokerCarouselProps {
  brokers: BrokerParsed[]
}

export function BrokerCarousel({ brokers }: BrokerCarouselProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const scrollPositionRef = useRef(0)
  const animationFrameRef = useRef<number | null>(null)
  const singleWidthRef = useRef(0)

  // 创建无缝循环的数据：原数据 + 原数据 + 原数据
  // 这样用户看不出循环，可以无限滚动
  const loopedBrokers = useMemo(() => {
    if (brokers.length === 0) return []
    // 重复3次以确保无缝循环
    return [...brokers, ...brokers, ...brokers]
  }, [brokers])

  useEffect(() => {
    const container = scrollContainerRef.current
    if (!container || brokers.length === 0) return

    let isAutoScroll = true
    const velocity = 0.5 // 每帧滚动像素数

    // 计算单组卡片的宽度（所有原始卡片+间隙）
    const calculateSingleGroupWidth = () => {
      // 每个卡片宽度 160px (w-40) + gap 16px
      const cardWidth = 160 + 16 // w-40 = 160px, gap-4 = 16px
      return brokers.length * cardWidth
    }

    const singleGroupWidth = calculateSingleGroupWidth()
    singleWidthRef.current = singleGroupWidth

    const autoScroll = () => {
      if (!isAutoScroll || !container) return

      scrollPositionRef.current += velocity

      // 当滚动到第二组的末尾时，平滑重置到第一组
      // 这样用户看不出重置，因为内容相同
      if (scrollPositionRef.current >= singleGroupWidth * 2) {
        scrollPositionRef.current = 0
      }

      container.scrollLeft = scrollPositionRef.current

      animationFrameRef.current = requestAnimationFrame(autoScroll)
    }

    const handleMouseEnter = () => {
      isAutoScroll = false
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }

    const handleMouseLeave = () => {
      isAutoScroll = true
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
      animationFrameRef.current = requestAnimationFrame(autoScroll)
    }

    const handleScroll = () => {
      scrollPositionRef.current = container.scrollLeft
    }

    container.addEventListener("mouseenter", handleMouseEnter)
    container.addEventListener("mouseleave", handleMouseLeave)
    container.addEventListener("scroll", handleScroll)

    // 等待 DOM 完全渲染后再开始滚动
    const timeoutId = setTimeout(() => {
      animationFrameRef.current = requestAnimationFrame(autoScroll)
    }, 100)

    return () => {
      clearTimeout(timeoutId)
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
      container.removeEventListener("mouseenter", handleMouseEnter)
      container.removeEventListener("mouseleave", handleMouseLeave)
      container.removeEventListener("scroll", handleScroll)
    }
  }, [brokers])

  if (brokers.length === 0) return null

  return (
    <div
      ref={scrollContainerRef}
      className="scrollbar-hide relative overflow-x-auto -mx-4 px-4 py-2"
    >
      <div className="flex gap-4 pb-4">
        {loopedBrokers.map((broker, idx) => (
          <BrokerRankingCard key={`${broker.code}-${idx}`} broker={broker} />
        ))}
      </div>
    </div>
  )
}
