# Sistema Inventário Admin

Esse projeto é um sistema Web utilizado para gerenciar os dados gerados pelo aplicativo Inventário IFAL.
Desenvolvido em Angular 10

[Link para o projeto do aplicativo](https://github.com/nildomacena/aplicativo-inventario-ifal)

## Por que esse projeto?

O aplicativo Inventário IFAL foi desenvolvido para que os servidores do Instituto Federal de Alagoas possam realizar o colhimento das informações relativas aos bens alocados no instituto.

## Processo antigo
  - O servidor recebia uma lista com os bens 
  - Se dirigia às localidades
  - Para cada bem era necessário tirar uma foto do mesmo com uma plaquinha onde deveria estar escrito o número do patrimônio
  - Depois de todos os bens serem fotografados os arquivos eram enviados para o Google Drive onde alguém transferia para uma pasta com o nome da localidade e renomeava o arquivo com o numero do seu patrimonio

## Processo com o aplicativo
  - Servidor faz o cadastro no aplicativo e visualiza todas as localidades do seu campus
  - Ele abre, no aplicativo, a localidade a ser inventariada e clica na opção "novo bem"
  - Lá ele tira a foto do bem, lê o número de patrimônio do mesmo através de um QR Code, registra algumas informações adicionais e envia o bem para nuvem (Firebase)
  - Após tirada todas as fotos dos bens daquela localidade, ele finaliza a mesma.


## Melhorias trazidas pelo aplicativo
  Através do aplicativo o processo se tornou muito mais rápido, confiável e seguro. A quantidade de retrabalho foi bastante diminuída.<br>
  Os servidores que participaram de um projeto piloto no Instituto Federal de Alagoas Campus Avançado Benedito Bentes aprovaram com uma taxa alta a utilização do aplicativo conforme avaliação mostrada abaixo.
  ![image](https://user-images.githubusercontent.com/18093955/145046079-b509ee02-ac52-4295-9973-38aa4d5f084e.png)

## Registro dos dados no SIPAC
  Uma parte muito importante do processo de inventário é lançar os dados encontrados pelos inventariadores no sistema SIPAC (sistema utilizado para gerencia do IFAL). No processo anterior, isso era feito de forma bem rudimentar. Onde um papel com o número do patrimônio dos bens tinha que ser digitado no SIPAC.
    Já com o o sistema de Inventário, é possível gerar um pdf com os números de patrimônio de cada localidade. Dessa forma, o servidor responsável por lançar os dados, basta copiar e colar o número no SIPAC, diminuindo bastante a possibilidade de erros.
    ![image](https://user-images.githubusercontent.com/18093955/145051082-60066273-2f8a-4105-9a2b-746892aaa4a1.png)

## Prints do sistema

![image](https://user-images.githubusercontent.com/18093955/144929485-cec68cbf-d5d6-42b3-92fe-e738a52b0952.png)
![image](https://user-images.githubusercontent.com/18093955/144929595-85bf8bbc-793b-4932-b7f8-a4ca20246c4e.png)
![image](https://user-images.githubusercontent.com/18093955/144929696-5e9c565e-ab84-4017-9763-02aea5359cd5.png)



## Servir projeto
Para rodar o projeto, basta clonar o repositório e executar o comando npm install para instalar todas as dependências. Depois executar o comanando `ng serve` e navegar para a url http://localhost:4200/.
