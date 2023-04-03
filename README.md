# Setup

Possua o Docker instalado, ele é essencial. Caso não tenha, será necessário ter o NodeJs e Postgres instalado na máquina. 

Crie um .env seguindo os padrões do .env.example

Instalar dependencias
``` sh
    npm i
```
Caso tenha o docker instalado, crie a imagem do postgres
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

PS... Caso for rodar os test e2e, rode ```npm run test:e2e``` para criar o ambiente dos banco de dados e linkar os environments no npm

PS2... Caso não tenha o NodeJs instalado, o docker-compose.yml possui a imagem do node comentado, então caso necessário, remove o comentário, altere o .env como explicado no arquivo de exemplo e execute as imagens do node e postgres com ```docker compose up -d``` (será necessário ter o docker instalado e aguarde um tempinho até ter rodado as migrates). Para escrever um comando diferente na aplicação dentro do docker, execute no cmd na pasta raiz 
    ```docker container exec nodejs sh -c '{comando_desejado}'```

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
- [x] O check-in só pode ser validado até 20 minutos após criado;
- [x] O check-in só pode ser validade por administradores;
- [x] A academia só pode ser cadastrada por administradores;

## RNFs (Requisitos não-funcionais)

- [x] A senha do usuário precisa estar criptografada;
- [x] Os dados da aplicação precisam estar persistidos em um banco PostgreSQL;
- [x] Todas listas de dados precisam estar paginadas com 20 itens por página;
- [x] O usuário deve ser identificado por JWT (Json Web Token);



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
ex: cria o caso de uso, se necessário crie o repositore, faça os testes unitários e crie o controller. Utilizando inversão de dependência.

ps: repositore se refere a uma interface com as funcionalidade do banco de dados, onde um orm pode implementa-la.
