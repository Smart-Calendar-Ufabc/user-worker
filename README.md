# REST API de usuários para o Ease Calendar

## 💻 Sobre o projeto

O Smart Calendar é um projeto que visa facilitar a organização da agenda de seus usuários. Com ele, os usuários podem cadastrar compromissos fixos e tarefas com datas de término e duração específicas. O diferencial desse calendário está na sua capacidade de distribuir automaticamente essas tarefas nos horários livres do usuário, levando em consideração a prioridade de prazo de cada uma. Assim, o Smart Calendar otimiza o tempo do usuário, garantindo que ele cumpra seus compromissos de forma eficiente e sem conflitos de horário. Esta aplicação foi desenvolvida como projeto final da disciplina de Engenharia de Software da UFABC para o gerenciamento de usuários.

## 🛠 Tecnologias

As seguintes ferramentas foram usadas na construção do projeto:

- [Cloudflare Workers](https://workers.cloudflare.com/)
- [TypeScript](https://www.typescriptlang.org/)
- [Hono](https://hono.dev/getting-started/cloudflare-workers)
- [Prisma](https://www.prisma.io/)
- [Zod](https://zod.dev/)

## 🚀 Como executar

Antes de começar, você vai precisar ter instalado em sua máquina as seguintes ferramentas: [Node.js](https://nodejs.org/en/) e [npm](https://www.npmjs.com/). Além disto é bom ter um editor para trabalhar com o código como [VSCode](https://code.visualstudio.com/)

### 🎲 Rodando o Worker

Crie uma pasta chamada `smart-calendar`. Abra o terminal nessa paste e clone o repositório:

```bash
git clone https://github.com/Smart-Calendar-Ufabc/user-worker
```

Abra a pasta `user-worker` no VsCode com o seguinte comando:

```bash
cd user-worker
code .
```

Abra o terminal integrado dentro do VsCode e execute os seguintes comandos:

```bash
npm install
npm run dev
```

As rotas da API estarão disponíveis em `http://localhost:3333`.

## Routes

### Autenticação

##### Requisição

`POST /sessions`

Cria uma sessão para o usuário

| Parameter | Type   | Required |
| :-------- | :----- | :------- |
| email     | string | yes      |
| password  | string | yes      |

Exemplo

```json
{
	"email": "janedoe@example.com",
	"password": "123456"
}
```

#### Respostas

<details>
  <summary>
    200 Ok
  </summary>

```json
{
	"profile": {
		"name": "Jane Doe",
		"avatar": "base64",
		"blockedTimes": {
			"dates": ["2021-10-01", "2021-10-02"],
			"weekDays": [0, 1],
			"intervals": [
				{
					"start": {
						"hour": 22,
						"minutes": 30
					},
					"end": { "hour": 8, "minutes": 0 }
				}
			]
		}
	},
	"token": "f9ebcdfb-e521-4523-a7d0-b4aaa24796eb"
}
```

</details>

<details>
  <summary>
    400 Bad Request
  </summary>

```json
{
	"message": "A new validation code was sent to email address successfully.",
	"errors": {
		"email": ["Invalid email address."],
		"password": ["Invalid password."]
	}
}
```

</details>

<details>
  <summary>
    401 Unauthorized
  </summary>

```json
{
	"message": "Invalid credentials"
}
```

</details>

<details>
  <summary>
    500 Internal Server Error
  </summary>

```json
{
	"message": "Internal server error"
}
```

</details>

### Cadastro

##### Requisição

`POST /sign-up`

Gera um código de validação

| Parameter | Type   | Required |
| :-------- | :----- | :------- |
| email     | string | yes      |
| password  | string | yes      |

Exemplo:

```json
{
	"email": "janedoe@example.com",
	"password": "123456"
}
```

#### Respostas

<details>
  <summary>
    200 Ok
  </summary>

```json
{
	"code": "123456"
}
```

</details>

<details>
  <summary>
    400 Bad Request
  </summary>

```json
{
	"message": "A new validation code was sent to email address successfully.",
	"errors": {
		"email": ["Invalid email address."],
		"password": ["Invalid password."]
	}
}
```

</details>

<details>
  <summary>
    409 Conflict
  </summary>

```json
{
	"message": "User already exists with this email"
}
```

</details>

<details>
  <summary>
    500 Internal Server Error
  </summary>

```json
{
	"message": "Internal server error"
}
```

</details>

### Validação de código

##### Requisição

`POST /sign-up/code-validate`

| Parameter | Type   | Required |
| :-------- | :----- | :------- |
| email     | string | yes      |
| code      | string | yes      |

Valida o código do usuário e cria uma sessão

Exemplo:

```json
{
	"email": "janedoe@example.com",
	"code": "123456"
}
```

#### Respostas

<details>
  <summary>
    200 Ok
  </summary>

```json
{
	"message": "Code validated successfully"
}
```

</details>

<details>
  <summary>
    400 Bad Request
  </summary>

```json
{
	"errors": {
		"email": ["Invalid email address."],
		"code": ["Invalid code."]
	}
}
```

</details>

<details>
  <summary>
    400 Bad Request
  </summary>

```json
{
	"message": "Invalid code",
	"errors": {
		"code": ["Invalid code."]
	}
}
```

</details>

<details>
  <summary>
    404 Not Found
  </summary>

```json
{
	"message": "User not found with this email"
}
```

</details>

<details>
  <summary>
    500 Internal Server Error
  </summary>

```json
{
	"message": "Internal server error"
}
```

</details>

### Cria Perfil

##### Requisição

| Parameter    | Type   | Required |
| :----------- | :----- | :------- |
| name         | string | yes      |
| avatar       | string | no       |
| blockedTimes | object | no       |

`POST /profile`

Cria um perfil para o usuário

Exemplo:

```json
{
	"name": "Jane Doe",
	"avatar": "base64",
	"blockedTimes": {
		"dates": ["2021-10-01", "2021-10-02"],
		"weekDays": [0, 1],
		"intervals": [
			{
				"start": {
					"hour": 22,
					"minutes": 30
				},
				"end": { "hour": 8, "minutes": 0 }
			}
		]
	}
}
```

#### Respostas

<details>
  <summary>
    201 Created
  </summary>

```json
{
	"name": "Jane Doe",
	"avatar": "base64",
	"blockedTimes": {
		"dates": ["2021-10-01", "2021-10-02"],
		"weekDays": [0, 1],
		"intervals": [
			{
				"start": {
					"hour": 22,
					"minutes": 30
				},
				"end": { "hour": 8, "minutes": 0 }
			}
		]
	}
}
```

</details>

<details>
  <summary>
    400 Bad Request
  </summary>

```json
{
	"message": "A new validation code was sent to email address successfully.",
	"errors": {
		"name": ["Required name."],
		"avater": ["Invalid image."],
		"blockedTimes.interval": ["Invalid interval"],
		"blockedTimes.weekDays": ["Invalid week days"],
		"blockedTimes.dates": ["Invalid dates"]
	}
}
```

</details>

<details>
  <summary>
    404 Not Found
  </summary>

```json
{
	"message": "User not found"
}
```

</details>

<details>
  <summary>
    403 Forbidden
  </summary>

```json
{
	"message": "Profile already exists"
}
```

</details>

<details>
  <summary>
    500 Internal Server Error
  </summary>

```json
{
	"message": "Internal server error"
}
```

</details>

### Atualiza Perfil

##### Requisição

`PUT /profile`

Atualiza o perfil do usuário

| Parameter    | Type   | Required |
| :----------- | :----- | :------- |
| name         | string | yes      |
| avatar       | string | no       |
| blockedTimes | object | no       |

Exemplo

```json
{
	"name": "Jane Doe",
	"avatar": "base64",
	"blockedTimes": {
		"dates": ["2021-10-01", "2021-10-02"],
		"weekDays": [0, 1],
		"intervals": [
			{
				"start": {
					"hour": 22,
					"minutes": 30
				},
				"end": { "hour": 8, "minutes": 0 }
			}
		]
	}
}
```

#### Respostas

<details>
  <summary>
    200 Ok
  </summary>

```json
{
	"name": "Jane Doe",
	"avatar": "base64",
	"blockedTimes": {
		"dates": ["2021-10-01", "2021-10-02"],
		"weekDays": [0, 1],
		"intervals": [
			{
				"start": {
					"hour": 22,
					"minutes": 30
				},
				"end": { "hour": 8, "minutes": 0 }
			}
		]
	}
}
```

</details>

<details>
  <summary>
    400 Bad Request
  </summary>

```json
{
	"message": "A new validation code was sent to email address successfully.",
	"errors": {
		"name": ["Required name."],
		"avater": ["Invalid image."],
		"blockedTimes.interval": ["Invalid interval"],
		"blockedTimes.weekDays": ["Invalid week days"],
		"blockedTimes.dates": ["Invalid dates"]
	}
}
```

</details>

<details>
  <summary>
    404 Not Found
  </summary>

```json
{
	"message": "User not found"
}
```

</details>

<details>
  <summary>
    403 Forbidden
  </summary>

```json
{
	"message": "Profile already exists"
}
```

</details>

<details>
  <summary>
    500 Internal Server Error
  </summary>

```json
{
	"message": "Internal server error"
}
```

</details>

## 📝 Licença

Este projeto esta sobe a licença MIT.
