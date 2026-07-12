# 💻 Frontend Web - Ateliê Digital

## 📖 Sobre o Projeto
O **Ateliê Digital** é um sistema web que funciona como um marketplace exclusivo para produtos artesanais. O objetivo da plataforma é conectar diretamente os artesãos independentes aos consumidores, oferecendo ferramentas para que os vendedores gerenciem seus negócios e os clientes encontrem produtos com facilidade e segurança.

Neste repositório encontra-se a aplicação **Frontend Web** do ecossistema. Desenvolvida em **React** com **Vite** e **TypeScript**, esta aplicação é a interface SPA (Single Page Application) responsável por unificar a experiência do usuário. Ela consome ativamente todas as APIs do core do projeto (*Catalog* para renderização da vitrine e busca de produtos, *Accounts* para o fluxo de autenticação e carteira do artesão, e *Orders* para a gestão de carrinho de compras e checkout de pedidos).

A aplicação conta com interfaces responsivas tanto para os clientes navegarem pelas lojas e comprar produtos quanto para os artesãos gerenciarem seus produtos, estoques, e pedidos.

## 🚀 Tecnologias e Recursos
Esta aplicação web foi construída utilizando as seguintes tecnologias e ecossistema de bibliotecas:

* **React 19 & Vite 8:** Biblioteca base em sua versão mais recente para construção de interfaces reativas e o build tool ultrarrápido Vite.
* **TypeScript:** Tipagem estática integrada em todo o projeto para maior segurança e escalabilidade.
* **Tailwind CSS v4:** Framework utilitário de estilização integrado nativamente via plugin do Vite para a criação de um layout moderno, performático e responsivo.
* **React Router Dom v7:** Gerenciamento de rotas navegáveis, rotas protegidas por autenticação e carregamento dinâmico.
* **React Hook Form & Zod:** Manipulação performática de formulários complexos e validação de esquemas de dados em tempo de execução no lado do cliente.
* **Visualização e Gráficos:**
    * **Recharts:** Biblioteca de gráficos compositáveis e interativos usada nos dashboards de gerenciamento de vendas dos artesãos.
    * **QRCode:** Geração dinâmica de códigos Pix e links de pagamento integrados diretamente na tela de checkout.
* **Ícones:** Biblioteca **Lucide React** para um conjunto consistente de ícones vetoriais leves.
* **Ferramentas de Suporte, Qualidade e Linting:**
    * **uv:** Utilizado para a gestão ágil de scripts no ecossistema de desenvolvimento quando integrado à pipeline.
    * **ESLint:** Analisador estático de código com suporte a regras de React Hooks e Refresh para garantir as melhores práticas.

---

## ⚙️ Configuração do Ambiente

Para rodar esta aplicação localmente, você precisará ter o **Node.js** instalado. Opcionalmente, pode usar gerenciadores de pacotes padrão ou otimizados compatíveis.

### 1. Clonar e Configurar Variáveis de Ambiente
Na pasta raiz do projeto frontend, faça uma cópia do arquivo de configuração de variáveis:
```bash
cp .env.example .env
```

(No arquivo .env, configure a variável correspondente à URL base do API Gateway ou dos microsserviços, como por exemplo: `VITE_API_URL=http://localhost:8000`).

### 3. Instalando as Dependências
Abra o seu terminal na raiz do projeto e instale todos os pacotes listados nas dependências de produção e desenvolvimento executando:

```bash
npm install
```
(Ou use o gerenciador de sua preferência como `yarn install` ou `pnpm install`).

## ▶️ Como Executar o Frontend
Você pode rodar a aplicação em modo local de desenvolvimento diretamente via terminal ou de forma conteinerizada utilizando o Docker Compose para emular o ecossistema completo do Ateliê Digital.

### Opção 1: Execução Local de Desenvolvimento

Com as dependências instaladas e o arquivo .env configurado, inicie o servidor de desenvolvimento local do Vite executando:

```bash
npm run dev
```

O terminal exibirá o endereço local da aplicação, que por padrão estará acessível em `http://localhost:5173/`. O servidor conta com Hot Module Replacement (HMR), atualizando a tela instantaneamente a cada alteração de código.
