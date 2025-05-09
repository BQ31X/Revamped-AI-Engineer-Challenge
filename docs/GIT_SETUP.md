# 🔧 Git Setup Guide

Ready to level up your Git game? This guide is your ticket to becoming a Git ninja! We'll walk you through everything from basic setup to advanced workflows, making sure you're ready to rock your development journey. Just replace the placeholders (like `<YOUR-USERNAME>`) with your actual info, and you're good to go! 🚀

<details>
  <summary>📋 Prerequisites</summary>

  Before we dive in, let's make sure you've got the essentials:

  🌐 A GitHub account (your passport to the coding universe)  
  🔧 Git installed on your local machine (the command-line magic wand)  
  💻 A code editor (like Cursor, VS Code, etc. - your digital workshop)  
  ⌨️ Terminal access (Mac/Linux) or Command Prompt/PowerShell (Windows) - your command center  
  🔑 A GitHub Personal Access Token (PAT) - your secret handshake with GitHub

  <details>
    <summary>✅ Let's Make Sure Everything's Working!</summary>

    ```bash
    # Check if Git is ready to rock
    git --version

    # Test your GitHub connection (no more "who are you?" errors!)
    git ls-remote https://github.com/<YOUR-USERNAME>/<REPO-NAME>.git
    ```
  </details>
</details>

<details>
  <summary>⚙️ Initial Setup</summary>

  #### 1. Configure Git Identity

  Time to tell Git who you are! This is like setting up your developer ID card. Your Git identity is used to:
  - Sign your commits (like a digital signature)
  - Show up in commit history (your contributions are properly attributed)
  - Connect your work to your GitHub profile (when email matches)
  - Help other developers know who to contact about changes

  <details>
    <summary>⚠️ What happens if you don't set your identity?</summary>

    If you don't set your Git identity:
    - Commits will show as "unknown" or use your system username
    - Your contributions won't be linked to your GitHub profile
    - You might get warnings when trying to commit
    - Other developers won't know who to contact about your changes
  </details>

  ```bash
  # Set your name and email (Git needs to know who's making those awesome commits!)
  git config --global user.name "<YOUR-NAME>"
  git config --global user.email "<YOUR-EMAIL>"

  # Double-check your settings (always good to verify!)
  git config --list
  ```

  <details>
    <summary>💡 Pro Tips for Git Identity</summary>

    - **Name**: 
      - Can be your real name or a pseudonym
      - Will be publicly visible in commit history
      - Choose something you're comfortable with being public
    
    - **Email**:
      - Must match the email in your GitHub account for proper attribution
      - If you use multiple emails, you can set different identities per repository
      - For work projects, use your work email
      - For personal projects, use the email linked to your GitHub account

    - **Multiple Identities**:
    
    #### Set different identity for a specific repository, e.g.:

    cd /[PATH TO REPO]
    git config user.name "Work Name"
    git config user.email "work@company.com"
  
</details>

  <details>
    <summary>✅ Let's Make Sure Git Knows Who You Are!</summary>

    # Check if Git recognizes you
    git config user.name
    git config user.email

    # Should show your name and email - if not, Git might be confused! 🤔
    
    # Test your identity with a commit
    echo "# Test" >> README.md
    git add README.md
    git commit -m "test: verify git identity"
    git log -1  # Shows your most recent commit with your identity
    # Should show your name and email in the commit

  </details>

  <details>
    <summary>🔍 How to Verify These Instructions</summary>

    As a new Git user, it's smart to verify instructions! Here's how:

    1. **Test in a Safe Environment**:
       - Create a test repository to try commands
       - Use `git status` frequently to understand what's happening
       - If something goes wrong, you can always delete the test repo and start over

    2. **Verify Command Output**:
       - Most Git commands will show you what they're doing
       - If you're unsure, add `--dry-run` to commands (if supported)
       - Use `git status` to check the result

    3. **Common Verification Commands**:
     
       # See what Git is doing
       git status

       # View your commit history
       git log

       # See your last commit
       git log -1

       # Check your configuration
       git config --list
      

    4. **When in Doubt**:
       - Check the official Git documentation: https://git-scm.com/doc
       - Use `git help <command>` for detailed help
       - Ask in our Discord community: https://discord.gg/ai-makerspace

    > 💡 **Pro Tip**: Git is designed to be safe - it's hard to permanently lose work. If you're unsure about a command, you can usually undo it!
  </details>

  #### 2. Set Up GitHub Authentication

  <details>
    <summary>🔐 Setting Up Your GitHub Personal Access Token (PAT)</summary>

    > 📸 Need visual guidance? Check out our [Detailed PAT Setup Guide](https://github.com/AI-Maker-Space/Interactive-Dev-Environment-for-LLM-Development#setting-up-your-github-personal-access-token) with step-by-step screenshots!

    1. Create a Personal Access Token (PAT):
       - Head to GitHub → Settings → Developer settings → Personal access tokens
       - Click "Generate new token" (your golden ticket)
       - Set permissions (at minimum: "Contents - Read and write")
       - Copy and store your token somewhere safe (like a password manager)

    2. Configure credential storage (so you don't have to type your token every time):

    # For macOS (stores in Keychain - your digital vault)
    git config --global credential.helper osxkeychain

    # For Windows (stores in Credential Manager - your Windows safe)
    git config --global credential.helper wincred

    # For Linux (stores in memory - your temporary sticky note)
    git config --global credential.helper cache

    3. Verify your setup:
  
    # Test your authentication
    git clone https://github.com/<YOUR-USERNAME>/<YOUR-REPO-NAME>.git
    # You should be prompted for your username and PAT

  </details>
</details>

<details>
  <summary>🚀 Repository Setup</summary>

  #### 1. Forking and Cloning

  <details>
    <summary>🔄 How to Fork and Clone</summary>

    1. Fork the Repository:
       - Navigate to the original repository
       - Click the "Fork" button in the top-right corner (it's like making your own copy of the recipe!)
         ![Fork Button](https://i.imgur.com/bhjySNh.png)
       - Keep the repository name as is or change it if you prefer
       - Click "Create fork" (and just like that, you've got your own copy! 🎉)

    2. Clone Your Fork:
      ```bash
      # Navigate to where you want your project to live
      cd PATH_TO_DESIRED_PARENT_DIRECTORY

      # Clone your fork (this is like downloading your copy to your computer)
      git clone https://github.com/<YOUR-USERNAME>/<REPO-NAME>.git

      # Move into your new project directory
      cd <REPO-NAME>

      # Add the original repository as "upstream" (so you can keep up with the cool updates!)
      git remote add upstream https://github.com/<ORIGINAL-REPO-OWNER>/<REPO-NAME>.git

      # Check your remote connections
      git remote -v
      ```

    <details>
      <summary>✅ Let's Make Sure Everything's Connected!</summary>

      ```bash
      # Check your remote setup
      git remote -v
      # Should show both 'origin' (your fork) and 'upstream' (original repo)

      # Test your connections
      git fetch origin
      git fetch upstream
      # If these work, you're all set! 🎯
      ```
    </details>
  </details>

  #### 2. Configuring .gitignore

  <details>
    <summary>📁 Setting Up .gitignore</summary>

    Create a `.gitignore` file to keep unnecessary files out of your repository (like a bouncer at a club, it decides what gets in and what stays out!):

    ```bash
    # Create .gitignore
    touch .gitignore
    ```

    Add common patterns:

    ```gitignore
    # Dependencies (the heavy stuff)
    node_modules/
    venv/
    __pycache__/

    # Environment (your secret sauce)
    .env
    .env.local

    # IDE (your workspace settings)
    .vscode/
    .idea/
    *.swp

    # OS (those pesky system files)
    .DS_Store
    Thumbs.db
    ```

    <details>
      <summary>✅ Let's Make Sure Your .gitignore is Working!</summary>

      ```bash
      # Check if .gitignore is doing its job
      git status
      # Should not show any ignored files - if it does, your bouncer might be sleeping! 😴
      ```
    </details>
  </details>
</details>

<details>
  <summary>🔄 Development Workflow</summary>

  ### 1. Branch Management

  <details>
    <summary>🌿 Working with Branches</summary>

    1. Creating and Switching Branches:
      ```bash
      # Create and switch to a new branch (like creating a new timeline!)
      git checkout -b <YOUR-BRANCH-NAME>

      # Switch between branches (time travel, Git style!)
      git checkout <BRANCH-NAME>

      # List all branches (see all your parallel universes)
      git branch -a
      ```

    2. Making Changes:
      ```bash
      # Check status (what's changed in your universe?)
      git status

      # Stage changes (get your changes ready for the spotlight)
      git add <FILE-NAME>
      # or stage all changes (the "select all" of Git)
      git add .

      # Commit changes (seal the deal with a message)
      git commit -m "Description of changes"

      # Push to your fork (send your changes to the cloud)
      git push origin <YOUR-BRANCH-NAME>
      ```

    3. Keeping Your Fork Updated:
      ```bash
      # Fetch upstream changes (see what's new in the original)
      git fetch upstream

      # Merge upstream changes (bring in the cool new stuff)
      git merge upstream/main

      # Push updates to your fork (share the love)
      git push origin main
      ```

    <details>
      <summary>✅ Let's Check Your Branch Status!</summary>

      ```bash
      # Check branch status (see all your parallel universes)
      git branch -v
      # Should show all branches and their status

      # Verify remote tracking (make sure you're not lost in space)
      git branch -vv
      # Should show tracking information
      ```
    </details>
  </details>

  ### 2. Commit Message Conventions

  <details>
    <summary>📝 Writing Good Commit Messages</summary>

    Use this format for commit messages (like writing a good story):
    ```
    <type>(<scope>): <description>

    [optional body]

    [optional footer]
    ```

    Common types:
    1. `feat`: New feature (the cool new stuff)
    2. `fix`: Bug fix (the superhero saves the day)
    3. `docs`: Documentation changes (making things clearer)
    4. `style`: Code style changes (making it pretty)
    5. `refactor`: Code changes that neither fix bugs nor add features (spring cleaning)
    6. `test`: Adding or modifying tests (making sure everything works)
    7. `chore`: Changes to build process or auxiliary tools (housekeeping)

    Examples:
    ```bash
    git commit -m "feat(auth): add OAuth2 login support"
    git commit -m "fix(api): resolve timeout issues in user endpoint"
    git commit -m "docs(readme): update installation instructions"
    ```

    <details>
      <summary>✅ Let's Check Your Commit Message Style!</summary>

      ```bash
      # Check your last commit message
      git log -1
      # Should follow the conventional format - if not, time for a rewrite! ✍️
      ```
    </details>
  </details>

  ### 3. Pull Request Workflow

  <details>
    <summary>🔄 Creating and Managing PRs</summary>

    1. Creating a Pull Request:
       - Push your changes to your fork (get your code ready for the spotlight)
       - Go to your fork on GitHub
       - Click "Compare & pull request" (time to show off your work!)
       - Fill in the PR template (tell everyone what you've been up to)
       - Request reviews from team members (get some expert eyes on your work)

    2. PR Best Practices:
       - Write clear, descriptive titles (make it pop!)
       - Link related issues (connect the dots)
       - Include screenshots for UI changes (show, don't just tell)
       - Keep PRs focused and small (bite-sized is better)
       - Respond to review comments promptly (keep the conversation flowing)

    <details>
      <summary>✅ Let's Make Sure Your PR is Ready to Rock!</summary>

      ```bash
      # Check your branch status
      git status
      # Should be clean - no uncommitted changes

      # Verify your commits
      git log --oneline
      # Should show clear, conventional commit messages

      # Check if you're up to date
      git fetch upstream
      git status
      # Should be up to date with upstream
      ```
    </details>
  </details>
</details>

<details>
  <summary>🔧 Troubleshooting</summary>

  <details>
    <summary>🚫 Authentication Issues</summary>

    ```bash
    # Reset credentials (when GitHub forgets who you are)
    git config --global --unset credential.helper
    git config --global credential.helper osxkeychain  # or appropriate for your OS

    # Verify your PAT (check if your secret handshake still works)
    git ls-remote https://github.com/<YOUR-USERNAME>/<REPO-NAME>.git
    ```
  </details>

  <details>
    <summary>🔄 Merge Conflicts</summary>

    ```bash
    # Update your local main (get the latest and greatest)
    git checkout main
    git fetch upstream
    git merge upstream/main

    # Resolve conflicts (time to play peacemaker!)
    git checkout <YOUR-BRANCH>
    git merge main
    # Fix conflicts in your editor
    git add .
    git commit -m "fix: resolve merge conflicts"
    ```
  </details>

  <details>
    <summary>📝 Commit Message Mistakes</summary>

    ```bash
    # Fix last commit message (oops, let's rephrase that!)
    git commit --amend -m "feat: correct commit message"

    # Fix older commit messages (time travel to fix the past)
    git rebase -i HEAD~3  # Go back 3 commits
    # Change 'pick' to 'reword' for commits to edit
    ```
  </details>

  <details>
    <summary>🔄 Branch Issues</summary>

    ```bash
    # Delete local branch (clean up your workspace)
    git branch -d <BRANCH-NAME>

    # Delete remote branch (clean up the cloud)
    git push origin --delete <BRANCH-NAME>

    # Recover deleted branch (oops, didn't mean to do that!)
    git reflog
    git checkout -b <BRANCH-NAME> <COMMIT-HASH>
    ```
  </details>
</details>

<details>
  <summary>🎓 Additional Learning Resources</summary>

  - [Git Documentation](https://git-scm.com/doc) (the Git bible)
  - [GitHub Guides](https://guides.github.com/) (your Git playbook)
  - [Conventional Commits](https://www.conventionalcommits.org/) (the art of commit messages)
  - [GitHub Flow](https://guides.github.com/introduction/flow/) (the way of the Git warrior)
  - [GitHub Skills](https://skills.github.com/) (level up your Git game)

</details>

---

Remember: Git is your friend! 🚀 Happy coding! 💻