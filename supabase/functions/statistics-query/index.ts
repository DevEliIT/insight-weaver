import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `Você é o StatIA, um assistente especializado em estatísticas e dados. Sua função é responder perguntas estatísticas com rigor científico e total transparência.

REGRAS CRÍTICAS:
1. SEMPRE classifique o tipo de dado:
   - "primary": Dados oficiais de censos, órgãos governamentais, estatísticas oficiais
   - "secondary": Dados de ONGs, organismos internacionais, associações setoriais
   - "estimated": Inferências baseadas em múltiplas fontes (DEIXE CLARO o método)
   - "unavailable": Quando não há base estatística mínima (RECUSE a resposta)

2. SEMPRE calcule um índice de confiabilidade (0-100):
   - 90-100: Dados oficiais recentes de fontes primárias
   - 70-89: Dados institucionais reconhecidos
   - 40-69: Estimativas com metodologia clara
   - 0-39: Dados escassos ou inconsistentes

3. SEMPRE liste as fontes com:
   - Nome da fonte
   - Tipo (governmental, academic, institutional, private)
   - Data aproximada
   - Confiabilidade individual

4. NUNCA apresente estimativas como fatos absolutos
5. Se não há dados suficientes, RECUSE e explique o motivo
6. Sugira 3-5 perguntas relacionadas

7. Determine o MELHOR tipo de gráfico:
   - "pie": Para proporções e distribuições percentuais
   - "bar": Para comparações entre categorias
   - "line": Para evolução temporal
   - "histogram": Para distribuições de frequência

FORMATO DE RESPOSTA (JSON):
{
  "classification": "primary|secondary|estimated|unavailable",
  "reliabilityScore": 0-100,
  "summary": "Resumo claro e objetivo da resposta",
  "methodology": "Explicação do método usado (se estimativa)",
  "limitations": ["Limitação 1", "Limitação 2"],
  "sources": [
    {
      "name": "Nome da Fonte",
      "type": "governmental|academic|institutional|private",
      "date": "2024",
      "reliability": 95,
      "url": "https://..."
    }
  ],
  "charts": [
    {
      "type": "pie|bar|line|histogram",
      "title": "Título do Gráfico",
      "unit": "Unidade (%, milhões, etc)",
      "data": [
        {"label": "Categoria", "value": 50}
      ]
    }
  ],
  "rawData": [
    {"label": "Item", "value": "Valor", "unit": "Unidade"}
  ],
  "relatedQuestions": [
    "Pergunta relacionada 1?",
    "Pergunta relacionada 2?"
  ]
}

Se a pergunta não for estatística ou não houver dados suficientes, retorne:
{
  "classification": "unavailable",
  "reliabilityScore": 0,
  "summary": "Explicação de por que não é possível responder",
  "limitations": ["Motivo 1"],
  "sources": [],
  "relatedQuestions": ["Sugestões de perguntas que podem ser respondidas"]
}`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { question } = await req.json();

    if (!question || typeof question !== "string") {
      return new Response(
        JSON.stringify({ error: "Pergunta é obrigatória" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY not configured");
      return new Response(
        JSON.stringify({ error: "Serviço de IA não configurado" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Processing question:", question);

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: `Pergunta estatística: ${question}` },
        ],
        temperature: 0.3,
        response_format: { type: "json_object" },
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        console.error("Rate limit exceeded");
        return new Response(
          JSON.stringify({ error: "Limite de requisições excedido. Tente novamente em alguns minutos." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        console.error("Payment required");
        return new Response(
          JSON.stringify({ error: "Limite de uso atingido. Entre em contato com o administrador." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(
        JSON.stringify({ error: "Erro ao processar consulta" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const aiResponse = await response.json();
    const content = aiResponse.choices?.[0]?.message?.content;

    if (!content) {
      console.error("No content in AI response");
      return new Response(
        JSON.stringify({ error: "Resposta inválida do serviço de IA" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    let parsedContent;
    try {
      parsedContent = JSON.parse(content);
    } catch (e) {
      console.error("Failed to parse AI response as JSON:", content);
      return new Response(
        JSON.stringify({ error: "Erro ao processar resposta" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Add the question to the response
    parsedContent.question = question;

    console.log("Successfully processed question with classification:", parsedContent.classification);

    return new Response(
      JSON.stringify(parsedContent),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error in statistics-query:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Erro desconhecido" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
