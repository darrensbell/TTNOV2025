GOVERNANCE.md

Universal App Structure and AI Behaviour Law
Mode: Balanced
Owner: Darren Bell
Effective Date: 17 Nov 2025
Status: Binding

This file governs every action taken by AI working inside this project.
Anything that does not comply with this document is invalid.

The model must locate this file by checking both GOVERNANCE.md and Governance.md.

⸻

1. Purpose

This app must remain:

• stable
• predictable
• safe to modify
• safe to extend

The AI must:

• never break working code
• never delete anything without permission
• never overwrite files without permission
• never assume user intent
• always protect styles, layouts, and index files
• propose structural changes before performing them
• allow Darren to save versions cleanly

The AI must balance:
	1.	safety
	2.	progress
	3.	clarity for the user (even when the user does not know file paths)

⸻

2. Authority Rules
	1.	Only written instructions from Darren Bell allow any change.
	2.	If unclear, the AI must stop and ask.
	3.	The AI may propose improvements but must not implement them until Darren explicitly approves.
	4.	Nothing is changed unless Darren writes approval.
	5.	Proposals must be short, precise, and linked to specific files.

⸻

3. App Structure Standard

src/
  pages/      route + view logic
  components/ reusable UI units
  services/   data, firestore, operations
  utils/      pure stateless helpers
  styles/     global + theme
  hooks/      shared React hooks
  contexts/   React context

Structure rules
	1.	If a file’s purpose is obvious, the AI may propose where it belongs.
	2.	If purpose is unclear, AI must ask Darren for clarification.
	3.	AI may never create new top-level folders outside src.
	4.	AI may create new folders inside src after proposing them and receiving approval.

⸻

4. File Protection Rules

4.1 Index File Protection

Protected files include:

• index.jsx
• index.js
• index.ts
• index.tsx

AI must not modify an index file unless Darren writes:

“I authorise modification of [full path].”

AI may read index files to understand structure.

⸻

4.2 Style File Protection

Includes:

• *.css
• *.module.css
• *.scss

The AI must not delete, merge, replace, or consolidate any style file unless Darren explicitly authorises it.

Allowed:

• read style files
• propose reorganisations
• request permission to merge or relocate
• create new style files if needed

Forbidden:

• auto-rewrite
• auto-merge
• auto-optimise

⸻

4.3 Duplicate Files Protection

If the AI detects two files with similar names or functions:

The AI must:
	1.	Read both files.
	2.	Summarise differences.
	3.	State whether they conflict, duplicate, or complement each other.
	4.	Present Darren with three options:
• keep A
• keep B
• merge A and B
	5.	Wait for explicit approval.

AI must never delete, merge, or move duplicates automatically.

⸻

4.4 No Deletion Without Permission

AI must never delete a file unless Darren writes:

“I authorise deletion of [path].”

⸻

4.5 No Full Overwrites

AI must never replace an entire file unless Darren writes:

“I authorise overwrite of [path].”

Partial edits are allowed only if Darren requests modifications to that file.

⸻

5. Behaviour Rules for Firebase AI

5.1 Task Workflow

Every task must follow:
	1.	Read GOVERNANCE.md
	2.	Confirm understanding
	3.	Ask Darren to name the file, folder, or feature
	4.	Act only within that scope
	5.	Output summary + changed files
	6.	Stop and wait

⸻

5.2 When Darren does not know file paths

The AI must:
	1.	Ask clarifying questions
	2.	Provide a short list of likely candidates
	3.	Wait for Darren to pick one
	4.	Only then act

⸻

5.3 Allowed Without File Paths

AI may do these autonomously:

• create new files
• create new folders inside src
• move files into obvious locations only after proposal + approval
• update import paths after approved moves

AI must always seek approval before larger reorganisations.

⸻

5.4 Proposals Before Action

AI must propose changes first when involving:

• folder moves
• renames
• logic consolidation
• modular splits
• merging duplicates
• reorganising styles

Only act after explicit approval.

⸻

5.5 No Autonomous Audits

The AI must not scan the project unless Darren writes:

“Audit this item”
or
“Audit this folder”

⸻

6. Editing Rules

AI may edit:

• functions
• JSX
• imports / exports
• logic
• new supporting files

AI must not edit:

• package.json
• Vite config
• eslint, prettier, or configs
• environment files
• GitHub workflow files

Unless Darren explicitly requests it.

⸻

7. Git + Versioning Rules (Balanced Mode)

The AI must support safe versioning, not block it.

7.1 The user is the release authority

The AI must never auto-version unless Darren explicitly says:

“Create version x.x.x”

7.2 After Darren requests a version

The AI must:
	1.	Commit all files touched in this task
	2.	Use commit message:

chore: version x.x.x


	3.	Push changes
	4.	Confirm success

7.3 If a commit fails

AI must stop immediately and report the error.

7.4 The AI must never interfere with Git operations

If Darren asks:

“Create a new version”
“Save this as v2.1.0”
“Commit the changes now”

The AI must do it.

⸻

8. Multi-File Safety Logic

Before making any change, the AI must check for:

• dependent imports
• dependent styles
• related index files
• duplicate names
• possible regressions

If risk is detected, AI must say:

“This may be unsafe because […]. Do you want me to continue?”

⸻

9. Output Format

After each operation, the AI must output:
	1.	Summary of what changed
	2.	List of changed files
	3.	Full content of each changed file
	4.	Confirmation of compliance with this file

It must not output:

• full project trees
• unrelated files
• GOVERNANCE.md itself
• config files

⸻

10. Precedence
	1.	Direct instruction from Darren
	2.	This GOVERNANCE.md
	3.	Existing src structure
	4.	Standard practice

⸻

11. Failsafe

If uncertain, the AI must stop and ask.

⸻

12. Latitude (Balanced Mode)

AI is allowed to:

• suggest structural improvements
• identify redundant files
• suggest merges
• suggest reorganisations
• suggest new supporting folders
• fix imports after movements
• create helper utilities
• create new modular files

AI must always propose first and wait for approval.

⸻

13. Final Rule

If the AI violates GOVERNANCE, all actions are invalid.
The AI must stop immediately and request correction.

