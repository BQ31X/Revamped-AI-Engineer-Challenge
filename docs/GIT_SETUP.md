# 🔧 Git Setup Guide

Ready to level up your Git game? This guide is your ticket to becoming a Git ninja! We'll walk you through everything from basic setup to advanced workflows, making sure you're ready to rock your development journey. Just replace the placeholders (like `<YOUR-USERNAME>`) with your actual info, and you're good to go! 🚀

## 📋 Prerequisites

Before we dive in, let's make sure you've got the essentials:

1. 🌐 A GitHub account (your passport to the coding universe)
2. 🔧 Git installed on your local machine
3. 💻 A code editor (like Cursor, VS Code, etc.)
4. ⌨️ Terminal access (Mac/Linux) or Command Prompt/PowerShell (Windows)
5. 🔑 A GitHub Personal Access Token (for authentication)

## ⚙️ Initial Setup

### 1. Configure Git Identity

Time to tell Git who you are! This is like setting up your developer ID card:

```bash
# Set your name and email (Git needs to know who's making those awesome commits!)
git config --global user.name "<YOUR-NAME>"
git config --global user.email "<YOUR-EMAIL>"

# Double-check your settings (always good to verify!)
git config --list
```

### 2. Set Up GitHub Authentication

<details>
  <summary>🔐 Setting Up Your GitHub Personal Access Token (PAT)</summary>

  > 📸 **Need visual guidance?** Check out our [Detailed PAT Setup Guide](https://github.com/AI-Maker-Space/Interactive-Dev-Environment-for-LLM-Development#setting-up-your-github-personal-access-token) with step-by-step screenshots!

  1. Create a Personal Access Token (PAT):
     - Head to GitHub → Settings → Developer settings → Personal access tokens
     - Click "Generate new token" (your golden ticket)
     - Set permissions (at minimum: "Contents - Read and write")
     - Copy and store your token somewhere safe (like a password manager)

  2. Configure credential storage (so you don't have to type your token every time):

  ```bash
  # For macOS (stores in Keychain)
  git config --global credential.helper osxkeychain

  # For Windows (stores in Credential Manager)
  git config --global credential.helper wincred

  # For Linux (stores in memory)
  git config --global credential.helper cache
  ```

  3. Verify your setup:
  ```bash
  # Test your authentication
  git clone https://github.com/<YOUR-USERNAME>/<YOUR-REPO-NAME>.git
  # You should be prompted for your username and PAT
  ```
</details>

## �� Repository Setup

<details>
  <summary>🔄 Forking and Cloning</summary>

  ### 1. Fork the Repository

  1. Navigate to the original repository
  2. Click the "Fork" button in the top-right corner
  3. Keep the repository name as is or change it if you prefer
  4. Click "Create fork"

  ### 2. Clone Your Fork

  ```bash
  # Navigate to your desired parent directory
  cd PATH_TO_DESIRED_PARENT_DIRECTORY

  # Clone your fork (replace with your GitHub username and repo name)
  git clone https://github.com/<YOUR-USERNAME>/<REPO-NAME>.git

  # Navigate into the cloned repository
  cd <REPO-NAME>

  # Add the original repository as "upstream"
  git remote add upstream https://github.com/<ORIGINAL-REPO-OWNER>/<REPO-NAME>.git

  # Verify your remotes
  git remote -v
  ```
</details>

<details>
  <summary>📁 Configuring .gitignore</summary>

  Create a `.gitignore` file to keep unnecessary files out of your repository:

  ```bash
  # Create .gitignore
  touch .gitignore
  ```

  Add common patterns:

  ```gitignore
  # Dependencies
  node_modules/
  venv/
  __pycache__/

  # Environment
  .env
  .env.local

  # IDE
  .vscode/
  .idea/
  *.swp

  # OS
  .DS_Store
  Thumbs.db
  ```
</details>

## 🔄 Development Workflow

<details>
  <summary>🌿 Branch Management</summary>

  ### 1. Creating and Switching Branches

  ```bash
  # Create and switch to a new branch
  git checkout -b <YOUR-BRANCH-NAME>

  # Switch between branches
  git checkout <BRANCH-NAME>

  # List all branches
  git branch -a
  ```

  ### 2. Making Changes

  ```bash
  # Check status
  git status

  # Stage changes
  git add <FILE-NAME>
  # or stage all changes
  git add .

  # Commit changes
  git commit -m "Description of changes"

  # Push to your fork
  git push origin <YOUR-BRANCH-NAME>
  ```

  ### 3. Keeping Your Fork Updated

  ```bash
  # Fetch upstream changes
  git fetch upstream

  # Merge upstream changes
  git merge upstream/main

  # Push updates to your fork
  git push origin main
  ```
</details>

## 🎯 Quick Reference

<details>
  <summary>📝 Common Commands</summary>

  ```bash
  # Status check
  git status

  # View commit history
  git log

  # Discard changes
  git checkout -- <FILE-NAME>

  # Update branch
  git pull origin <BRANCH-NAME>
  ```

  ### Branch Naming Conventions

  1. `feature/` - New features
  2. `bugfix/` - Bug fixes
  3. `docs/` - Documentation updates
  4. `refactor/` - Code refactoring
  5. `test/` - Adding or updating tests
</details>

## 🔍 Troubleshooting Guide

<details>
  <summary>⚠️ Common Issues and Solutions</summary>

  1. **Authentication Failures**
     - Verify your PAT is valid
     - Check token permissions
     - Clear stored credentials if needed

  2. **Merge Conflicts**
     ```bash
     # View conflicts
     git status
     
     # After resolving conflicts
     git add .
     git commit -m "Resolve merge conflicts"
     ```

  3. **Detached HEAD State**
     ```bash
     # Return to main branch
     git checkout main
     ```

  4. **Accidental Commits to Main**
     ```bash
     # Create new branch with changes
     git checkout -b <NEW-BRANCH>
     git push origin <NEW-BRANCH>
     ```
</details>

## 📝 Best Practices

<details>
  <summary>✨ Git Best Practices</summary>

  1. Write clear, descriptive commit messages
  2. Keep commits focused and atomic
  3. Regularly pull from upstream
  4. Use meaningful branch names
  5. Review changes before committing
  6. Keep your fork updated
  7. Use .gitignore appropriately
  8. Never commit sensitive information
</details>

## 🔐 Security Notes

<details>
  <summary>🔒 Security Best Practices</summary>

  1. Never commit:
     - API keys
     - Passwords
     - Private keys
     - Environment files (.env)
     - Node modules
     - Build artifacts

  2. Always use:
     - Environment variables for sensitive data
     - .gitignore for unnecessary files
     - Secure authentication methods
</details>

## 🎓 Learning Resources

<details>
  <summary>📚 Additional Resources</summary>

  1. [Git Documentation](https://git-scm.com/doc)
  2. [GitHub Guides](https://guides.github.com)
  3. [Git Cheat Sheet](https://education.github.com/git-cheat-sheet-education.pdf)
</details>