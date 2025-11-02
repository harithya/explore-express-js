#!/bin/bash
dotenv -e .env.test -- echo "Change env to .env.test" 
npx prisma migrate reset --force
jest -i