import { Sparkles } from 'lucide-react'
import { useIaSummary } from '../../../../hooks/ia/useSummary'

interface ReviewSummaryAIProps {
  productId: number
  reviewCount: number
}

export function ReviewSummaryAI({ productId, reviewCount }: ReviewSummaryAIProps) {
  // O hook gerencia internamente a requisição, cache e estados
  const { data: summary, isLoading, error } = useIaSummary(productId)

  // Se estiver carregando os dados da IA, você pode exibir um esqueleto ou estado de loading discreto
  if (isLoading) {
    return (
      <div className="flex flex-col gap-2 animate-pulse">
        <div className="h-4 w-24 bg-text/10 rounded" />
        <div className="h-3 w-16 bg-text/10 rounded" />
        <div className="h-12 w-full bg-text/5 rounded mt-1" />
      </div>
    )
  }

  // Se houver um erro de integração ou não houver conteúdo retornado pela API
  // // usamos o texto padrão de fallback que você definiu
  // const summaryContent = !error && summary?.content 
  //   ? summary.content 
  //   : "Não há dados suficientes para realizar uma análise confiável sobre a satisfação dos clientes."

  return (
    <div className="flex flex-col gap-2">
      <div>
        <h3 className="text-lg font-bold text-text">Opiniões</h3>
        <p className="text-xs text-text/50">{reviewCount} comentários</p>
      </div>

      {/* Renderiza o conteúdo do resumo ou a mensagem padrão de fallback */}
      <p className="text-sm text-text/70 leading-relaxed">
        {summary?.content}
      </p>

      <div className="flex items-center gap-1.5 text-xs text-primary/70 mt-1 font-bold">
        <Sparkles size={13} />
        <span>Resumo de opiniões gerado por IA</span>
      </div>
    </div>
  )
}