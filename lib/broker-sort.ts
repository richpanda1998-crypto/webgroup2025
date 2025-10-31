import { extractRegulators } from "./license-parser"
import type { BrokerParsed } from "./types"

/**
 * 监管机构权重映射（权重越高，监管力度越大）
 */
const regulatorWeights: Record<string, number> = {
  FCA: 100,      // 英国金融行为监管局 - 最严格
  ASIC: 95,      // 澳大利亚证券投资委员会
  CySEC: 90,     // 塞浦路斯证券交易委员会
  DFSA: 85,      // 迪拜金融服务管理局
  BaFin: 85,     // 德国联邦金融监管局
  SFC: 85,       // 香港证券及期货事务监察委员会
  SVFSC: 80,     // 圣文森特金融服务管理局
  MAS: 80,       // 新加坡金融管理局
  FSCA: 75,      // 南非金融部门行为管理局
  NFA: 75,       // 美国国家期货协会
  SC: 70,        // 马来西亚证券委员会
  SEA: 70,       // 泰国证券交易委员会
  FSP: 65,       // 南非金融服务提供者
  iFSC: 60,      // 贝利兹国际金融服务委员会
  VFSC: 60,      // 瓦努阿图金融服务委员会
  BVI: 55,       // 英属维尔京群岛
  FCMC: 50,      // 库拉索中央银行
  FNRA: 45,      // 斐济国家银行和监管局
  Regulated: 30, // 通用监管
}

/**
 * 获取监管机构的平均权重
 */
function getAverageRegulatorWeight(regulators: string[]): number {
  if (regulators.length === 0) return 0
  const totalWeight = regulators.reduce((sum, reg) => sum + (regulatorWeights[reg] || 0), 0)
  return totalWeight / regulators.length
}

/**
 * 解析运营时间（年份）
 * 例如: "15-20 years" => 17.5, "5-10 years" => 7.5, "15+ years" => 15
 */
function parseOperatingYears(operatingPeriod: string | null | undefined): number {
  if (!operatingPeriod) return 0

  const period = operatingPeriod.toLowerCase().trim()

  // 匹配 "X-Y years" 格式
  const rangeMatch = period.match(/(\d+)\s*-\s*(\d+)\s*years?/i)
  if (rangeMatch) {
    const start = parseInt(rangeMatch[1])
    const end = parseInt(rangeMatch[2])
    return (start + end) / 2
  }

  // 匹配 "X+ years" 格式
  const plusMatch = period.match(/(\d+)\s*\+?\s*years?/i)
  if (plusMatch) {
    return parseInt(plusMatch[1])
  }

  return 0
}

/**
 * 最佳监管排序
 * 1. 按牌照数量排序（多多好）
 * 2. 相同牌照数量的情况，按监管力度排序（权重高好）
 * 3. 相同监管力度的情况，按分数排序
 */
export function sortByRegulation(brokers: BrokerParsed[]): BrokerParsed[] {
  return [...brokers].sort((a, b) => {
    const aRegulators = extractRegulators(a.license_info)
    const bRegulators = extractRegulators(b.license_info)

    // 1. 先按牌照数量排序（降序）
    const licenseCountDiff = bRegulators.length - aRegulators.length
    if (licenseCountDiff !== 0) return licenseCountDiff

    // 2. 牌照数量相同，按监管力度排序（降序）
    const aWeight = getAverageRegulatorWeight(aRegulators)
    const bWeight = getAverageRegulatorWeight(bRegulators)
    const weightDiff = bWeight - aWeight
    if (weightDiff !== 0) return weightDiff

    // 3. 监管力度相同，按分数排序（降序）
    return b.total_score - a.total_score
  })
}

/**
 * 最高评分排序
 * 直接按分数排序（降序）
 */
export function sortByScore(brokers: BrokerParsed[]): BrokerParsed[] {
  return [...brokers].sort((a, b) => b.total_score - a.total_score)
}

/**
 * 最有经验排序
 * 1. 按运营时间排序（长好）
 * 2. 相同运营时间的情况，按分数排序
 */
export function sortByExperience(brokers: BrokerParsed[]): BrokerParsed[] {
  return [...brokers].sort((a, b) => {
    const aYears = parseOperatingYears(a.operating_period)
    const bYears = parseOperatingYears(b.operating_period)

    // 1. 先按运营时间排序（降序）
    const yearsDiff = bYears - aYears
    if (yearsDiff !== 0) return yearsDiff

    // 2. 运营时间相同，按分数排序（降序）
    return b.total_score - a.total_score
  })
}

/**
 * 获取风险交易商
 * 符合以下条件之一的交易商被视为风险：
 * 1. 分数低于 5
 * 2. 没有牌照/许可证
 */
export function getRiskyBrokers(brokers: BrokerParsed[], limit: number = 8): BrokerParsed[] {
  const riskyBrokers = brokers.filter((broker) => {
    const hasLicense = broker.license_info && broker.license_info.trim() !== ""
    const lowScore = broker.total_score < 5
    return lowScore || !hasLicense
  })

  // 按风险程度排序：先显示分数最低的，再显示无牌照的
  return riskyBrokers
    .sort((a, b) => {
      const aHasLicense = a.license_info && a.license_info.trim() !== ""
      const bHasLicense = b.license_info && b.license_info.trim() !== ""

      // 无牌照的优先级更高（更危险）
      if (aHasLicense !== bHasLicense) {
        return aHasLicense ? 1 : -1
      }

      // 相同许可情况下，按分数排序（低分优先）
      return a.total_score - b.total_score
    })
    .slice(0, limit)
}
