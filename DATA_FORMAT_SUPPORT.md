# 数据格式支持说明

## 概览
系统现在支持多种数据格式，能够智能解析不同结构的 JSON 数据。

---

## Why Choose (whychose) 字段

### 支持的格式

#### 格式 1: 标准数组格式（推荐）
```json
[
  {
    "title": "闪电执行",
    "description": "订单1秒内完成，抢占市场先机不再是梦想"
  },
  {
    "title": "超高信任度",
    "description": "4.72/5信任评分远超行业平均，60万+投资者的信赖之选"
  }
]
```

#### 格式 2: 嵌套对象格式
```json
{
  "reasons": [
    {"title": "...", "description": "..."}
  ]
}
```

或者：
```json
{
  "items": [...],
  "features": [...],
  "whychose": [...],
  "why_choose": [...]
}
```

#### 格式 3: 单个对象
```json
{
  "title": "主要原因",
  "description": "详细描述"
}
```
会自动转换为数组格式。

---

## Safety (safe) 字段

### 支持的格式

#### 格式 1: 标准格式（推荐）
```json
{
  "is_safe": true,
  "reasons": [
    "受ASIC监管，资金安全有保障",
    "客户资金隔离存放在顶级银行",
    "提供负余额保护"
  ]
}
```

#### 格式 2: 嵌套格式
```json
{
  "safe": {
    "is_safe": true,
    "reasons": ["..."]
  }
}
```

#### 格式 3: 只有 reasons
```json
{
  "reasons": [
    "安全原因1",
    "安全原因2"
  ]
}
```
系统会自动设置 `is_safe: true`

#### 格式 4: safety_analysis 格式
```json
{
  "safety_analysis": {
    "is_safe": true,
    "reasons": ["..."],
    "summary": "总体安全评估"
  }
}
```

#### 格式 5: 复杂嵌套格式 (safety_module)
```json
{
  "safety_module": {
    "safety_score": {
      "overall_rating": 85
    },
    "fund_security": {
      "security_summary": "资金安全描述"
    },
    "regulatory_compliance": {
      "regulation_summary": "监管合规描述"
    },
    "operational_stability": {
      "stability_summary": "运营稳定性描述"
    }
  }
}
```

#### 格式 6: 直接数组
```json
["安全原因1", "安全原因2", "安全原因3"]
```
系统会自动转换为标准格式。

---

## Pros & Cons (pros) 字段

### 支持的格式

#### 格式 1: 标准格式（推荐）
```json
{
  "pros": ["优点1", "优点2"],
  "cons": ["缺点1", "缺点2"]
}
```

#### 格式 2: 英文长格式
```json
{
  "advantages": ["优点1"],
  "disadvantages": ["缺点1"]
}
```

#### 格式 3: 中文格式
```json
{
  "优点": ["优点1"],
  "缺点": ["缺点1"]
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

---

## FAQ 字段

### 支持的格式

#### 格式 1: 标准格式（推荐）
```json
[
  {
    "question": "问题1？",
    "answer": "回答1"
  },
  {
    "question": "问题2？",
    "answer": "回答2"
  }
]
```

#### 格式 2: 简写格式
```json
[
  {
    "q": "问题1？",
    "a": "回答1"
  }
]
```

---

## 调试方法

### 查看 Bell Potter 的数据结构

访问 Bell Potter 页面后，在服务器终端会看到：

```
========== Bell Potter Data Debug ==========
[DEBUG whychose]: {...实际数据结构...}
[DEBUG safe]: {...实际数据结构...}
```

### 移除调试日志

在 `app/actions/brokers.ts` 中找到并删除：
```typescript
// 只为 Bell Potter 打印调试信息
if (typeof window === 'undefined' && broker.broker === 'Bell Potter') {
  console.log('\n========== Bell Potter Data Debug ==========')
}
```

---

## 数据库查询示例

### 查看 Bell Potter 的数据
```sql
SELECT broker, whychose, safe, pros 
FROM broker_data_web 
WHERE broker = 'Bell Potter';
```

### 查看数据类型
```sql
SELECT 
  broker,
  pg_typeof(whychose) as whychose_type,
  pg_typeof(safe) as safe_type
FROM broker_data_web 
WHERE broker = 'Bell Potter';
```

---

## 常见问题

### Q: 数据在数据库里但前端不显示？

A: 可能的原因：
1. 数据格式不符合任何支持的格式
2. JSON 解析失败
3. 必需字段缺失

**解决方法：**
1. 访问页面查看终端调试日志
2. 确认数据格式是否在支持列表中
3. 如需新格式支持，在解析函数中添加

### Q: 如何添加新的数据格式支持？

A: 在对应的解析函数中添加新的格式判断：
- `parseWhyChoseField()` - Why Choose 字段
- `parseSafeField()` - Safety 字段
- `parseProsField()` - Pros & Cons 字段
- `parseFAQField()` - FAQ 字段

---

## 更新日期

2025-01-31

## 维护者

CAIZHIW FX 开发团队
