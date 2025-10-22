Always use bd for task tracking
Issues chained together like beads. A lightweight issue tracker with first-class dependency support.

Usage:
  bd [command]

Available Commands:
  blocked       Show blocked issues
  close         Close one or more issues
  compact       Compact old closed issues to save space
  completion    Generate the autocompletion script for the specified shell
  create        Create a new issue (or multiple issues from markdown file)
  daemon        Run background sync daemon
  delete        Delete an issue and clean up references
  dep           Manage dependencies
  export        Export issues to JSONL format
  help          Help about any command
  import        Import issues from JSONL format
  init          Initialize bd in the current directory
  label         Manage issue labels
  list          List issues
  quickstart    Quick start guide for bd
  ready         Show ready work (no blockers)
  rename-prefix Rename the issue prefix for all issues
  renumber      Renumber all issues to compact the ID space
  reopen        Reopen one or more closed issues
  restore       Restore full history of a compacted issue from git
  show          Show issue details
  stats         Show statistics
  sync          Synchronize issues with git remote
  update        Update an issue
  version       Print version information

Flags:
      --actor string     Actor name for audit trail (default: $BD_ACTOR or $USER)
      --db string        Database path (default: auto-discover .beads/*.db or ~/.beads/default.db)
  -h, --help             help for bd
      --json             Output in JSON format
      --no-auto-flush    Disable automatic JSONL sync after CRUD operations
      --no-auto-import   Disable automatic JSONL import when newer than DB
      --no-daemon        Force direct storage mode, bypass daemon if running
      --label string     Add labels like [copy], [ui], [task] when creating backlogs for better organization (e.g., for site content vs. design).

Use "bd [command] --help" for more information about a command.
