Universal Structural and Execution Law
Status: Binding
Owner: Darren Bell
Effective date: 15 Nov 2025

This document is the single source of truth for how the application is built, maintained, and modified.
It combines the full governance framework and the operational FIRST LAW instructions into one binding file.

Any output created in breach of this document is invalid.

⸻

1. Purpose

The aim is to maintain a clean, predictable, stable application where:

• every file has a defined home
• imports never break
• folders remain consistent
• changes cannot create hidden side effects
• all logic is modular and traceable
• AI cannot refactor or guess behaviour
• human changes remain safe and reversible

The app must always remain understandable, maintainable, and stable.

⸻

2. Authority

• Only written instructions from Darren Bell may authorise any structural change.
• No inference, assumption, or silent correction is allowed.
• Ambiguity requires immediate halt and clarification.
• Dummy data is forbidden.
• Nothing may be implemented without explicit written instruction.

⸻

3. Global folder structure

The application must use the following exact structure:

src/
  pages/          route and view level composition only
  components/     reusable UI or logic units
  services/       data, I O, network, caching, transforms
  utils/          pure stateless helpers
  styles/         global and component styles only
  hooks/          custom React hooks
  contexts/       React context providers

Rules:

• No loose files in src. Everything lives inside a subfolder.
• Each folder defines a strict boundary. No cross boundary imports.
• The folder map must never be changed without explicit approval.
• New top level folders may not be created unless instructed.

⸻

4. Detailed organisational map

4.1 src/pages

Purpose: route level logic only.

Rules:

• one folder per route or view
• entry file named index.tsx
• may use parts folder, hooks folder, or Controller.tsx
• no direct service or I O access
• accepts data only from props or state managers

4.2 src/components

Purpose: reusable UI or controlled logic units.

Rules:

• one folder per component
• contain index.tsx plus an optional *.module.css
• accept data via props
• must not import services directly
• may import utils
• keep components self contained and modular

4.3 src/services

Purpose: data access, transforms, I O, and external integration.

Rules:

• one folder per domain or integration
• must return typed outputs
• may import utils
• must not import from pages or components
• no UI logic is permitted

4.4 src/utils

Purpose: pure helpers.

Rules:

• no side effects
• no I O
• no imports from pages, components, or services
• grouped by domain folder such as dates, strings, math

4.5 src/styles

Purpose: global and module specific styling.

Rules:

• exactly one global.css file
• component styles must be *.module.css files beside the component
• no cross component overrides
• no ad hoc global CSS

4.6 src/hooks

Purpose: shared hooks.

Rules:

• names must start with use
• must not import pages
• may import utils
• must not contain service I O unless explicitly permitted

4.7 src/contexts

Purpose: React context providers.

Rules:

• one folder per context
• must export a Provider and Hook
• must not import services unless explicitly approved

⸻

5. Naming rules

• PascalCase for component names and component folders
• camelCase for utilities, services, and functions
• hooks must begin with use
• no generic names such as final.js or temp.ts
• index.tsx files must only export the public API of a folder

⸻

6. File size caps

• components and pages: maximum 250 lines
• hooks and utils: maximum 200 lines
• services: maximum 300 lines
• *.module.css: maximum 150 lines

If a file approaches its limit:
	1.	halt
	2.	announce modularisation requirement
	3.	propose clean named split
	4.	wait for approval
	5.	apply split when instructed
	6.	update imports
	7.	confirm stability

⸻

7. Import boundaries

Correct:

• pages may import components, services, utils
• components may import utils
• services may import utils
• utils import nothing outside utils
• styles imported only by their paired component or page

Incorrect imports must never be added.

⸻

8. Dependency direction

Allowed:

pages → components
pages → services
pages → utils
components → utils
services → utils
utils → nothing

Circular dependencies are forbidden.

⸻

9. No delete migration posture

Deletion requires explicit written approval.
Default posture is move and adapt.

Migration protocol:
	1.	plan new locations
	2.	create destination
	3.	move, do not delete
	4.	keep thin re export shims until validated
	5.	adjust only what is needed
	6.	update imports
	7.	audit all paths
	8.	build, typecheck, lint
	9.	runtime smoke test
	10.	maintain shims until approved
	11.	delete only with explicit authorisation

⸻

10. Styling law

• global styles live only in styles/global.css
• each component maintains its own *.module.css
• no shared CSS files except global.css

⸻

11. Logging and error rules

• services handle errors
• pages surface and display them
• components remain presentational
• logging tools live in utils/logging

⸻

12. FIRST LAW operational rules

(Integrated directly into this file)

These rules define how AI must execute all tasks.

12.1 Allowed modifications

AI may only:

• create or edit files inside src
• modify imports inside src
• create folders inside src
• copy real logic from legacy folders into src when instructed

AI may not:

• modify anything outside src
• rename, delete, or reorganise anything outside src
• create dummy components or placeholder logic
• infer missing behaviour
• perform global refactors
• change export type of any component unless instructed
• fix unrelated issues
• run multi file operations without approval

12.2 Task execution model

Every task must follow this pattern:
	1.	Darren names exact file or feature
	2.	AI reads GOVERNANCE.md
	3.	AI performs only that single step
	4.	AI stops
	5.	Darren reviews and tests
	6.	Darren confirms
	7.	Only then may the next step begin

AI may not progress automatically.

12.3 Atomic change rule

Each task may change:

• one primary file
• any dependent import lines only if required

No logic changes beyond the task scope.
No changes to unrelated files.

12.4 Import and export rules

• no imports from legacy folders
• no change to default or named export type
• no unresolved imports
• if an import cannot be resolved, AI must halt and request direction

12.5 No placeholders

• no empty functions
• no mock logic
• no fake data
• if code is missing, AI must copy real logic from legacy folders

12.6 Reporting requirements

After each step the AI must output:

• summary of change
• list of all touched files
• full content of any changed files
• list of updated imports
• confirmation of compliance with GOVERNANCE
• recommended next steps
• explicit confirmation that no legacy folders were edited

12.7 Failsafe

If uncertain:

halt and request instruction.

⸻

13. Change Management Law
	1.	assess impact first
	2.	apply changes atomically
	3.	verify stability before reporting

⸻

14. Quality laws

• correctness: all output must be syntactically valid
• consistency: naming, casing, and structure must follow this file
• persistence: maintain correct awareness of file locations
• non recursion: no repeated or self triggered edits
• immutable output: do not revise verified code without instruction
• structural priority: structure comes before aesthetic
• deterministic completion: end each task in a stable state

⸻

15. Formatting rules

• exact spelling and casing
• no automatic re formatting of JSON, SQL, or JSX
• UTF 8 encoding
• single trailing newline
• no smart quotes

⸻

16. Critical component lockdown

Frozen modules listed in LOCKED_COMPONENTS.md cannot be edited without direct override.

⸻

17. Enforcement

• non compliant work is rejected
• violations trigger rollback
• suspected breaches must be surfaced immediately

⸻

18. Ultimate failsafe

If any rule conflicts, the precedence order is:
	1.	written instruction from Darren Bell
	2.	this GOVERNANCE.md file
	3.	local folder rules
	4.	standard best practice

