# Descrição

Este projeto é uma API desenvolvida em Node.js com TypeScript e Express para processar um arquivo CSV de filmes e fornecer informações sobre os prêmios dos produtores (Teste Outsera).

## Requisitos

- Node.js (versão 18 ou superior)
- npm

## Instalação

Clone o repositório:

```bash
git clone https://github.com/filipem2210/golden-raspberry-api.git
cd golden-raspberry-api
```

Instale as dependências do projeto:

```bash
npm install
```

## Execução

Certifique-se de que o arquivo **movielist.csv** está presente no diretório do projeto.

Para ambiente de desenvolvimento (hot reload):

```bash
npm run dev
```

Para build e execução em produção:

```bash
npm run build
npm start
```

A API estará disponível em:

  <http://localhost:3000>

Você pode definir a porta usando a variável de ambiente `PORT`.

## Endpoints

### GET /api/awards/intervals

Retorna os produtores com os menores e maiores intervalos entre os prêmios.

**Exemplo de resposta:**

```json
{
  "min": [
    {
      "producer": "Producer 1",
      "interval": 1,
      "previousWin": 2008,
      "followingWin": 2009
    }
  ],
  "max": [
    {
      "producer": "Producer 2",
      "interval": 99,
      "previousWin": 2000,
      "followingWin": 2099
    }
  ]
}
```

## Testes de Integração

Para rodar os testes de integração:

```bash
npm test
```
