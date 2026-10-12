#!/usr/bin/env python3
"""Apply crew-dcs module-docstring architecture docs (docstring-only changes).

Replaces (or inserts) the top-level module docstring in each target file
using ast to locate the existing docstring precisely. Idempotent.

Usage:  python3 apply_docstrings.py [/path/to/crew-dcs]
"""
import ast
import pathlib
import sys

REPO = pathlib.Path(sys.argv[1]) if len(sys.argv) > 1 else pathlib.Path.home() / "GitHub" / "crew-dcs"

EDITS: dict[str, str] = {}

EDITS["src/crew_dcs/__init__.py"] = '''"""crew_dcs — a Python SDK for the Domo platform APIs.

`crew_dcs` gives you programmatic access to the Domo platform: datasets,
cards, pages, dataflows, users, groups, AppDB, Code Engine, Jupyter
Workspaces, and more. It is built on `httpx` and is **async at every I/O
boundary** — API calls are `async` and return structured responses, never
raw `httpx.Response` objects.

## The entry point: an auth object

Everything starts with an authentication object from `crew_dcs.auth`. Pick
the class that matches the credential you hold:

| Auth class | Credential | Typical use |
|---|---|---|
| `DomoTokenAuth` | Access token (Admin → Access Tokens) | Scripts and automation |
| `DomoFullAuth` | Username + password | Interactive sessions |
| `DomoDeveloperAuth` | OAuth2 client ID + secret | developer.domo.com apps |
| `DomoJupyterFullAuth` / `DomoJupyterTokenAuth` | inside Domo | Jupyter |

Construct the auth once, then pass it as the first argument to any route
function or entity class:

```python
import asyncio

from crew_dcs.auth import DomoTokenAuth
from crew_dcs.routes.access_token import get_access_tokens


async def main() -> None:
    auth = DomoTokenAuth(
        domo_access_token="...",
        domo_instance="mycompany",  # mycompany.domo.com
    )
    res = await get_access_tokens(auth)
    if res.is_success:
        print(res.response)


asyncio.run(main())
```

Every auth class exposes `await auth.who_am_i()` — call it first to verify
credentials before doing real work.

## How the library is built: the layers

```text
crew_dcs.auth      credentials in, auth headers + session pooling out
crew_dcs.routes    one module per Domo API endpoint family — the HTTP boundary
crew_dcs.classes   curated entity objects (DomoDataset, ...) on routes
crew_dcs.client    the request pipeline: get_data, looper, RouteContext
crew_dcs.base      shared plumbing: entity registry + exception hierarchy
```

**Routes map to individual Domo APIs — one function per endpoint
operation, with minimal business logic.** A route function builds the URL,
calls `crew_dcs.client.get_data.get_data()`, checks
`ResponseGetData.is_success`, raises a route-level exception on failure,
and returns the API payload essentially as Domo sent it. That thinness is
deliberate: what you read in Domo's API docs (or a browser network trace)
is what the route returns — no hidden transformation to debug.

**Classes are the curated layer.** `crew_dcs.classes` wraps the same routes
in friendlier entity objects — `DomoDataset.from_dict()`, collection
managers like `DomoDatasets`, access controllers, PDP helpers — so
application code reads like Domo concepts instead of HTTP calls. Classes
never make HTTP calls directly; they always delegate to a route module.

## What you can assume from any module

- **Async at I/O boundaries only** — anything that touches the network is
  `async`; pure transforms stay sync.
- **Explicit auth on every call** — no global client state or ambient
  credentials; the `auth` object carries the instance, token, and session
  pool.
- **`ResponseGetData` everywhere** — routes return the same dataclass:
  `status`, `response` (the parsed body), `is_success`, plus
  `request_metadata` and `additional_information` for debugging.
- **Typed, per-module exceptions** — failures raise subclasses of
  `crew_dcs.base.exceptions.RouteError` named after the module and HTTP
  method family, e.g. `AccessToken_GET_Error`, `Jupyter_CRUD_Error`.
- **Import from subpackages, not the package root** — e.g.
  `from crew_dcs.auth import DomoTokenAuth`. The root re-exports only
  `__version__`, `entities`, and `exceptions`.
- **Session reuse is on by default** — one pooled `httpx.AsyncClient` per
  auth object amortizes TCP/TLS handshakes across calls (opt out with
  `RouteContext(reuse_session=False)`; response *caching* is separate and
  opt-in via `cache_responses=True`).

## Debugging and logging

Every route and `get_data` call accepts a `RouteContext` (or equivalent
keyword arguments) with debugging knobs:

- `debug_api=True` — print and log each request as it fires.
- `dry_run=True` — build the request and return it *without sending*;
  check `ResponseGetData.is_dry_run` before believing a write landed.
- `return_raw=True` — attach the raw `httpx.Response` for inspection.

For structured colored logging, configure once at your entry point with
`crew_dcs.utils.logging.set_domolibrary_logger()`, and use the
`is_log_client` / `is_log_route` / `is_log_class` flags on `RouteContext`
to quiet individual layers.

## Exceptions

All errors derive from `crew_dcs.base.exceptions.DomoError`, which carries
structured context (`status`, `entity_id`, `domo_instance`,
`additional_context`). `RouteError` additionally holds the failed
`ResponseGetData` as `.res` and pulls the human-readable message out of the
API payload for you. Catch the per-module subclass when you want to handle
one failure mode, or `DomoError` to catch everything the library raises.
"""
'''

EDITS["src/crew_dcs/routes/__init__.py"] = '''"""Route functions — the HTTP boundary of crew_dcs.

Every module in this package maps to **one Domo API endpoint family**
(`access_token.py` ↔ `/api/data/v1/accesstokens`, `card.py` ↔ the card
APIs, `jupyter/` ↔ the Jupyter Workspace APIs, ...), and each function in
a module maps to **a single endpoint operation**. Routes are deliberately
thin: they build the URL, call `crew_dcs.client.get_data.get_data()`,
check `ResponseGetData.is_success`, raise a route-level exception on
failure, and hand back the payload essentially as Domo returned it.

Minimal business logic is a feature, not a gap:

- **Predictability** — what Domo's API returns is what you get; there is
  no hidden transformation to reverse-engineer when debugging.
- **Docs transfer** — Domo's own API documentation (or a browser network
  trace) applies directly to a route's inputs and outputs.
- **Safe composition** — the curated entity classes in `crew_dcs.classes`
  build on routes without fighting baked-in opinions.

## Anatomy of a route function

Abridged from `access_token.py` — every route follows this shape:

```python
@gd.route_function
@log_call(level_name="route", ...)
async def get_access_tokens(
    auth: DomoAuth,
    return_raw: bool = False,
    *,
    context: RouteContext | None = None,
    **context_kwargs,
) -> rgd.ResponseGetData:
    url = f"https://{auth.domo_instance}.domo.com/api/data/v1/accesstokens"
    res = await gd.get_data(url=url, method="GET", auth=auth, context=context)
    if not res.is_success:
        raise AccessToken_GET_Error(res=res)
    return res
```

The common signature is `auth`, domain arguments, then an optional
`context: RouteContext | None` plus `**context_kwargs` — so every route
accepts the same debugging/session knobs (`debug_api`, `dry_run`,
`session`, `is_log_route`, ...) regardless of which API it wraps. The
`@gd.route_function` decorator builds the `RouteContext` for you; pass a
pre-built one to share a session or settings across calls.

## Route exceptions

Each module defines its own exception subclasses of
`crew_dcs.base.exceptions.RouteError`, named after the HTTP method family:
`<Thing>_GET_Error` for retrieval failures, `<Thing>_CRUD_Error` for
create/update/delete failures (plus domain-specific ones where useful,
e.g. `SearchAccessTokenNotFoundError`). They all carry the failed
`ResponseGetData` as `.res`, so the status, response body, and request
metadata stay inspectable inside an `except` block.

## Pagination

Collection endpoints are typically wrapped with
`crew_dcs.client.get_data.looper()`, which iterates offset/limit pages and
aggregates the records — set `loop_until_end=True` to drain a collection.

Prefer `crew_dcs.classes` for application code; drop to routes when no
entity wrapper exists yet, when you need the exact API payload, or when
you want the route-level exception types.
"""
'''

EDITS["src/crew_dcs/base/exceptions.py"] = '''"""The crew_dcs exception hierarchy.

Every error the library raises derives from `DomoError`, so a single
`except DomoError` catches anything crew_dcs throws — while each subclass
tells you *which layer* failed:

```text
DomoError                    base — carries structured context
├── AuthError                authentication / token failures
├── RouteError               a Domo API returned an error response
│   ├── <Module>_GET_Error   per-route-module retrieval failures
│   └── <Module>_CRUD_Error  per-route-module write failures
├── TransportError           no HTTP response at all (DNS, TLS, timeout)
├── ClassError               entity-class (curated layer) failures
└── GetDataError / LooperError   client pipeline (VPN/allowlist block pages)
```

## What an exception carries

`DomoError` stores context as plain attributes instead of burying it in a
message string: `status` (HTTP code), `entity_id` / `entity_name`,
`function_name` / `parent_class` (where it was raised), `domo_instance`,
`additional_context`, and `is_warning` for non-fatal conditions. Its string
representation is assembled from whatever context is present.

`RouteError` (and `AuthError`) also keep the failed response as `.res` — a
`crew_dcs.client.response.ResponseGetData` — and mine it for you: when no
explicit `message` is passed, the constructor pulls `message` / `error` /
`reason` out of the API payload and copies `status` and `domo_instance`
off the response.

## Catching

Catch at the granularity you can handle:

```python
from crew_dcs.base.exceptions import DomoError, RouteError
from crew_dcs.routes.access_token import AccessToken_GET_Error, get_access_tokens

try:
    res = await get_access_tokens(auth)
except AccessToken_GET_Error as e:
    # one specific failure mode — full response still attached
    print(e.status, e.res.response)
except RouteError as e:
    # any API-layer failure
    print(e.status, e.message)
except DomoError as e:
    # anything crew_dcs raised, from any layer
    print(e)
```

`TransportError` means the request never got a response (network-level),
and `crew_dcs.client.get_data.GetDataError` means Domo served an HTML
block page (VPN/allowlist) instead of JSON — both are distinct from a Domo
API that answered with an error status, which always surfaces as a
`RouteError` subclass.
"""
'''

EDITS["src/crew_dcs/client/get_data.py"] = '''"""The request pipeline every crew_dcs API call flows through.

`get_data()` performs a single HTTP request against a Domo API endpoint
and returns a `crew_dcs.client.response.ResponseGetData` — never a raw
`httpx.Response`. Route functions in `crew_dcs.routes` are thin wrappers
around this module, and entity classes in `crew_dcs.classes` wrap the
routes. If you are debugging *any* crew_dcs call, this is where it
actually went over the wire.

What's here:

- `get_data()` — one request in, one `ResponseGetData` out. Handles
  header assembly (`create_headers`), auth session pooling, optional
  response caching, redirect policy, timeouts, and Domo's HTML block
  pages (VPN/allowlist interstitials are detected and raised as
  `GetDataError` instead of surfacing as JSON-decode noise).
- `get_data_stream()` — the streaming variant, for large downloads and
  upload bodies.
- `looper()` — paginated collection retrieval: iterates offset/limit
  pages and aggregates records (`loop_until_end=True` to drain a
  collection), with optional collection-level caching.
- `route_function()` — the decorator every route function uses; builds
  the `RouteContext` from either a pre-built context or keyword
  arguments, so all routes share one signature convention.
- `httpx_session_context()` — async context manager for explicit session
  lifecycle when you want to manage pooling yourself.

## Debugging knobs

All of these are accepted by `get_data` / `looper` directly, and by every
route function via `RouteContext` or `**context_kwargs`:

- `debug_api=True` — print and log each request as it fires.
- `dry_run=True` — assemble the request and return it *without sending*;
  the result reports `is_dry_run == True` so a simulated write can't be
  mistaken for a real one.
- `return_raw=True` — keep the raw `httpx.Response` on
  `ResponseGetData.raw_response`.
- `return_on_domo_block=True` — return the block-page response instead of
  raising `GetDataError` (useful for health probes).
- `session=` / `RouteContext.reuse_session` — share, or disable, the
  pooled `httpx.AsyncClient`.

Failures before a response exists (DNS, TLS, timeout) are logged and
re-raised as-is. Failures *with* a response come back as
`ResponseGetData(is_success=False)` for the route layer to turn into a
typed `crew_dcs.base.exceptions.RouteError` subclass.
"""
'''

EDITS["src/crew_dcs/client/__init__.py"] = '''"""Client package public API.

The client package is the request pipeline between route functions and
`httpx`: `context.RouteContext` carries per-call settings (debugging,
sessions, caching, dry-run), `get_data` / `get_data_stream` / `looper`
execute the requests, and `response.ResponseGetData` is the uniform
result type every route returns. See the `crew_dcs.client.get_data`
module docstring for the pipeline overview and debugging knobs.

Keep this module minimal to avoid circular imports. Individual modules should
import concrete symbols directly from submodules (for example
``from crew_dcs.auth import DomoAuth``) rather than relying on
package-level re-exports.

The client modules are still available via dot notation:
- crew_dcs.auth
- crew_dcs.entities
- etc.
"""
'''

EDITS["src/crew_dcs/client/context.py"] = '''"""Route context for API request configuration.

This module provides the `RouteContext` dataclass — the single carrier
for per-call settings across every layer of crew_dcs: debugging
(`debug_api`, `debug_num_stacks_to_drop`), safety (`dry_run`), transport
(`session`, `reuse_session`, `is_verify`, `is_follow_redirects`), caching
(`cache_responses`, `invalidate_cache`), and per-layer log suppression
(`is_log_client` / `is_log_route` / `is_log_class`).

One context, all layers: a `RouteContext` built once can be threaded
through entity classes → route functions → `get_data` unchanged, and each
layer honors the same knobs. Route functions also accept the equivalent
keyword arguments and build the context for you via
`RouteContext.build_context()` (usually through the `@gd.route_function`
decorator), so passing `debug_api=True` or `dry_run=True` straight to a
route works too.
"""
'''

EDITS["src/crew_dcs/client/response.py"] = '''"""The uniform response type for every crew_dcs API call.

`ResponseGetData` is what every route function (and `get_data` /
`looper`) returns: `status`, the parsed `response` body, and
`is_success`, plus debugging context — `request_metadata` (the exact
URL / headers / params / body sent), `response_headers`, `elapsed`, and
`additional_information` for pipeline annotations (cache hits,
API-contract mismatches, pagination metadata).

Two members matter for safety:

- `is_dry_run` — a dry run reports `status=200, is_success=True`, so
  check this property before believing a write actually landed.
- `raw_response` — only populated when the call passed `return_raw=True`.

`RequestMetadata` captures the outgoing request and can redact auth
headers via `to_dict(auth_headers=[...])`.
"""
'''

EDITS["src/crew_dcs/auth/__init__.py"] = '''"""Domo authentication classes for various authentication methods.

This module re-exports authentication classes for different Domo auth methods:
- DomoAuth: Base authentication class
- DomoFullAuth: Username/password authentication
- DomoTokenAuth: Access token authentication
- DomoDeveloperAuth: OAuth2 client credentials authentication
- DomoJupyterAuth: Base Jupyter authentication
- DomoJupyterFullAuth: Jupyter with username/password
- DomoJupyterTokenAuth: Jupyter with access token

Type Hinting:
All authentication classes (DomoTokenAuth, DomoFullAuth, DomoDeveloperAuth, etc.)
inherit from DomoAuth and implement the same interface via shared mixins, so
functions can accept `DomoAuth` and work with any auth subclass.

## The entry point to the library

An auth object is the first thing you construct and the only thing every
other layer requires: pass it as the first argument to route functions
(`crew_dcs.routes`) and entity classes (`crew_dcs.classes`). The auth
object owns the instance hostname, the credential, and — by default — a
pooled `httpx.AsyncClient` shared across calls (see
`crew_dcs.client.context.RouteContext.reuse_session`). Verify a fresh
credential with `await auth.who_am_i()` before doing real work.
"""
'''

EDITS["src/crew_dcs/base/__init__.py"] = '''"""
Domo entity system.

This package provides foundational classes for all Domo entities with support
for authentication, relationships, lineage tracking, and entity management.

Modules:
- base: Foundational classes and enhanced enums
- entities: Core Domo entity classes and managers

The design provides a consistent interface across all Domo entity types
while supporting advanced features like lineage tracking and relationships.

The `exceptions` module defines the single hierarchy every crew_dcs error
derives from — `DomoError` → `AuthError` / `RouteError` /
`TransportError` / `ClassError`, with per-route-module `<X>_GET_Error` /
`<X>_CRUD_Error` subclasses under `RouteError`. See the
`crew_dcs.base.exceptions` module docstring for the full tree and catching
strategy.
"""
'''

EDITS["src/crew_dcs/classes/__init__.py"] = '''"""Entity-class entrypoints.

This package is the preferred scripting surface for agents and automation.
Import entity modules (for example ``crew_dcs.classes.DomoDataset``) rather
than scripting directly against ``crew_dcs.routes``.

The exports below intentionally expose high-traffic entity modules used by
runbooks/projects while keeping imports lazy to avoid circular-import regressions.

## The curated layer

Routes return `ResponseGetData` wrappers around raw API payloads; classes
turn those into the Domo objects you actually want to work with —
`DomoDataset.from_dict()`, collection managers like `DomoDatasets`,
access controllers, PDP helpers, lineage. Classes never make HTTP calls
directly: every network operation delegates to a `crew_dcs.routes`
module, and `session` / `context` pass straight through, so the same
debugging knobs (`debug_api`, `dry_run`, ...) work at this layer too.

Factories are part of the contract — e.g. `DomoDataset.from_dict()` can
return a `DomoDatasetView` or `DomoSemanticModel` depending on payload
shape — so code against the base type.
"""
'''

EDITS["src/crew_dcs/utils/logging/__init__.py"] = '''"""
Logging utilities for crew_dcs.

This module provides custom logging processors and utilities specifically designed
for crew_dcs components, keeping the codebase clean and organized.

## Using it from your code

- crew_dcs modules grab the shared logger with `get_colored_logger()` and
  decorate entry points with `@log_call(...)`; route and auth functions
  default to DEBUG level.
- Scripts and notebooks configure once at the entry point:
  `set_domolibrary_logger(app_name="my-script", min_level="DEBUG")`.
- Too chatty? Suppress a layer per call via
  `crew_dcs.client.context.RouteContext`: `is_log_client=False` (the
  `get_data` pipeline), `is_log_route=False` (route functions),
  `is_log_class=False` (entity classes).
- MCP tool calls can redirect logs to the calling client by setting
  `RouteContext.logger`.
"""
'''

EDITS["src/crew_dcs/routes/jupyter/__init__.py"] = '''"""Route functions for the Domo Jupyter Workspace APIs.

This package follows the `crew_dcs.routes` conventions exactly: thin
async functions — one per endpoint operation — that call
`crew_dcs.client.get_data` and return `ResponseGetData`, with failures
raising the typed exceptions from `crew_dcs.routes.jupyter.exceptions`
(`Jupyter_GET_Error`, `Jupyter_CRUD_Error`, `JupyterWorkspace_Error`).

For Jupyter Workspaces running inside Domo, use the Jupyter-capable auth
classes — `crew_dcs.auth.DomoJupyterFullAuth` (username/password) or
`crew_dcs.auth.DomoJupyterTokenAuth` (access token); from outside Domo,
standard auth classes work as with any other route package.
"""
'''

EDITS["src/crew_dcs/routes/jupyter/exceptions.py"] = '''"""Exceptions raised by the Jupyter Workspace route functions.

All derive from `crew_dcs.base.exceptions.RouteError` and follow the
library-wide naming convention: `Jupyter_GET_Error` for retrieval
failures, `Jupyter_CRUD_Error` for create/update/delete failures, and
`JupyterWorkspace_Error` for workspace-level operations. The failed
`ResponseGetData` is available as `.res` on each.
"""
'''

def apply(rel: str, new_literal_body: str) -> str:
    path = REPO / rel
    if not path.exists():
        return f"SKIP (missing): {rel}"
    src = path.read_text()
    tree = ast.parse(src)
    doc = ast.get_docstring(tree, clean=False)
    literal = new_literal_body
    if doc is None:
        new_src = literal + "\n" + src
        action = "inserted"
    else:
        expr = tree.body[0]
        assert isinstance(expr, ast.Expr), rel
        lines = src.splitlines(keepends=True)
        start = expr.lineno - 1
        end = expr.end_lineno  # exclusive line index
        new_src = "".join(lines[:start]) + literal + "".join(lines[end:])
        action = "replaced"
    # verify the result parses and has the expected docstring
    new_tree = ast.parse(new_src)
    new_doc = ast.get_docstring(new_tree, clean=False)
    assert new_doc and len(new_doc) > 100, f"docstring not set for {rel}"
    path.write_text(new_src)
    return f"{action}: {rel} ({len(new_doc.splitlines())} docstring lines)"

for rel, body in EDITS.items():
    print(apply(rel, body))
print("DONE")
