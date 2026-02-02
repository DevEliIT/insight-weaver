
# StatIA - Plataforma de Estatísticas Universais com IA

Uma plataforma inteligente que transforma perguntas abertas em respostas estatísticas confiáveis, com transparência total sobre a origem e confiabilidade dos dados.

---

## 🎯 Visão Geral

O StatIA será uma interface limpa e profissional onde usuários podem fazer perguntas estatísticas sobre qualquer tema - desde dados demográficos até produção agrícola - e receber respostas fundamentadas com classificação de confiabilidade, fontes rastreáveis e visualizações automáticas.

---

## Funcionalidades Principais

### 1. Consulta Estatística Inteligente
- Campo de busca central para perguntas em linguagem natural
- Exemplos de perguntas sugeridas para orientar o usuário
- Histórico de consultas recentes (salvo localmente no navegador)
- Sugestões de perguntas relacionadas após cada resposta

### 2. Sistema de Classificação de Dados
Cada resposta será classificada automaticamente:
- **🟢 Dado Oficial Primário** - Censos, órgãos governamentais
- **🔵 Dado Institucional Secundário** - ONGs, organismos internacionais
- **🟡 Dado Estimado** - Inferência baseada em múltiplas fontes
- **🔴 Dado Inexistente** - IA recusa e explica o motivo

### 3. Índice de Confiabilidade (0-100)
Barra visual com código de cores indicando:
- **90-100** (Verde): Altamente confiável
- **70-89** (Azul): Confiável
- **40-69** (Amarelo): Moderado
- **0-39** (Vermelho): Baixa confiabilidade

Fatores considerados: número de fontes, autoridade, data, consistência, metodologia.

### 4. Transparência de Fontes
- Lista completa de fontes com links
- Data de publicação de cada fonte
- Tipo de fonte (governamental, acadêmica, institucional)
- Seção fixa "Fontes, Metodologia e Limitações"

### 5. Visualizações Dinâmicas
Gráficos gerados automaticamente conforme o tipo de dado:
- **Proporções** → Gráfico de pizza ou barras empilhadas
- **Evolução temporal** → Gráfico de linha
- **Comparações entre países** → Barras horizontais
- **Distribuições** → Histogramas

Cada gráfico exibe título, unidade de medida e nota de confiabilidade.

### 6. Exportação em PDF
Relatório completo contendo:
- Pergunta original do usuário
- Resumo interpretativo da IA
- Gráficos e tabelas de dados
- Índice de confiabilidade
- Lista completa de fontes

### 7. Regras de Ética e Transparência
- IA recusa perguntas sem base estatística mínima
- Estimativas são sempre rotuladas claramente
- Método de cálculo explicado quando aplicável
- Nunca apresenta estimativas como fatos absolutos

---

## Design da Interface

### Página Principal
- Header minimalista com logo "StatIA"
- Campo de busca central grande e destacado
- Cards com exemplos de perguntas populares
- Seção "Como funciona" com os 4 tipos de classificação

### Página de Resultados
- Pergunta do usuário no topo
- Card principal com resposta e índice de confiabilidade
- Visualização gráfica interativa
- Seção expansível de fontes e metodologia
- Botão de exportar PDF
- Sugestões de perguntas relacionadas

### Cores e Estilo
- Paleta neutra e profissional (tons de azul escuro e branco)
- Badges coloridos para níveis de confiabilidade
- Tipografia limpa e legível
- Muito espaço em branco para transmitir credibilidade

---

## Tecnologia

- **Frontend**: React com Tailwind CSS e componentes Shadcn/UI
- **Gráficos**: Recharts (já instalado)
- **IA**: Google Gemini via Lovable AI Gateway
- **PDF**: Geração client-side com biblioteca dedicada
- **Armazenamento**: LocalStorage para histórico (sem backend de dados)
