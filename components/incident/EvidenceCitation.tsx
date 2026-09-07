"use client";

// Real agent output cites evidence IDs inline in free text -- e.g. a
// causal_chain step reading "...pool reduced from 50 to 5
// (ev-deploy-8dd9945303)", or a remediation rationale/post-mortem summary
// doing the same. This turns those citations from inert text into
// clickable references that jump to the actual item in the Evidence tab.
//
// RootCauseCard/RemediationCard/PostMortemCard (where citations appear)
// and EvidenceList (the Evidence tab's content) are siblings under
// InvestigationSection, each only ever rendered while its own tab is
// active -- a plain callback prop can't connect two components that
// aren't mounted at the same time, and EvidenceList itself may not exist
// in the DOM yet when a citation is clicked from a different tab. A
// window CustomEvent is what InvestigationSection listens for to switch
// tabs first; see its own comment for why it, not EvidenceList, owns that.
const EVIDENCE_ID_PATTERN = /\bev-[a-zA-Z0-9]+-[a-fA-F0-9]+\b/g;
export const EVIDENCE_JUMP_EVENT = "incident-pilot:jump-to-evidence";

export function jumpToEvidence(evidenceId: string) {
  window.dispatchEvent(new CustomEvent<string>(EVIDENCE_JUMP_EVENT, { detail: evidenceId }));
}

export function CitedText({ text }: { text: string }) {
  const matches = [...text.matchAll(EVIDENCE_ID_PATTERN)];
  if (matches.length === 0) {
    return <>{text}</>;
  }

  const nodes: React.ReactNode[] = [];
  let cursor = 0;
  matches.forEach((match, i) => {
    const id = match[0];
    const start = match.index ?? 0;
    if (start > cursor) {
      nodes.push(text.slice(cursor, start));
    }
    nodes.push(
      <button
        key={`${id}-${i}`}
        type="button"
        onClick={() => jumpToEvidence(id)}
        className="rounded border border-accent-border bg-accent-bg px-1 font-mono text-[0.85em] text-accent-text transition-colors hover:bg-accent-border"
      >
        {id}
      </button>,
    );
    cursor = start + id.length;
  });
  if (cursor < text.length) {
    nodes.push(text.slice(cursor));
  }

  return <>{nodes}</>;
}
