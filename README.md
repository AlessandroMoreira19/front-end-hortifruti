# 🌿 HortiFruti - Sistema de Gestão Financeira e Dashboard

<div align="center">
  <img alt="React" src="https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB">
  <img alt="Vite" src="https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white">
  <img alt="JavaScript" src="https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E">
  <img alt="CSS3" src="https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white">
</div>

<br>

> **Projeto Acadêmico** desenvolvido para a disciplina de *Experiência do Usuário e Front-End* do 3º Semestre do Centro Universitário FEI.
> O sistema é uma **Single Page Application (SPA)** focada em resolver os problemas reais de gestão financeira (entradas, saídas e relatórios) de micronegócios do setor de hortifrúti.

---

## 📋 Índice

- [Sobre o Projeto](#-sobre-o-projeto)
- [Funcionalidades](#-funcionalidades)
- [Tecnologias Utilizadas](#-tecnologias-utilizadas)
- [Jornada de UX e UI](#-jornada-de-ux-e-ui)
- [Como Rodar o Projeto (Guia Completo)](#-como-rodar-o-projeto-guia-completo)

---

## 💡 Sobre o Projeto

Muitos micronegócios, como hortifrútis, ainda dependem de cadernos físicos para o controle de caixa, o que gera perda de tempo, furos financeiros e dificulta a tomada de decisão. 

Este projeto nasceu de uma **Pesquisa de Campo** real para digitalizar esse processo de forma intuitiva, rápida e à prova de falhas. A aplicação começou como um protótipo em *Vanilla JS/HTML/CSS* e evoluiu para um ecossistema moderno em **React.js**, garantindo escalabilidade, componentes reutilizáveis e navegação instantânea.

---

## 🚀 Funcionalidades

| Recurso | Descrição |
| :--- | :--- |
| **📊 Dashboard Interativo** | Visão geral da saúde financeira com gráficos de barras interativos gerados em tempo real. |
| **💰 Fluxo de Caixa** | Abertura e fechamento de caixa, registro de receitas (entradas) e despesas (saídas/sangrias). |
| **💾 Persistência de Dados** | Estado global com `Context API` persistido automaticamente no `localStorage` do navegador. |
| **📄 Exportação em PDF** | Relatórios com layout corporativo estrito, gerados digitalmente a partir do histórico filtrado. |
| **📈 Exportação em Excel** | Dashboards em `.xlsx` gerados via código, com células mescladas, tema claro corporativo e formatação condicional de cores. |

---

## 🛠️ Tecnologias Utilizadas

| Categoria | Tecnologia | Propósito no Projeto |
| :--- | :--- | :--- |
| **Core** | `React.js` + `Vite` | Construção da interface baseada em componentes e build ultrarrápido. |
| **Roteamento** | `React Router DOM` | Navegação Single Page Application (SPA) sem recarregamento de telas. |
| **Estado** | `Context API` | Gerenciamento global do "Banco de Dados" (Caixa, Histórico e Filtros). |
| **Gráficos** | `Recharts` | Renderização responsiva do gráfico comparativo de receitas e despesas. |
| **Relatórios** | `html2pdf.js` | Conversão da interface HTML diretamente para relatórios PDF. |
| **Planilhas** | `xlsx-js-style` | Geração de planilhas Excel avançadas com formatação e estilização de células. |

---

## 🧠 Jornada de UX e UI

O desenvolvimento foi guiado pelos princípios de **Interação Humano-Computador (IHC)** e **Design Centrado no Usuário**:

1. **Pesquisa e Personas:** Criação do "Cleiton" (Dono/Gestor que precisa de relatórios claros) e da "Juliana" (Operadora de caixa que precisa de um sistema rápido e à prova de erros).
2. **Análise de Tarefas:** Mapeamento via **HTA** e **GOMS (KLM)** para estimar a carga cognitiva e o tempo exato (em segundos) gasto em cada ação.
3. **Avaliação Heurística:** O protótipo inicial foi testado contra as **10 Heurísticas de Nielsen**. As falhas encontradas (como falta de prevenção de erros e visibilidade do sistema) ditaram a evolução para a versão final em React, que hoje conta com alertas nativos de confirmação (`window.confirm`) e gráficos em tempo real.

---

## 💻 Como Rodar o Projeto (Guia Completo)

Se você está em um computador "zerado" (sem ferramentas de programação instaladas), siga o passo a passo abaixo:

### Passo 1: Preparando o Computador
Para que o código funcione, o seu computador precisa entender a linguagem JavaScript e conseguir baixar o projeto do GitHub.
1. Baixe e instale o **Node.js** (Versão LTS recomendada): [Download Node.js](https://nodejs.org/)
2. Baixe e instale o **Git**: [Download Git](https://git-scm.com/downloads)

### Passo 2: Baixando o Projeto
Com o Node e o Git instalados, abra o **Terminal** (ou Prompt de Comando/PowerShell) do seu computador e digite:

```bash
# 1. Clone este repositório para a sua máquina
git clone [https://github.com/AlessandroMoreira19/front-end-hortifruti.git](https://github.com/AlessandroMoreira19/front-end-hortifruti.git)

# 2. Entre na pasta do projeto que acabou de ser criada
cd front-end-hortifruti

# 3. Baixe e configure automaticamente todas as bibliotecas necessárias listadas no package.json
npm install react-router-dom recharts xlsx-js-style html2pdf.js

# 4. Inicie o compilador em tempo real e ative o servidor de desenvolvimento local do Vite
npm run dev
