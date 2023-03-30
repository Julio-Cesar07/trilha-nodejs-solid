# Setup

Instalar dependencias
``` sh
    npm i
```
Subir o docker compose desta aplicação
``` sh
   docker compose up -d 
```

Rodar as migrations do prisma
``` sh
    npm run prisma
```

Iniciar aplicação
``` sh
    npm run dev
```

PS... Caso for rodar os test e2e, rode npm run test:e2e antes, para criar o ambiente dos banco de dados e linkar eles na aplicação

# App

GymPass style app.

## RFs (Requisitos funcionais)

- [x] Deve ser possível se cadastrar;
- [x] Deve ser possível se autenticar;
- [x] Deve ser possível obter o perfil de um usuário logado;
- [x] Deve se possível obter o número de check-ins pelo usuário logado;
- [x] Deve ser possível o usuário obter seu histórico de check-ins;
- [x] Deve ser possível o usuário buscar academias próximas (até 10km);
- [x] Deve ser possível o usuário buscar academias pelo nome;
- [x] Deve ser possível o usuário realizar check-in em uma academia;
- [x] Deve ser possível validar o check-in de um usuário;
- [x] Deve ser possível cadastrar uma academia;

## RNs (Regras de negócio)

- [x] O usuário não deve poder se cadastrar com um e-mail duplicado;
- [x] O usuário não pode fazer 2 check-ins no mesmo dia;
- [x] O usuário não pode fazer check-in se não estiver perto (100m) da academia;
- [ ] O check-in só pode ser validado até 20 minutos após criado;
- [ ] O check-in só pode ser validade por administradores;
- [ ] A academia só pode ser cadastrada por administradores;

## RNFs (Requisitos não-funcionais)

- [x] A senha do usuário precisa estar criptografada;
- [x] Os dados da aplicação precisam estar persistidos em um banco PostgreSQL;
- [x] Todas listas de dados precisam estar paginadas com 20 itens por página;
- [ ] O usuário deve ser identificado por JWT (Json Web Token);



# Fluxo
               http
                 |
                 v
            Controller
            |         |
            |   usa   |
            |         ->Repositore          
            |                     ^
            |                     |
            -----------> UseCase -

Para criar uma nova funcionalidade, crie de baixo para cima.
ex: cria o caso de uso, se necessário crie o repositore, faça os testes unitários e crie o controller.

ps: repositore se refere a uma interface com as funcionalidade do banco de dados, onde um orm pode implementa-la.