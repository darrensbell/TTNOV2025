Right, this is about control, not vibes.

The AI is doing 3 things you hate:
	1.	Centralising or rewriting styles so one change nukes several components.
	2.	Deleting or overwriting style files instead of leaving them alone.
	3.	Touching tooling (lint, prettier, configs) when you need them stable.

So we tighten the law around:
	•	Styles, tokens, and CSS files.
	•	Deletion and renaming.
	•	What it may and may not touch in configs.
	•	“Only work on what I just asked you to do.”

Here is a revised GOVERNANCE.md that keeps the lean size, but is much stricter about styles and deletion, and removes anything that might encourage it to be “helpful” outside your instruction.

Replace your current GOVERNANCE.md with this.

⸻


# GOVERNANCE.md  
Universal Structural and Execution Law  
Status: Binding  
Owner: Darren Bell  
Effective date: 16 Nov 2025

This file is the single source of truth for how this app is structured and how AI is allowed to change it.  
Anything that ignores this file is invalid.

---

## 1. Purpose

Keep the app:

- predictable and stable  
- modular and traceable  
- safe to change without hidden side effects  

The AI must only work on the current problem and the current written instruction.  
The AI must never implement anything that has not been explicitly asked for.

No guessing. No creative refactors. No dummy data.

---

## 2. Authority

- Only written instructions from Darren Bell may change structure, behaviour, or styles.  
- No inference or silent correction.  
- Ambiguity means stop and ask.  
- Nothing is implemented unless explicitly requested.

---

## 3. Folder structure

Use this layout:

```txt
src/
  pages/      route and view composition
  components/ reusable UI units
  services/   data, I O, network, transforms
  utils/      pure stateless helpers
  styles/     theme and shared styles
  hooks/      shared React hooks
  contexts/   React context providers

Rules:
	•	No loose files in src. Everything goes into a subfolder.
	•	Do not add, move, or rename top level folders without explicit written approval.

⸻

4. Folder rules

src/pages
	•	One folder per route or view.
	•	Entry file: index.tsx.
	•	May import components, services, utils, hooks, contexts.
	•	No low level I O inside JSX if it can live in a service or hook.

src/components
	•	One folder per component, index.tsx as main entry.
	•	May import utils, hooks, contexts, and its own styles.
	•	Must not import services directly.
	•	Accept data via props.

src/services
	•	Group by domain (for example auth, reports).
	•	May import utils and, if needed, hooks.
	•	Must not import pages or components.
	•	No JSX.

src/utils
	•	Pure functions only.
	•	No side effects, no I O.
	•	Must not import pages, components, or services.

src/styles

This is critical and non negotiable.
	•	You may have one global file (for example global.css) for base resets, fonts, and global theme tokens.
	•	You may also have multiple other CSS files for shared layout, charts, dashboards, etc.
	•	Component level styles must live in *.module.css files, next to the component, or in a clearly named styles file that belongs only to that component or feature.
	•	Styles must not be merged or centralised by the AI unless Darren explicitly instructs it.
	•	Styles for different features must keep their own files and folders if they do different things.

The AI must never:
	•	delete a CSS file, SCSS file, or *.module.css file,
	•	merge multiple style files into one,
	•	rename style files,

unless Darren names the exact file and gives written permission to delete, merge, or rename it.

src/hooks
	•	Names start with use.
	•	May import services and utils.
	•	Must not import pages.

src/contexts
	•	One folder per context.
	•	Expose a Provider and a useX hook.
	•	Must not import pages.

⸻

5. Naming and size
	•	PascalCase for components and their folders.
	•	camelCase for functions, services, and utils.
	•	Hooks start with use.
	•	No names like temp.ts or final.tsx.

Soft line limits:
	•	pages and components: 250
	•	hooks and utils: 200
	•	services: 300
	•	*.module.css or individual CSS files: 150

If a file is getting too big, the AI must propose a split instead of forcing more into it, and must wait for approval.

⸻

6. Imports and dependencies

Allowed directions:
	•	pages → components, services, utils, hooks, contexts
	•	components → utils, hooks, contexts, their own styles
	•	services → utils, and optionally hooks
	•	utils → nothing outside utils

Styles are only imported by their matching page or component, or by a small number of clearly related components when Darren has set that pattern.

No circular imports.

The AI must not change import paths for styles unless Darren asks for that exact change.

⸻

7. Migration, deletion, and safety

Default posture: move and adapt, do not delete.

The AI must not:
	•	delete any file,
	•	rename any file,

unless Darren names the file and explicitly authorises delete or rename in writing.

If a move is requested:
	1.	Plan the new path.
	2.	Create the destination.
	3.	Move the file.
	4.	Fix imports for that file only.
	5.	Run build and type checks (do not disable lint or prettier).
	6.	Confirm the app starts without errors.

The AI must never disable, edit, or remove:
	•	eslint configuration,
	•	prettier configuration,
	•	tsconfig, vite config, or package.json scripts,

unless Darren gives explicit written permission for that exact file.

⸻

8. AI execution rules (FIRST LAW)

These rules control how AI works inside this repo.

8.1 Where AI may write

AI may:
	•	create or edit files inside src only,
	•	create folders inside src.

AI must not:
	•	change anything outside src,
	•	rename or delete top level folders,
	•	touch environment files, build config, lint config, format config, or tooling,
	•	change git configuration or deployment settings.

8.2 Scope of a single task

A single task may:
	•	change one main file,
	•	adjust import lines in directly dependent files if required.

No unrelated logic changes.
No whole project refactors.
No “helpful” rewrites of styles or shared components.

8.3 Exports and placeholders
	•	Do not change default exports into named exports, or the reverse, unless told to.
	•	No dummy components, no fake data, no empty functions.
	•	If logic or styles exist in older code and are needed, copy the real implementation into src instead of inventing a new one.

8.4 Task workflow

Every task must follow this pattern:
	1.	Darren names the file or feature.
	2.	AI reads this GOVERNANCE.md.
	3.	AI does only that work.
	4.	AI outputs a short summary and the changed file content.
	5.	AI stops and waits.

No automatic next steps, no extra “improvements”.

8.5 Reporting

For each task, AI must provide:
	•	a short summary,
	•	list of files changed,
	•	full content of changed src files only.

AI must not:
	•	print unrelated files,
	•	restate this GOVERNANCE.md,
	•	show config files that were not supposed to be touched.

8.6 Failsafe

If the AI:
	•	cannot resolve an import,
	•	sees conflicting versions of a file,
	•	hits unclear structure,
	•	is unsure how styles are intended to be organised,
	•	is tempted to delete or merge CSS, styles, or tokens,

it must stop and ask for a clear written decision.

⸻

9. Change management

Before stating that a change is complete:
	•	all imports in the touched files must resolve,
	•	build and typecheck must pass,
	•	lint and format rules must remain enabled,
	•	folder structure must still match this file,
	•	no unrelated files were touched.

The AI must never “fix” lint or format issues by disabling rules or removing scripts.

⸻

10. Enforcement and precedence

If rules clash, order is:
	1.	Direct written instruction from Darren Bell.
	2.	This GOVERNANCE.md.
	3.	Local patterns inside src.
	4.	General best practice.

Non compliant work is rejected and may be rolled back.

The AI must treat this file as binding on every task.


> Read GOVERNANCE.md. Confirm you understand

