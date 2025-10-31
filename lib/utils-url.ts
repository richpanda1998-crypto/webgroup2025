/**
 * 将交易商名称转换为 URL 友好的 slug
 */
export function brokerNameToSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // 移除特殊字符
    .replace(/\s+/g, '-') // 空格转换为连字符
    .replace(/-+/g, '-') // 多个连字符合并为一个
}

/**
 * 从 slug 还原为可能的交易商名称(用于数据库查询)
 */
export function slugToBrokerName(slug: string): string {
  return slug
    .replace(/-/g, ' ') // 连字符转换为空格
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // 首字母大写
    .join(' ')
}
