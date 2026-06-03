# front-end-hortifruti
Projeto de React Fei

# 🌿 HortiFruti - Sistema de Gestão Financeira (Roadmap React)

![Status do Projeto](https://img.shields.io/badge/Status-Prot%C3%B3tipo_Est%C3%A1tico_/_Migra%C3%A7%C3%A3o_React-blue)
![Tecnologias](https://img.shields.io/badge/Tech_Atual-HTML5___CSS3-orange)
![Futura Tech](https://img.shields.io/badge/Tech_Futura-React.js-blue)

## 📖 Sobre o Projeto

O **HortiFruti** é uma aplicação web de gestão financeira simplificada desenhada sob medida para micronegócios de sacolão e feiras livres. O grande diferencial do projeto é o foco na **Experiência do Usuário (UX)** e em **Interação Humano-Computador (IHC)**, oferecendo uma interface limpa, de rápido aprendizado e interações ágeis para o dia a dia do comerciante.

Atualmente, o projeto encontra-se na fase de **Protótipo Funcional de Alta Fidelidade (HTML/CSS)**, com toda a arquitetura pensada e estruturada logicamente para ser componentizada e migrada para **React.js** na próxima etapa de desenvolvimento.

---

## 🚀 Estrutura de Telas (Prontas para Componentização)

A interface estática foi mapeada de forma modular, ideal para a futura divisão em componentes do React:

* **Menu Inicial (`index.html`):** Hub central de boas-vindas e rotas principais (Painel, Fluxo de Caixa e Relatórios).
* **Painel / Dashboard (`painel.html`):** Exibe o resumo financeiro em blocos. No React, esses blocos se transformarão em um componente `<Card tipo="..." valor="..." />` reaproveitável.
* **Fluxo de Caixa (`fluxo-abrir.html` / `fluxo-aberto.html`):** Telas de controle de operações diárias, contendo formulários de abertura de caixa e listagem dinâmica de receitas/despesas.
* **Lançamentos (`novo-lancamento.html`):** Painel simplificado para inserção rápida de novos valores de entrada ou saída.
* **Relatórios e Impressão (`relatorios.html` / `impressao.html`):** Filtros de busca por período e opções de exportação visual para Excel ou PDF.

---

## 🎨 Design System e Preparação para o React

As decisões de UI/UX foram centralizadas no arquivo global de estilos utilizando **CSS Variables (`:root`)**. Isso garante que, ao migrar para React (seja usando CSS Modules, Styled Components ou Tailwind), a identidade visual seja mantida com facilidade:

* **Consistência de Layout:** A barra de navegação lateral (`.sidebar`) está presente em todas as visões internas, sendo o elemento perfeito para virar um componente global de rotas no React.
* **Tipografia e Cores:** Uso da fonte de alta legibilidade *Nunito* e paleta baseada em variações de verde (identidade com o negócio) e vermelho para alertas e despesas.

---

## 🛠️ Tecnologias e Roadmap Técnico

### Fase 1: Protótipo Funcional (Atual)
* **HTML5:** Estruturação semântica e acessível de cada página do fluxo do usuário.
* **CSS3 (Vanilla):** Layouts responsivos utilizando CSS Grid e Flexbox, além de variáveis de estilização reutilizáveis.

### Fase 2: Migração para React (Próximos Passos)
* [ ] Configuração do ambiente com Vite / Create React App.
* [ ] Componentização da UI (`<Sidebar />`, `<Card />`, `<Button />`, `<FormInput />`).
* [ ] Criação de Rotas dinâmicas utilizando `react-router-dom` (substituindo a navegação de arquivos `.html` soltos).
* [ ] Gerenciamento de Estado (`useState`, `useContext`) para tornar o fluxo de caixa, inserção de lançamentos e abertura de caixas 100% dinâmicos em tempo real.

---
