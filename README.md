

<a name="readme-top"></a>

<br />
<div align="center">
  <h3 align="center">Shop Realm</h3>

  <p align="center">
    Moderna e-komercijas platforma

  </p>
</div>


## Par Projektu

### Izmantotie Rīki

- [![Next.js][Next.js]][Next-url]
- [![React][React.js]][React-url]
- [![TypeScript][TypeScript]][TypeScript-url]
- [![MongoDB][MongoDB]][MongoDB-url]
- [![Prisma][Prisma]][Prisma-url]
- [![Tailwind CSS][TailwindCSS]][TailwindCSS-url]
- [![Stripe][Stripe]][Stripe-url]
- [![Auth.js][Auth.js]][Auth-url]
- [![Resend][Resend]][Resend-url]



## Uzsākšana

Lai izveidotu un palaistu lokālu kopiju, seko šiem vienkāršajiem soļiem:

### Priekšnosacījumi

* Node.js (v20+)
* Git
* MongoDB (vai MongoDB Atlas)
* Stripe konts
* Resend konts
* Savs domēns (Ja vēlas sūtīt epastus)
* npm

### Uzstādīšana

1. Klonēt repozitoriju
   ```sh
   git clone https://github.com/linciss/ShopRealm.git
   cd ShopRealm
   ```
2. Instalēt NPM pakotnes
   ```sh
   npm install
   ```
3. Izveidot .env failu projekta saknes mapē ar šādu struktūru:
   ```
   DATABASE_URL=                          #Mongo ģenerētā slepenā atslēga
   AUTH_SECRET=                           #Authjs atslēga, kuru var ģenerēt ar npx auth secret
   STRIPE_SECRET_KEY=                     #Stripe ģenerētā slepenā atlsēga
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=    #Stripe ģenerētā publiskā atlsēga
   NEXT_PUBLIC_APP_URL=                   #Tavas aplikācijas domēns
   RESEND_API_KEY=                        #Resend slepenā atslēga
   CRON_SECRET=                           #Cron slepenā atslēga, lai pasargātu cron maršrutu, var ģenerēt ar https://1password.com/password-generator
   DOMAIN_EMAIL                           #Tavs epasts ar tavu domēnu piem. ShopRealm<noreply@your.domain>
   ```
4. Izveidot datubāzes shēmu
   ```sh
   npx prisma generate
   ```
5. Palaist izstrādes serveri
   ```sh
   npm run dev
   ```
6. Atvērt pārlūku un doties uz
   ```
   http://localhost:3000
   ```
   
[Next.js]: https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white
[Next-url]: https://nextjs.org/
[React.js]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[React-url]: https://reactjs.org/
[TypeScript]: https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white
[TypeScript-url]: https://www.typescriptlang.org/
[MongoDB]: https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white
[MongoDB-url]: https://www.mongodb.com/
[Prisma]: https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white
[Prisma-url]: https://www.prisma.io/
[TailwindCSS]: https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white
[TailwindCSS-url]: https://tailwindcss.com/
[Stripe]: https://img.shields.io/badge/Stripe-626CD9?style=for-the-badge&logo=Stripe&logoColor=white
[Stripe-url]: https://stripe.com/
[Auth.js]: https://img.shields.io/badge/Auth.js-000000?style=for-the-badge&logo=auth0&logoColor=white
[Auth-url]: https://authjs.dev/
[Resend]: https://img.shields.io/badge/Resend-000000?style=for-the-badge&logo=nextdotjs&logoColor=white
[Resend-url]: https://resend.com/docs/introduction
