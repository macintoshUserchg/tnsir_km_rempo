#!/bin/bash

# Antigravity IDE MCP Configuration Setup Script
# This script sets up the Antigravity_IDE_PROJECT_PATH environment variable
# to work with the dynamic MCP configuration

# Function to set the project path to the current working directory
set_antigravity_project_path() {
    export Antigravity_IDE_PROJECT_PATH="${PWD}"
    echo "✓ Antigravity_IDE_PROJECT_PATH set to: ${Antigravity_IDE_PROJECT_PATH}"
}

# Function to set the project path to a specific directory
set_antigravity_project_path_to() {
    local target_path="$1"
    if [ -d "$target_path" ]; then
        export Antigravity_IDE_PROJECT_PATH="$target_path"
        echo "✓ Antigravity_IDE_PROJECT_PATH set to: ${Antigravity_IDE_PROJECT_PATH}"
    else
        echo "✗ Error: Directory '$target_path' does not exist"
        return 1
    fi
}

# Function to show current project path
show_antigravity_project_path() {
    if [ -n "$Antigravity_IDE_PROJECT_PATH" ]; then
        echo "Current Antigravity_IDE_PROJECT_PATH: ${Antigravity_IDE_PROJECT_PATH}"
    else
        echo "Antigravity_IDE_PROJECT_PATH is not set"
    fi
}

# Main execution
if [ "$1" = "--help" ] || [ "$1" = "-h" ]; then
    echo "Antigravity IDE MCP Configuration Setup"
    echo ""
    echo "Usage:"
    echo "  source setup-mcp-env.sh              # Set to current directory"
    echo "  source setup-mcp-env.sh <path>      # Set to specific path"
    echo "  source setup-mcp-env.sh --show      # Show current path"
    echo "  source setup-mcp-env.sh --help      # Show this help"
    echo ""
    echo "Examples:"
    echo "  source setup-mcp-env.sh"
    echo "  source setup-mcp-env.sh /Users/chandangaur/Sites/kirodi-site/drkiodilal.in"
    echo "  source setup-mcp-env.sh --show"
elif [ "$1" = "--show" ]; then
    show_antigravity_project_path
elif [ -n "$1" ]; then
    set_antigravity_project_path_to "$1"
else
    set_antigravity_project_path
fi
