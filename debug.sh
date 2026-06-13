#!/bin/sh

docker compose -f compose.dev.yaml up -d

cd ./frontend && npm run dev