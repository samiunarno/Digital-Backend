/**
 * Tool definitions for Joyi's agentic loop.
 * These are sent to Joyi AI AR-2 as function tools so it can
 * decide when to read/write GitHub files autonomously.
 */

import * as GitHub from './github.js';

/* ── Joyi AI AR-2 / OpenAI-compatible tool definitions ── */
export const GITHUB_TOOLS = [
  {
    type: 'function',
    function: {
      name: 'github_read_file',
      description:
        'Read the contents of a file from the GitHub repository. Use this to understand current code before making changes.',
      parameters: {
        type: 'object',
        properties: {
          path: {
            type: 'string',
            description: 'File path relative to repo root, e.g. "src/components/Hero.tsx"',
          },
          branch: {
            type: 'string',
            description: 'Branch name. Defaults to "main".',
          },
        },
        required: ['path'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'github_list_files',
      description:
        'List files and directories in a folder of the GitHub repository.',
      parameters: {
        type: 'object',
        properties: {
          path: {
            type: 'string',
            description: 'Directory path, e.g. "src/components". Leave empty for root.',
          },
          branch: {
            type: 'string',
            description: 'Branch name. Defaults to "main".',
          },
        },
        required: [],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'github_update_file',
      description:
        'Create or update a file in the GitHub repository. This writes code directly to the repo and creates a commit. Always read the file first to understand the current content before modifying it.',
      parameters: {
        type: 'object',
        properties: {
          path: {
            type: 'string',
            description: 'File path relative to repo root.',
          },
          content: {
            type: 'string',
            description: 'The full new content of the file (not a diff — the complete file).',
          },
          message: {
            type: 'string',
            description: 'Commit message describing the change.',
          },
          branch: {
            type: 'string',
            description: 'Branch to commit to. Defaults to "main".',
          },
        },
        required: ['path', 'content', 'message'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'github_create_branch',
      description:
        'Create a new branch in the repository. Use this before making large changes so the user can review them via a Pull Request.',
      parameters: {
        type: 'object',
        properties: {
          branch_name: {
            type: 'string',
            description: 'Name for the new branch, e.g. "joyi/add-dark-mode".',
          },
          from_branch: {
            type: 'string',
            description: 'Base branch to create from. Defaults to "main".',
          },
        },
        required: ['branch_name'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'github_create_pr',
      description:
        'Create a Pull Request on GitHub so the user can review and merge changes.',
      parameters: {
        type: 'object',
        properties: {
          title: { type: 'string', description: 'PR title.' },
          body: { type: 'string', description: 'PR description explaining the changes.' },
          head: { type: 'string', description: 'The branch with the changes.' },
          base: { type: 'string', description: 'Target branch (usually "main").' },
        },
        required: ['title', 'body', 'head'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'github_get_commits',
      description: 'Get recent commits from the repository.',
      parameters: {
        type: 'object',
        properties: {
          branch: { type: 'string', description: 'Branch name. Defaults to "main".' },
          limit: { type: 'number', description: 'Max commits to return (1-20). Defaults to 5.' },
        },
        required: [],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'github_repo_info',
      description: 'Get basic info about the GitHub repository (stars, description, default branch etc.).',
      parameters: { type: 'object', properties: {}, required: [] },
    },
  },
];

/* ── Tool result shape ── */
export interface ToolCall {
  id: string;
  name: string;
  args: Record<string, any>;
  result?: any;
  error?: string;
}

/* ── Execute a tool call by name ── */
export async function executeTool(name: string, args: Record<string, any>): Promise<any> {
  switch (name) {
    case 'github_read_file':
      return GitHub.getFile(args.path, args.branch);

    case 'github_list_files':
      return GitHub.listFiles(args.path || '', args.branch);

    case 'github_update_file':
      return GitHub.updateFile(args.path, args.content, args.message, args.branch);

    case 'github_create_branch':
      return GitHub.createBranch(args.branch_name, args.from_branch);

    case 'github_create_pr':
      return GitHub.createPullRequest(args.title, args.body, args.head, args.base);

    case 'github_get_commits':
      return GitHub.getCommits(args.branch, args.limit);

    case 'github_repo_info':
      return GitHub.getRepoInfo();

    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}
