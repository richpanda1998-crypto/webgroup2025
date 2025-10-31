# Pros & Cons 数据格式调试指南

## 问题描述
交易商详情页只显示了优点（Advantages），没有显示缺点（Disadvantages）。

## 可能的原因

### 1. **数据库数据格式问题**
数据库中的 `pros` 字段可能只包含优点数据，缺少缺点数据。

### 2. **已支持的数据格式**

现在代码已经支持以下几种格式：

#### 格式 1: 标准格式（推荐）
```json
{
  "pros": [
    "优点1",
    "优点2"
  ],
  "cons": [
    "缺点1",
    "缺点2"
  ]
}
```

#### 格式 2: 英文长格式
```json
{
  "advantages": [
    "优点1"
  ],
  "disadvantages": [
    "缺点1"
  ]
}
```

#### 格式 3: 中文格式
```json
{
  "优点": [
    "优点1"
  ],
  "缺点": [
    "缺点1"
  ]
}
```

#### 格式 4: 嵌套格式
```json
{
  "pros_cons": {
    "pros": ["优点1"],
    "cons": ["缺点1"]
  }
}
```

#### 格式 5: 纯数组（只显示优点）
```json
["优点1", "优点2", "优点3"]
```
⚠️ 这种格式会被自动转换为 `{pros: [...], cons: []}`

## 如何检查数据

### 方法 1: 直接查询数据库

```sql
-- 查看某个经纪商的 pros 数据
SELECT broker, pros FROM broker_data_web WHERE broker = 'Vantage' LIMIT 1;

-- 查看所有经纪商的 pros 数据格式
SELECT broker, 
       CASE 
         WHEN pros::text LIKE '%"cons"%' THEN 'Has cons'
         WHEN pros::text LIKE '%"disadvantages"%' THEN 'Has disadvantages'
         WHEN pros::text LIKE '%"缺点"%' THEN 'Has 缺点'
         ELSE 'No cons'
       END as data_format
FROM broker_data_web
WHERE pros IS NOT NULL
LIMIT 10;
```

### 方法 2: 添加临时日志

在 `/app/broker/[name]/page.tsx` 中添加：

```typescript
export default async function BrokerPage({ params }: BrokerPageProps) {
  const { name } = await params
  const broker = await getBrokerByCode(name)
  
  // 添加调试日志
  console.log('Broker pros data:', JSON.stringify(broker?.pros, null, 2))
  
  // ... 其他代码
}
```

## 解决方案

### 如果数据库没有缺点数据

你需要更新数据库，添加缺点信息：

```sql
UPDATE broker_data_web 
SET pros = jsonb_set(
  COALESCE(pros, '{}'::jsonb),
  '{cons}',
  '["缺点1", "缺点2", "缺点3"]'::jsonb
)
WHERE broker = 'Vantage';
```

### 批量更新示例

```sql
-- 为所有经纪商添加示例缺点
UPDATE broker_data_web 
SET pros = jsonb_build_object(
  'pros', COALESCE(pros->'pros', pros),
  'cons', ARRAY['Limited educational resources', 'Higher spreads on some pairs']::jsonb
)
WHERE pros IS NOT NULL 
  AND (pros->'cons' IS NULL OR jsonb_array_length(pros->'cons') = 0);
```

## 验证修复

1. 更新数据后，访问经纪商详情页
2. 检查是否同时显示了优点和缺点
3. 优点应该显示绿色 ✓ 标记
4. 缺点应该显示红色 ✗ 标记

## 数据示例

完整的数据应该是这样的：

```json
{
  "pros": [
    "Strong financial safety assured through regulation by the Australian Securities and Investment Commission (ASIC)",
    "Client capital is segregated in top-tier banks",
    "Low barrier to entry with competitive minimum deposit",
    "The platform supports automated trading options",
    "No inactivity fees are applied to client accounts",
    "The broker maintains a policy of no direct charges for standard deposit transactions"
  ],
  "cons": [
    "Limited educational resources for beginners",
    "Higher spreads compared to some competitors",
    "Customer support not available 24/7",
    "No negative balance protection",
    "Withdrawal processing can take 2-3 business days"
  ]
}
```

## 联系支持

如果问题持续存在，请提供：
1. 经纪商名称
2. 数据库中 `pros` 字段的原始 JSON 数据
3. 浏览器控制台的错误信息（如有）
