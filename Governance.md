GOVERNANCE.md (lean version)

# GOVERNANCE.md  
Universal Structural and Execution Law  
Status: Binding  
Owner: Darren Bell  
Effective date: 15 Nov 2025

This file is the single source of truth for how this app is structured and how AI is allowed to change it.  
Anything that ignores this file is invalid.

## 1. Purpose

Keep the app:

- predictable and stable  
- modular and traceable  
- safe to change without hidden side effects  

No guessing. No creative refactors. No dummy data.

---

## 2. Authority

- Only written instructions from Darren Bell may change structure or behaviour.  
- No inference or silent correction.  
- Ambiguity means stop and ask.  
- Nothing is implemented unless explicitly requested.

---

## 3. Folder structure

Use this exact layout:

```txt
src/
  pages/      route and view composition
  components/ reusable UI units
  services/   data, I O, network, transforms
  utils/      pure stateless helpers
  styles/     global and component styles
  hooks/      shared React hooks
  contexts/   React context providers

Rules:
	•	No loose files in src. Everything goes into a subfolder.
	•	Do not add new top level folders without approval.
	•	Do not move or rename these folders without approval.

⸻

4. Folder rules

src/pages
	•	One folder per route or view.
	•	Entry file: index.tsx.
	•	May import components, services, utils, hooks, contexts.
	•	No direct low level I O inside JSX if it can live in a service or hook.

src/components
	•	One folder per component, index.tsx as main entry.
	•	May import utils, hooks, contexts.
	•	Must not import services directly.
	•	Accept data via props.

src/services
	•	Group by domain (for example auth, reports).
	•	May import utils.
	•	Must not import pages or components.
	•	No JSX.

src/utils
	•	Pure functions only.
	•	No side effects, no I O.
	•	Must not import pages, components, or services.

src/styles
	•	One global.css file.
	•	Component styles live as *.module.css beside the component.
	•	No cross component hacks.

src/hooks
	•	Names start with use.
	•	May import services and utils.
	•	Must not import pages.

src/contexts
	•	One folder per context.
	•	Expose Provider and a useX hook.
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
	•	*.module.css: 150

If a file is getting too big, propose a split instead of stuffing more in.

⸻

6. Imports and dependencies

Allowed directions:
	•	pages → components, services, utils, hooks, contexts
	•	components → utils, hooks, contexts
	•	services → utils
	•	utils → nothing outside utils

Styles are only imported by their matching page or component.

No circular imports.

⸻

7. Migration and deletion
	•	Default: move and adapt, do not delete.
	•	Delete only with explicit approval.

If you move something:
	1.	Plan new path.
	2.	Create destination.
	3.	Move file.
	4.	Fix imports.
	5.	Run build and type checks.
	6.	Confirm app starts without errors.

⸻

8. AI execution rules (FIRST LAW)

These rules control how AI works inside this repo.

8.1 Where AI may write

AI may:
	•	create or edit files inside src only
	•	create folders inside src

AI must not:
	•	change anything outside src
	•	rename or delete top level folders
	•	touch environment files, build config, or tooling

8.2 Scope of a single task

A single task may:
	•	change one main file
	•	adjust import lines in directly dependant files if required

No unrelated logic changes.
No whole project refactors.

8.3 Exports and placeholders
	•	Do not change default exports into named exports, or the reverse, unless told to.
	•	No dummy components, no fake data, no empty functions.
	•	If logic exists in legacy code and is needed, copy the real implementation into src.

8.4 Task workflow

Every task follows this pattern:
	1.	Darren names the file or feature.
	2.	AI reads GOVERNANCE.md.
	3.	AI does only that work.
	4.	AI outputs a short summary and the changed file content.
	5.	AI stops and waits.

No automatic next steps.

8.5 Reporting

For each task, AI must provide:
	•	a short summary
	•	list of files changed
	•	full content of changed src files only

AI must not print unrelated files or echo this GOVERNANCE.md file.

8.6 Failsafe

If the AI:
	•	cannot resolve an import
	•	sees conflicting versions of a file
	•	hits unclear structure
	•	is unsure which rule wins

it must stop and ask for a clear written decision.

⸻

9. Change management

Before saying a change is complete:
	•	imports must resolve
	•	build and typecheck must pass
	•	structure must still match this file
	•	no unrelated files were touched

⸻

10. Enforcement and precedence

If rules clash, order is:
	1.	Direct written instruction from Darren Bell
	2.	This GOVERNANCE.md
	3.	Local patterns inside src
	4.	General best practice

Non compliant work is rejected and may be rolled back.

---

### Why this will help your credit usage

1. **Shorter file**  
   This version is much shorter, with less repetition. Fewer tokens loaded each time the AI reads it.

2. **No demand to echo governance**  
   The old version plus your prompts often caused the model to restate big chunks. I have now explicitly told it: *“AI must not print unrelated files or echo this GOVERNANCE.md file.”*

3. **Smaller reporting contract**  
   The old law forced long bullet lists and repeated checks. The new one only requires a short summary, list of changed files, and the changed file content. That reduces output tokens per step.

If you want to go even more aggressive on saving credits, you can also tell Firebase AI in each prompt:

> Do not restate or quote GOVERNANCE.md. Only say that you have read and will follow it.
