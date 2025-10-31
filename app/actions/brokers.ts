"use server"

import { getAllBrokersFromDB, getBrokerByCodeFromDB } from "@/lib/db"
import type { BrokerParsed } from "@/lib/types"

function parseBrokerData(broker: any): BrokerParsed {
  return {
    ...broker,
    whychose: parseWhyChoseField(broker.whychose),
    safe: parseSafeField(broker.safe),
    pros: parseProsField(broker.pros),
    faq: parseFAQField(broker.faq),
  }
}

function parseWhyChoseField(field: any): any {
  const parsed = parseJSONField(field)
  if (!parsed) return null
  
  // 格式 1: part1/part2/part3 格式 (Bell Potter 新格式)
  if (parsed.part2 && Array.isArray(parsed.part2)) {
    // part2 是主要内容数组，转换为 {title, description} 格式
    return parsed.part2.map((item: string, index: number) => ({
      title: `Key Point ${index + 1}`,
      description: item
    }))
  }
  
  // 格式 2: 已经是数组格式 [{title, description}]
  if (Array.isArray(parsed)) {
    // 检查是否每个项目都有 title 和 description
    const isValid = parsed.every(item => 
      item && typeof item === 'object' && (item.title || item.description)
    )
    if (isValid) return parsed
  }
  
  // 格式 3: 对象格式，尝试提取数组
  if (typeof parsed === 'object' && !Array.isArray(parsed)) {
    // 尝试各种可能的键名
    if (parsed.reasons && Array.isArray(parsed.reasons)) {
      return parsed.reasons
    }
    if (parsed.items && Array.isArray(parsed.items)) {
      return parsed.items
    }
    if (parsed.features && Array.isArray(parsed.features)) {
      return parsed.features
    }
    if (parsed.whychose && Array.isArray(parsed.whychose)) {
      return parsed.whychose
    }
    if (parsed.why_choose && Array.isArray(parsed.why_choose)) {
      return parsed.why_choose
    }
    
    // 如果对象有 title 和 description，转换为数组
    if (parsed.title || parsed.description) {
      return [parsed]
    }
  }
  
  return null
}

function parseJSONField(field: any): any {
  if (!field) return null
  
  // If already an object (JSONB auto-parsed), return directly
  if (typeof field === 'object') return field
  
  // If string, try to parse
  if (typeof field === 'string') {
    try {
      return JSON.parse(field)
    } catch {
      return null
    }
  }
  
  return null
}

function parseFAQField(field: any): any {
  const parsed = parseJSONField(field)
  if (!parsed || !Array.isArray(parsed)) return null
  
  // Convert {q, a} format to {question, answer} format
  return parsed.map((item: any) => ({
    question: item.q || item.question || '',
    answer: item.a || item.answer || '',
  }))
}

function parseProsField(field: any): any {
  const parsed = parseJSONField(field)
  if (!parsed) return null
  
  // If array, convert to {pros: [], cons: []} format
  if (Array.isArray(parsed)) {
    return {
      pros: parsed,
      cons: []
    }
  }
  
  // 如果已经是对象格式，检查多种可能的键名
  if (typeof parsed === 'object') {
    // 标准格式：{pros: [], cons: []}
    if (parsed.pros || parsed.cons) {
      return {
        pros: parsed.pros || [],
        cons: parsed.cons || []
      }
    }
    
    // 替代格式：{advantages: [], disadvantages: []}
    if (parsed.advantages || parsed.disadvantages) {
      return {
        pros: parsed.advantages || [],
        cons: parsed.disadvantages || []
      }
    }
    
    // 替代格式：{优点: [], 缺点: []}
    if (parsed['优点'] || parsed['缺点']) {
      return {
        pros: parsed['优点'] || [],
        cons: parsed['缺点'] || []
      }
    }
    
    // 嵌套格式：{pros_cons: {pros: [], cons: []}}
    if (parsed.pros_cons) {
      return {
        pros: parsed.pros_cons.pros || [],
        cons: parsed.pros_cons.cons || []
      }
    }
  }
  
  return null
}

function parseSafeField(field: any): any {
  const parsed = parseJSONField(field)
  if (!parsed) return null
  
  // 格式 0: part1/part2 格式 (Bell Potter 新格式)
  if (parsed.part2 && Array.isArray(parsed.part2)) {
    return {
      is_safe: true, // 默认为安全
      reasons: parsed.part2
    }
  }
  
  // 格式 1: 简单格式 {is_safe, reasons}
  if (parsed.is_safe !== undefined && parsed.reasons) {
    return {
      is_safe: parsed.is_safe,
      reasons: Array.isArray(parsed.reasons) ? parsed.reasons : [parsed.reasons]
    }
  }
  
  // 格式 2: 嵌套格式 {safe: {is_safe, reasons}}
  if (parsed.safe && typeof parsed.safe === 'object') {
    if (parsed.safe.is_safe !== undefined && parsed.safe.reasons) {
      return {
        is_safe: parsed.safe.is_safe,
        reasons: Array.isArray(parsed.safe.reasons) ? parsed.safe.reasons : [parsed.safe.reasons]
      }
    }
  }
  
  // 格式 3: 只有 reasons 数组，默认为安全
  if (parsed.reasons && Array.isArray(parsed.reasons) && parsed.reasons.length > 0) {
    return {
      is_safe: true,
      reasons: parsed.reasons
    }
  }
  
  // 格式 4: safety_analysis 格式
  if (parsed.safety_analysis) {
    const analysis = parsed.safety_analysis
    return {
      is_safe: analysis.is_safe !== undefined ? analysis.is_safe : true,
      reasons: Array.isArray(analysis.reasons) ? analysis.reasons : 
               analysis.summary ? [analysis.summary] : []
    }
  }
  
  // 格式 5: 复杂的嵌套结构 safety_module
  if (parsed.safety_module) {
    const safetyModule = parsed.safety_module
    
    // 尝试从 safety_score 提取安全评分
    const isSafe = safetyModule.safety_score?.overall_rating >= 70
    
    // 收集所有 reasons
    const reasons: string[] = []
    
    // 从 fund_security 提取
    if (safetyModule.fund_security?.security_summary) {
      reasons.push(safetyModule.fund_security.security_summary)
    }
    
    // 从 regulatory_compliance 提取
    if (safetyModule.regulatory_compliance?.regulation_summary) {
      reasons.push(safetyModule.regulatory_compliance.regulation_summary)
    }
    
    // 从 operational_stability 提取
    if (safetyModule.operational_stability?.stability_summary) {
      reasons.push(safetyModule.operational_stability.stability_summary)
    }
    
    if (reasons.length > 0) {
      return {
        is_safe: isSafe,
        reasons: reasons
      }
    }
  }
  
  // 格式 6: 直接是字符串数组，当作 reasons
  if (Array.isArray(parsed) && parsed.length > 0 && typeof parsed[0] === 'string') {
    return {
      is_safe: true,
      reasons: parsed
    }
  }
  
  return null
}

export async function getAllBrokers(): Promise<BrokerParsed[]> {
  try {
    const brokers = await getAllBrokersFromDB()
    return brokers.map(parseBrokerData)
  } catch (error) {
    console.error("[v0] Error fetching brokers:", error)
    return []
  }
}

export async function getBrokerByCode(code: string): Promise<BrokerParsed | null> {
  try {
    const broker = await getBrokerByCodeFromDB(code)
    return broker ? parseBrokerData(broker) : null
  } catch (error) {
    console.error("[v0] Error fetching broker:", error)
    return null
  }
}
