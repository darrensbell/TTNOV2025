GOVERNANCE.md

Universal App Structure and AI Conduct Law
Status: Binding
Owner: Darren Bell
Effective Date: 17 Nov 2025

This file governs every action taken by AI inside this project.
Anything that does not comply with this document is invalid.

The model must locate this file by checking both GOVERNANCE.md and Governance.md.
The content of this file always overrides model assumptions.

⸻

1. Purpose

This app must remain stable, predictable, and safe to change.
The AI must help improve the structure without breaking anything.
The AI must avoid damaging working code, overwriting logic, or deleting styles.
The AI must not assume or invent tasks.

The AI must balance two goals:
	1.	Prevent breaking changes.
	2.	Allow careful, guided improvement, even if the user does not know file paths.

⸻

2. Absolute Authority Rules
	1.	Only written instructions from Darren Bell allow any action.
	2.	If something is unclear, the AI must stop and ask a clear question.
	3.	The AI may propose improvements, but must never act on them until Darren approves.
	4.	Nothing is implemented unless Darren explicitly approves the action.

⸻

3. App Structure Standard

The app must follow this folder layout:

src/
  pages/      view and route logic
  components/ reusable UI units
  services/   data, network, caching, logic
  utils/      stateless helpers
  styles/     global and theme styles
  hooks/      shared React hooks
  contexts/   React context providers

Rules for structure:
	1.	The AI may move files into the correct folder if that file clearly belongs there.
	2.	The AI must never move a file if the purpose is uncertain. It must ask Darren first.
	3.	The AI may not create any new top level folder.
	4.	The AI may create new folders inside src if needed for clarity, but must state the purpose and wait for approval.

⸻

4. File Protection Rules

4.1 Index file protection

Index files are read only unless unlocked.
This includes:
	•	index.tsx
	•	index.ts
	•	index.jsx
	•	index.js

The AI must never delete, replace, merge, or rename an index file unless Darren writes:
“I authorise modification of [full path]”.

If the AI believes an index file needs changes, it must propose them, then wait.

4.2 Style file protection

Style files include:
	•	*.css
	•	*.module.css
	•	*.scss

The AI must never delete, merge, or overwrite any style file unless Darren gives permission.

The AI may:
	1.	read style files
	2.	propose improvements or reorganisations
	3.	request permission to clean or restructure
	4.	create new style files if needed

The AI must not auto merge or auto consolidate styling.

4.3 No deletion without explicit permission

The AI must never delete any file or folder unless Darren writes:
“I authorise deletion of [path]”.

If the AI thinks a file is redundant, it must propose removal, then wait.

4.4 No overwriting entire files

The AI must not replace the full content of any existing file unless Darren writes:
“I authorise overwrite of [path]”.

Partial edits are allowed if Darren has already asked for an update to that file.

4.5 Legacy files

If the AI discovers older duplicates or files in the wrong place, it must:
	1.	propose the correct final location
	2.	propose a migration plan
	3.	wait for approval

⸻

5. Behaviour Rules for Firebase AI

5.1 Scope of each task

Each task must follow this sequence:
	1.	Read GOVERNANCE.md
	2.	Confirm understanding
	3.	Ask Darren to name the feature, page, or component he wants fixed
	4.	Work only within that single scope
	5.	Output a summary and changed files
	6.	Stop and wait

The AI must not proceed to a second task without new instructions.

5.2 When Darren does not know file paths

The AI must:
	1.	Ask clarifying questions
	2.	Offer a short list of likely file candidates
	3.	Wait for Darren to pick one
	4.	Then act only on that file

5.3 Allowed operations without naming file paths

The AI may perform these without Darren specifying paths:
	1.	Create new files
	2.	Create new folders inside src
	3.	Move files into obvious correct locations if the purpose is extremely clear
Example: a React component file located in a folder named old-components is clearly a component
	4.	Update import paths after a move
	5.	Refactor a file internally if Darren asked for it

The AI must ask for approval before performing larger reorganisations.

5.4 Proposals before actions

The AI must propose structural changes before performing them.
Examples:
	•	proposing a better folder location
	•	proposing to merge duplicate logic
	•	proposing to move a service into the service folder
	•	proposing to modularise a large file
	•	proposing to create a new context

The AI must wait for explicit approval.

5.5 No autonomous audits

The AI must not:
	•	scan the whole project
	•	list violations
	•	attempt to restructure the project

Unless Darren writes:
“Audit this item”
or
“Audit this folder”
or
“Audit this feature”.

Then the AI must only examine the requested file or folder.

⸻

6. Editing Rules

6.1 Allowed edits

The AI may edit:
	•	functions
	•	JSX
	•	imports
	•	exports
	•	types
	•	logic inside the named file
	•	write new supporting files if needed

6.2 Forbidden edits

The AI must not:
	•	change project configuration
	•	change lint rules
	•	change formatting settings
	•	change Vite or Build settings
	•	change package.json
	•	change tsconfig
	•	create or modify workflow files unless asked
	•	modify Git settings
	•	add placeholder or dummy data
	•	generate fake code to fill gaps

⸻

7. Safety Rules

7.1 When uncertain

The AI must stop and ask.
Examples:
	•	purpose of a file unclear
	•	style file dependencies unclear
	•	similar files exist and the AI cannot tell which is correct
	•	moving a file might break imports
	•	refactoring might change behaviour

7.2 If the AI detects breakage risk

The AI must say:

“This change may be unsafe for the following reason. Do you want me to continue”

It must never silently risk breaking the app.

⸻

8. Output Format

After every operation, the AI must output:
	1.	A short summary
	2.	A list of changed files
	3.	The full content of each changed file
	4.	A statement confirming it followed GOVERNANCE.md

The AI must not output:
	•	unrelated files
	•	copies of the entire project
	•	GOVERNANCE.md itself
	•	config files


The AI must not start, plan, or propose work on any master cleanup plan step unless I explicitly say:

"Run Step X from the master cleanup plan."

General suggestions like "I recommend" or "we should" are not permission. They must be treated as discussion only.
⸻

9. Precedence

If rules conflict:
	1.	Direct instruction from Darren Bell
	2.	This GOVERNANCE.md
	3.	Existing src structure
	4.	Standard practice

⸻

10. Failsafe

If the AI is unsure, it must stop and ask.
If the AI is about to break something, it must stop and ask.
If the AI sees two possible interpretations, it must stop and ask.

No assumptions. No silent corrections.

⸻

11. Latitude for the AI

To allow productive work without constant micro instructions, the AI has controlled latitude in these areas:
	1.	Suggesting better structure
	2.	Suggesting moves or renames
	3.	Suggesting style reorganisation
	4.	Creating new supporting files
	5.	Generating cleaner code
	6.	Updating imports after a move
	7.	Identifying duplicates
	8.	Proposing consolidation of logic
	9.	Creating new folders where missing
	10.	Cleaning unused imports or unreachable code

But the AI must always present proposals first and wait for approval before altering existing files.

11.1	Canonical File Rule

The application must never contain two files that implement the same component or feature. When two versions appear to exist, the AI must identify the canonical file by comparing the contents of both files, not by guessing or inferring.

A canonical file is the one that contains the full implementation. This includes logic, hooks, styles, and JSX. A second version may exist only as a thin compatibility shim.

A compatibility shim must do the following and nothing else:

• Contain a single re export statement
• Contain no logic, styling, state, or side effects
• Contain a clear comment that identifies the canonical file

Allowed example:

// Compatibility shim. The canonical component is in src/components/IngestionModal.
export { default } from '../../components/IngestionModal';

Rules the AI must follow:

• The AI must check and compare the content of both files before deciding which is canonical
• The canonical version must always live inside the correct folder that matches the GOVERNANCE structure
• The shim must never diverge from the canonical version
• The shim must never contain duplication of logic or styling
• The AI must never delete a non empty file unless you give written approval
• If the AI detects ambiguity between two possible canonical files, the AI must halt and request a written decision
• The AI must update imports only after the canonical file has been confirmed

This rule prevents duplication, prevents accidental overwrite, and ensures all logic lives in exactly one place.

12. Final rule

If the AI breaks this governance file, the operation is invalid.
The AI must stop immediately and request correction.