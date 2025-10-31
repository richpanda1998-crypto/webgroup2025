/**
 * 从许可证信息中提取监管机构缩写
 * 例如: "ASIC Regulated", "FCA Regulated", "CYSEC Regulated" 等
 */
export function extractRegulators(licenseInfo: string | null | undefined): string[] {
  if (!licenseInfo) return []

  // 常见的监管机构缩写和变体
  const regulatorPatterns = [
    { pattern: /\bFCA\b/gi, code: "FCA" },
    { pattern: /\bASIC\b/gi, code: "ASIC" },
    { pattern: /\bCYSEC\b/gi, code: "CySEC" },
    { pattern: /\bSVFSC\b/gi, code: "SVFSC" },
    { pattern: /\bDFSA\b/gi, code: "DFSA" },
    { pattern: /\bSC\b/gi, code: "SC" },
    { pattern: /\bMAS\b/gi, code: "MAS" },
    { pattern: /\bFSCA\b/gi, code: "FSCA" },
    { pattern: /\bNFA\b/gi, code: "NFA" },
    { pattern: /\bSEA\b/gi, code: "SEA" },
    { pattern: /\bBVI\b/gi, code: "BVI" },
    { pattern: /\bFSP\b/gi, code: "FSP" },
    { pattern: /\bFNRA\b/gi, code: "FNRA" },
    { pattern: /\biFSC\b/gi, code: "iFSC" },
    { pattern: /\bVFSC\b/gi, code: "VFSC" },
    { pattern: /\bSFC\b/gi, code: "SFC" },
    { pattern: /\bBaFin\b/gi, code: "BaFin" },
    { pattern: /\bFCMC\b/gi, code: "FCMC" },
  ]

  const foundRegulators: string[] = []

  for (const { pattern, code } of regulatorPatterns) {
    if (pattern.test(licenseInfo)) {
      if (!foundRegulators.includes(code)) {
        foundRegulators.push(code)
      }
    }
  }

  return foundRegulators.length > 0 ? foundRegulators : ["Regulated"]
}

/**
 * 格式化监管机构信息为显示文本
 * 例如: ["FCA", "ASIC"] => "FCA, ASIC"
 */
export function formatRegulators(regulators: string[]): string {
  if (regulators.length === 0) return "Unknown"
  if (regulators.length === 1) return regulators[0]
  return regulators.join(", ")
}

/**
 * 获取简化的许可证显示文本
 */
export function getLicenseDisplay(licenseInfo: string | null | undefined): string {
  const regulators = extractRegulators(licenseInfo)
  return formatRegulators(regulators)
}
