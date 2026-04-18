#!/bin/bash

# IdeTech Git Stack Helper
# Digunakan untuk manajemen branching yang konsisten

COMMAND=$1
NAME=$2

function show_help() {
    echo "Usage: ./scripts/stack.sh [command] [name]"
    echo ""
    echo "Commands:"
    echo "  start-feature <name>    Membuat branch feature baru dari develop"
    echo "  finish-feature <name>   Merge feature ke develop dan hapus branch"
    echo "  to-staging              Merge develop ke staging untuk testing"
    echo "  to-main                 Merge staging ke main (Production Release)"
}

if [ -z "$COMMAND" ]; then
    show_help
    exit 1
fi

case $COMMAND in
    start-feature)
        if [ -z "$NAME" ]; then echo "Error: Nama feature diperlukan"; exit 1; fi
        git checkout develop
        git pull origin develop
        git checkout -b "feature/$NAME"
        echo "Branch feature/$NAME berhasil dibuat."
        ;;
    finish-feature)
        if [ -z "$NAME" ]; then echo "Error: Nama feature diperlukan"; exit 1; fi
        git checkout develop
        git pull origin develop
        git merge "feature/$NAME"
        git push origin develop
        git branch -d "feature/$NAME"
        echo "Feature $NAME berhasil di-merge ke develop."
        ;;
    to-staging)
        git checkout staging
        git pull origin staging
        git merge develop
        git push origin staging
        echo "Develop berhasil di-merge ke staging. CI/CD Staging dimulai."
        ;;
    to-main)
        git checkout main
        git pull origin main
        git merge staging
        git push origin main
        git tag -a "v$(date +'%Y.%m.%d-%H%M')" -m "Release production $(date)"
        git push origin --tags
        echo "Staging berhasil di-release ke main. Versi baru telah di-tag."
        ;;
    *)
        show_help
        ;;
esac
