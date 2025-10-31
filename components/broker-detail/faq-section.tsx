import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { HelpCircle } from "lucide-react"
import type { FAQ } from "@/lib/types"

interface FAQSectionProps {
  data: FAQ[] | null
  brokerName?: string
}

export function FAQSection({ data, brokerName }: FAQSectionProps) {
  const hasData = data && data.length > 0
  const title = brokerName ? `${brokerName} FAQ` : "Frequently Asked Questions"

  return (
    <Card className={!hasData ? "border-dashed" : ""}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <HelpCircle className="size-5" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {hasData ? (
          <Accordion type="single" collapsible className="w-full">
            {data.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        ) : (
          <div className="rounded-lg bg-muted/50 p-6 text-center">
            <HelpCircle className="mx-auto mb-3 size-12 text-muted-foreground/50" />
            <p className="text-sm text-muted-foreground">
              Common questions and answers about this broker will be displayed here.
            </p>
            <p className="mt-2 text-xs text-muted-foreground">Content will be added soon.</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
