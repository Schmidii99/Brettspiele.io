#!/bin/sh

SESSIONAME="brettspiele_io"

# Kill old session and start new session
tmux kill-session -t $SESSIONAME
tmux new -s $SESSIONAME -d

# redis
tmux send-keys -t $SESSIONAME:0 "docker compose -f dev-compose.yaml up redis --no-deps --build" ENTER

tmux splitw -h -t $SESSIONAME

# backend2
tmux send-keys -t $SESSIONAME:0 "cd backend" ENTER
tmux send-keys -t $SESSIONAME:0 "export REDIS_URL='redis://localhost:6379'" ENTER
tmux send-keys -t $SESSIONAME:0 "sleep 1" ENTER
tmux send-keys -t $SESSIONAME:0 "deno task dev" ENTER

tmux splitw -h -t $SESSIONAME

# frontend
tmux send-keys -t $SESSIONAME:0 "cd frontend" ENTER
tmux send-keys -t $SESSIONAME:0 "npm run dev" ENTER

tmux splitw -h -t $SESSIONAME

# nginx
tmux send-keys -t $SESSIONAME:0 "sleep 2" ENTER
tmux send-keys -t $SESSIONAME:0 "docker compose -f dev-compose.yaml up nginx --no-deps --build" ENTER

tmux select-layout -t $SESSIONAME even-horizontal

# connect to session
tmux attach -t $SESSIONAME
