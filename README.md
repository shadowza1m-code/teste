# Gestão de TCC

Frontend da US02, desenvolvido com React e TypeScript. A aplicação permite cadastrar e editar o perfil de um orientador, incluindo linhas de pesquisa e vagas disponíveis.

## Executar

```bash
npm install
npm start
```

A aplicação fica disponível em `http://localhost:3000`.

Para configurar outro endereço de API, crie um arquivo `.env` na raiz:

```env
REACT_APP_API_URL=http://localhost:8080/api/v1
```

## Rotas

- `/`: cadastro de orientador
- `/perfil-editar`: edição do perfil autenticado

Após o cadastro, o identificador do orientador é mantido no `localStorage` para permitir o acesso à página de edição.

## Estrutura

```text
src/
├── components/OrientadorForm.tsx
├── components/OrientadorList.tsx
├── pages/OrientadorCadastroPage.tsx
├── pages/OrientadorEdicaoPage.tsx
├── services/orientadorService.ts
├── types/orientador.ts
├── App.tsx
└── index.tsx
```

O serviço usa os endpoints definidos no contrato da US02: cadastro, listagem, consulta, atualização e remoção de orientadores.
