# Okami Web - Sistema de Gestão de Academia

Sistema completo para gestão de academia/escola de artes marciais com funcionalidades de cadastro, check-in, financeiro e relatórios.

## 🚀 Funcionalidades

### ✅ Implementadas
- **Autenticação**: Sistema de login com controle de sessão
- **Dashboard**: Visão geral com estatísticas e atividades recentes
- **Layout Responsivo**: Interface adaptável para desktop, tablet e mobile
- **Navegação**: Sistema de rotas protegidas com sidebar
- **Estrutura Base**: Componentes, páginas e serviços organizados

### 🔄 Em Desenvolvimento
- **Gestão de Alunos**: CRUD completo de alunos
- **Gestão de Professores**: CRUD completo de professores
- **Gestão de Aulas**: Criação e gerenciamento de aulas
- **Sistema de Check-in**: Check-in manual e via QR Code
- **Gestão Financeira**: Controle de pagamentos e mensalidades
- **Relatórios**: Análises e estatísticas do sistema

## 🛠️ Tecnologias Utilizadas

- **React 18** - Biblioteca principal
- **TypeScript** - Tipagem estática
- **React Router DOM** - Roteamento
- **Zustand** - Gerenciamento de estado
- **React Hook Form** - Formulários
- **Lucide React** - Ícones
- **Date-fns** - Manipulação de datas
- **Vite** - Build tool

## 📋 Pré-requisitos

- Node.js 18+ 
- npm ou bun

## 🚀 Como Executar

1. **Clone o repositório**
```bash
git clone <repository-url>
cd okami-web
```

2. **Instale as dependências**
```bash
npm install
# ou
bun install
```

3. **Configure as variáveis de ambiente**
```bash
# Crie um arquivo .env na raiz do projeto
VITE_API_URL=http://localhost:3000/api
```

4. **Execute o projeto**
```bash
npm run dev
# ou
bun dev
```

5. **Acesse a aplicação**
- URL: http://localhost:5173
- **Login de teste**: 
  - Usuário: `admin`
  - Senha: `admin`

## 📁 Estrutura do Projeto

```
src/
├── components/           # Componentes reutilizáveis
│   └── common/          # Componentes comuns (Header, Sidebar, etc.)
├── pages/               # Páginas da aplicação
├── services/            # Serviços e APIs
│   └── interfaces.ts    # Interfaces dos serviços
├── stores/              # Gerenciamento de estado (Zustand)
├── types/               # Definições de tipos TypeScript
├── utils/               # Utilitários e constantes
└── App.tsx             # Componente principal
```

## 🎯 Arquitetura

### Princípios Seguidos
- **Dependency Injection**: Serviços desacoplados usando interfaces
- **Single Responsibility**: Cada componente/função tem uma responsabilidade
- **Type Safety**: TypeScript rigoroso sem uso de `any`
- **Clean Code**: Código limpo e bem documentado

### Padrões Implementados
- **Service Layer**: Camada de serviços com interfaces
- **Store Pattern**: Gerenciamento de estado centralizado
- **Component Composition**: Composição de componentes
- **Protected Routes**: Rotas protegidas por autenticação

## 🔐 Sistema de Autenticação

- Login com usuário e senha
- Token JWT (simulado para desenvolvimento)
- Controle de sessão persistente
- Rotas protegidas por autenticação
- Logout automático

## 🎨 Interface do Usuário

### Design System
- **Cores**: Paleta azul profissional
- **Tipografia**: System fonts para melhor performance
- **Espaçamento**: Grid system consistente
- **Responsividade**: Mobile-first approach

### Componentes
- Header com informações do usuário
- Sidebar com navegação
- Cards de estatísticas
- Tabelas responsivas
- Formulários com validação
- Botões e inputs padronizados

## 📱 Responsividade

A aplicação é totalmente responsiva e funciona em:
- **Desktop**: Layout completo com sidebar
- **Tablet**: Layout adaptado
- **Mobile**: Layout compacto e touch-friendly

## 🔄 Próximos Passos

### Fase 1 - CRUD Básico
- [ ] Implementar CRUD de alunos
- [ ] Implementar CRUD de professores
- [ ] Implementar CRUD de aulas
- [ ] Conectar com API real

### Fase 2 - Funcionalidades Avançadas
- [ ] Sistema de check-in
- [ ] Gestão financeira
- [ ] Geração de relatórios
- [ ] Sistema de notificações

### Fase 3 - Melhorias
- [ ] Testes unitários
- [ ] Testes de integração
- [ ] PWA (Progressive Web App)
- [ ] Otimizações de performance

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👥 Equipe

- **Desenvolvimento Frontend**: Sistema completo em React/TypeScript
- **Arquitetura**: Clean Architecture com Dependency Injection
- **UI/UX**: Design system moderno e responsivo

---

**Okami Web** - Sistema de Gestão de Academia 🥋
