# MCP Configuration: Dynamic Project Paths

## Problem Statement

The current [`mcp_config.json`](../../../.gemini/antigravity/mcp_config.json) has hardcoded paths to a specific project (`/Users/chandangaur/development/Flutter Development/gym_mgmt`), which doesn't work when switching between different projects.

## Current Configuration Issues

### Filesystem Server (lines 28-37)
```json
"filesystem": {
  "args": [
    "-y",
    "@modelcontextprotocol/server-filesystem",
    "/Users/chandangaur/development/Flutter Development/gym_mgmt"  // ❌ Hardcoded
  ],
  "command": "npx",
  "disabled": false,
  "env": {}
}
```

### Memory Server (lines 38-48)
```json
"memory": {
  "args": [
    "-y",
    "@modelcontextprotocol/server-memory"
  ],
  "command": "npx",
  "disabled": false,
  "env": {
    "MEMORY_FILE_PATH": "/Users/chandangaur/development/Flutter Development/gym_mgmt"  // ❌ Hardcoded
  }
}
```

## Solution Options

### Option 1: Environment Variables (Recommended)

Use environment variables that can be set per project or globally.

**Configuration:**
```json
"filesystem": {
  "args": [
    "-y",
    "@modelcontextprotocol/server-filesystem",
    "${Antigravity_IDE_PROJECT_PATH}"
  ],
  "command": "npx",
  "disabled": false,
  "env": {}
},
"memory": {
  "args": [
    "-y",
    "@modelcontextprotocol/server-memory"
  ],
  "command": "npx",
  "disabled": false,
  "env": {
    "MEMORY_FILE_PATH": "${Antigravity_IDE_PROJECT_PATH}"
  }
}
```

**Setup:**
- Set `Antigravity_IDE_PROJECT_PATH` environment variable in your shell profile (`.zshrc`, `.bashrc`, etc.)
- Or set it per project using a `.env` file or project-specific script

**Example shell setup:**
```bash
# In ~/.zshrc or ~/.bashrc
export Antigravity_IDE_PROJECT_PATH="${PWD}"
```

---

### Option 2: Special Variables (Client-Dependent)

Some MCP clients support special variables like `${workspaceFolder}`.

**Configuration:**
```json
"filesystem": {
  "args": [
    "-y",
    "@modelcontextprotocol/server-filesystem",
    "${workspaceFolder}"
  ],
  "command": "npx",
  "disabled": false,
  "env": {}
},
"memory": {
  "args": [
    "-y",
    "@modelcontextprotocol/server-memory"
  ],
  "command": "npx",
  "disabled": false,
  "env": {
    "MEMORY_FILE_PATH": "${workspaceFolder}"
  }
}
```

**Note:** This depends on whether your MCP client (e.g., Cursor, Windsurf, etc.) supports `${workspaceFolder}` variable expansion.

---

### Option 3: Relative Paths from Config Location

Use paths relative to the config file location.

**Configuration:**
```json
"filesystem": {
  "args": [
    "-y",
    "@modelcontextprotocol/server-filesystem",
    "../Sites/kirodi-site/drkiodilal.in"
  ],
  "command": "npx",
  "disabled": false,
  "env": {}
},
"memory": {
  "args": [
    "-y",
    "@modelcontextprotocol/server-memory"
  ],
  "command": "npx",
  "disabled": false,
  "env": {
    "MEMORY_FILE_PATH": "../Sites/kirodi-site/drkiodilal.in"
  }
}
```

**Note:** This requires updating the path for each project and is less flexible.

---

### Option 4: Multiple Project Configurations

Create separate MCP configurations for different projects and switch between them.

**Structure:**
```
~/.gemini/antigravity/
├── mcp_config.json              # Default config
├── mcp_config_gym_mgmt.json     # Gym management project
├── mcp_config_drkiodilal.json   # Dr. Kiodilal website
└── mcp_config_other.json        # Other project
```

**Usage:**
- Symlink the desired config to `mcp_config.json`
- Or use a script to copy the appropriate config

---

## Recommended Approach

**Option 1 (Environment Variables)** is the most flexible and widely supported approach:

1. **Universal compatibility** - Works with any MCP client
2. **Easy to switch** - Just change the `Antigravity_IDE_PROJECT_PATH` environment variable
3. **Project-specific** - Can be set per project using `.env` files
4. **No client dependencies** - Doesn't rely on special variable support

## Implementation Steps

1. Update [`mcp_config.json`](../../../.gemini/antigravity/mcp_config.json) to use `${Antigravity_IDE_PROJECT_PATH}` variable
2. Set up the `Antigravity_IDE_PROJECT_PATH` environment variable in your shell profile
3. Test the configuration with the current project
4. Verify it works when switching to different projects

## Testing Checklist

- [ ] Configuration loads without errors
- [ ] Filesystem server can access the current project directory
- [ ] Memory server uses the correct project path
- [ ] Switching projects works by updating `PROJECT_PATH`
- [ ] All MCP servers function correctly with the new configuration
