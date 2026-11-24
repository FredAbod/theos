# HIS PRESENCE — Music Banquet '26 Registration

Futuristic registration site for **Theos Tribe** Music Banquet '26. Built with Next.js, Three.js, and MongoDB — ready for **Vercel**.

## Features

- Gold / deep-green Three.js particle scene
- Register with first name, last name, email, phone
- Hard cap of **50** seats
- Downloadable QR ticket after signup
- Usher scan desk at `/scan` (camera + manual ID + check-in)

## Local setup

1. Copy env file and add your Atlas URI:

```bash
cp .env.example .env.local
```

2. Install & run:

```bash
npm install
npm run dev
```

- Registration: [http://localhost:3000](http://localhost:3000)
- Usher scanner: [http://localhost:3000/scan](http://localhost:3000/scan)

## Deploy on Vercel

1. Push this repo to GitHub.
2. Import the project in [Vercel](https://vercel.com/new).
3. Add environment variables:
   - `MONGODB_URI` — MongoDB Atlas connection string
   - `USHER_PIN` — PIN for the `/scan` check-in desk
4. Deploy.

### MongoDB Atlas tips

- Create a free **M0** cluster.
- Database Access: create a user/password.
- Network Access: allow `0.0.0.0/0` (required for Vercel serverless IPs), or use the official MongoDB Atlas Vercel integration.
- Use a DB name in the URI, e.g. `...mongodb.net/theos?...`

## Routes

| Path | Purpose |
|------|---------|
| `/` | Public registration |
| `/ticket/[id]` | Guest ticket + QR download |
| `/scan` | Usher QR scanner / check-in |
| `/api/register` | Create registration |
| `/api/count` | Seats remaining |
| `/api/verify` | Validate / check in ticket |
