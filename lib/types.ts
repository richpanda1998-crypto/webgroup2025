export interface Broker {
  id: number
  code: string
  broker: string
  logo: string
  total_score: number
  official_link: string
  license_info: string
  account_info: string
  register_country: string
  operating_period: string
  whychose: string | null
  safe: string | null
  pros: string | null
  faq: string | null
}

export interface BrokerParsed extends Omit<Broker, "whychose" | "safe" | "pros" | "faq"> {
  whychose: WhyChoose[] | null
  safe: SafetyInfo | null
  pros: ProsAndCons | null
  faq: FAQ[] | null
}

export interface FAQ {
  question: string
  answer: string
}

export interface ProsAndCons {
  pros: string[]
  cons: string[]
}

export interface SafetyInfo {
  is_safe: boolean
  reasons: string[]
}

export interface WhyChoose {
  title: string
  description: string
}
