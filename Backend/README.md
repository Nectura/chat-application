# Database commands

- Add migration: npx prisma migrate dev --schema src/database/schema.prisma --name init
- Reset database: npx prisma migrate reset --schema src/database/schema.prisma
- Regenerate stubs: npx prisma generate --schema src/database/schema.prisma

# How to run
1. npm install
2. configure the redacted fields to your setup
3. npm run dev
