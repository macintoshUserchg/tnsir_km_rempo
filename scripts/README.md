# Antigravity IDE MCP Configuration Setup

This directory contains scripts to help you set up the Antigravity IDE MCP configuration with dynamic project paths.

## Overview

The MCP configuration at [`~/.gemini/antigravity/mcp_config.json`](../../../.gemini/antigravity/mcp_config.json) has been updated to use the `Antigravity_IDE_PROJECT_PATH` environment variable instead of hardcoded paths. This allows you to switch between different projects without manually updating the configuration file.

## Quick Start

### Option 1: Set to Current Directory (Recommended)

When you open a project in Antigravity IDE, run:

```bash
source scripts/setup-mcp-env.sh
```

This sets `Antigravity_IDE_PROJECT_PATH` to your current working directory.

### Option 2: Set to Specific Directory

```bash
source scripts/setup-mcp-env.sh /path/to/your/project
```

### Option 3: Check Current Setting

```bash
source scripts/setup-mcp-env.sh --show
```

## Permanent Setup

To make this permanent, add one of the following to your shell profile (`~/.zshrc` or `~/.bashrc`):

### Automatic (Uses Current Directory)

```bash
# Add to ~/.zshrc or ~/.bashrc
export Antigravity_IDE_PROJECT_PATH="${PWD}"
```

### Manual (Specify Default Project)

```bash
# Add to ~/.zshrc or ~/.bashrc
export Antigravity_IDE_PROJECT_PATH="/Users/chandangaur/Sites/kirodi-site/drkiodilal.in"
```

### Using the Setup Script

```bash
# Add to ~/.zshrc or ~/.bashrc
source /Users/chandangaur/Sites/kirodi-site/drkiodilal.in/scripts/setup-mcp-env.sh
```

## How It Works

The MCP configuration now uses `${Antigravity_IDE_PROJECT_PATH}` in two places:

1. **Filesystem Server** - Allows MCP to access files in your project
2. **Memory Server** - Stores memory files in your project directory

### Before (Hardcoded)

```json
"filesystem": {
  "args": [
    "-y",
    "@modelcontextprotocol/server-filesystem",
    "/Users/chandangaur/development/Flutter Development/gym_mgmt"
  ],
  ...
}
```

### After (Dynamic)

```json
"filesystem": {
  "args": [
    "-y",
    "@modelcontextprotocol/server-filesystem",
    "${Antigravity_IDE_PROJECT_PATH}"
  ],
  ...
}
```

## Switching Projects

When you switch to a different project:

1. Open the new project directory in your terminal
2. Run: `source scripts/setup-mcp-env.sh`
3. Restart Antigravity IDE (if needed) to pick up the new environment variable

## Troubleshooting

### MCP servers not working

1. Check if the environment variable is set:
   ```bash
   source scripts/setup-mcp-env.sh --show
   ```

2. Verify the path exists:
   ```bash
   ls -la "${Antigravity_IDE_PROJECT_PATH}"
   ```

3. Restart Antigravity IDE to reload the MCP configuration

### Variable not persisting

Make sure you've added the export command to your shell profile and sourced it:
```bash
source ~/.zshrc  # or ~/.bashrc
```

## Additional Resources

- See [`plans/mcp-dynamic-project-paths.md`](../plans/mcp-dynamic-project-paths.md) for detailed implementation options
- See [`~/.gemini/antigravity/mcp_config.json`](../../../.gemini/antigravity/mcp_config.json) for the full MCP configuration
