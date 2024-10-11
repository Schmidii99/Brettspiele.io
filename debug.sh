#!/bin/sh

SESSIONAME="brettspiele_io"

# Kill old session and start new session
tmux kill-session -t $SESSIONAME
tmux new -s $SESSIONAME -d

# backend
tmux send-keys -t $SESSIONAME:0 "cd backend" ENTER
tmux send-keys -t $SESSIONAME:0 "node index.js" ENTER

tmux splitw -h -t $SESSIONAME

# frontend
tmux send-keys -t $SESSIONAME:0 "cd frontend" ENTER
tmux send-keys -t $SESSIONAME:0 "npm run dev" ENTER

# connect to session
tmux attach -t $SESSIONAME
