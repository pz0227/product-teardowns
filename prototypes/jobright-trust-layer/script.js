/* Trust Layer prototype. All data fictional (persona: Jordan Lee).
   Demonstrates: a provenance state model, read-never-generated pauses, resume
   diff review, a submission trust gate, and a live TQA verdict.
   No storage, no network, no real submission.

   v2 change (see README changelog): approval and groundedness are separate
   dimensions. Confirming or editing a claim makes it AUTHORIZED, never
   EVIDENCE-BACKED. The state model below enforces that distinction, and
   submission is never self-verified by the agent. */
"use strict";

/* ---------------- provenance model ----------------
   Ordered roughly by how much independent support exists behind a value. */
const PROV = {
  PROFILE:   { id: "profile",   label: "Profile-verified",  cls: "ok",   trusted: true  },
  EVIDENCE:  { id: "evidence",  label: "Evidence-backed",   cls: "ok",   trusted: true  },
  POLICY:    { id: "policy",    label: "Policy-derived",    cls: "ok",   trusted: true  },
  ASSERTED:  { id: "asserted",  label: "User-asserted",     cls: "warn", trusted: false },
  GENERATED: { id: "generated", label: "Model-generated",   cls: "bad",  trusted: false },
  NONE:      { id: "none",      label: "Unsupported",       cls: "bad",  trusted: false },
};

/* ---------------- state ---------------- */

const facts = [
  { id: "employer", label: "Latest employer", value: "Brightfield Media (fictional)",
    prov: PROV.PROFILE, genAllowed: false },
  { id: "education", label: "Education", value: "B.A. Economics, Lakeview University (fictional)",
    prov: PROV.PROFILE, genAllowed: false },
  { id: "workauth", label: "Work authorization", value: "Authorized; will require sponsorship in the future",
    prov: PROV.PROFILE, genAllowed: false },
  {
    id: "referral", label: "Referral", value: null, prov: PROV.NONE, genAllowed: false,
    ask: {
      text: "This application asks whether you have a referral. There is nothing in your profile. The agent will not invent one.",
      options: [
        { label: "No referral", value: "No", prov: PROV.ASSERTED },
        { label: "Yes, I have one (type name)", prompt: true, prov: PROV.ASSERTED },
      ],
    },
  },
  {
    id: "salary", label: "Expected salary", value: null, prov: PROV.NONE, genAllowed: false,
    ask: {
      text: "The posting states $70,000 to $85,000 per year (annual unit detected). Your saved policy: 'prefer the JD midpoint when a range is posted.' Proposed answer: $77,500 / year.",
      options: [
        { label: "Use $77,500 / year", value: "$77,500 / year", prov: PROV.POLICY },
        { label: "Enter a different amount", prompt: true, prov: PROV.ASSERTED },
      ],
    },
  },
];

const diffs = [
  {
    id: "d1", target: "Experience bullet · Brightfield Media",
    before: "Analyzed subscriber churn data and presented findings to the growth team.",
    after: "Analyzed subscriber churn across 12 cohorts and presented a retention playbook adopted by the growth team.",
    why: "Match JD keyword 'retention strategy'.",
    sourceNote: "Cohort count and 'adopted playbook' are NOT in the canonical profile.",
    prov: PROV.GENERATED, status: "pending", ack: false,
  },
  {
    id: "d2", target: "Skills section",
    before: "SQL, Excel, Tableau.",
    after: "SQL, Excel, Tableau, A/B testing.",
    why: "JD lists experiment experience.",
    sourceNote: "A/B testing appears in profile project 'Pricing page test, 2025'.",
    prov: PROV.EVIDENCE, status: "pending", ack: false,
  },
];

/* Submission is a three-state machine. The agent can reach "attempted";
   only an external signal can reach "verified". That asymmetry is the
   whole point of failure mode #7 in the teardown. */
let submission = "not_attempted"; // not_attempted | attempted | verified | failed

/* ---------------- rendering ---------------- */

const $ = (sel) => document.querySelector(sel);
const badge = (text, cls) => `<span class="badge ${cls}">${text}</span>`;

function renderFacts() {
  $("#factsTable tbody").innerHTML = facts.map((f) => {
    const val = f.value ? f.value : `<span class="missing">Missing, agent paused</span>`;
    return `<tr>
      <td><strong>${f.label}</strong></td>
      <td>${val}</td>
      <td>${badge(f.prov.label, f.prov.cls)}</td>
      <td>${f.genAllowed ? badge("allowed", "neutral") : badge("never", "bad")}</td>
    </tr>`;
  }).join("");
}

function renderPause() {
  const pending = facts.find((f) => !f.value && f.ask);
  const box = $("#pauseBox");
  if (!pending) { box.hidden = true; return; }
  box.hidden = false;
  $("#pauseText").textContent = pending.ask.text;
  const actions = $("#pauseActions");
  actions.innerHTML = "";
  pending.ask.options.forEach((opt, i) => {
    const b = document.createElement("button");
    b.textContent = opt.label;
    if (i === 0) b.classList.add("primary");
    b.onclick = () => {
      let v = opt.value;
      if (opt.prompt) {
        v = window.prompt("Enter the value to use (demo only):");
        if (!v) return;
      }
      pending.value = v;
      pending.prov = opt.prov;
      update();
    };
    actions.appendChild(b);
  });
}

function renderDiffs() {
  $("#diffList").innerHTML = diffs.map((d) => {
    const statusCls = d.status === "pending" ? "pending" : `resolved-${d.status}`;
    const statusTxt = { pending: "NEEDS REVIEW", approved: "APPROVED", rejected: "REJECTED" }[d.status];
    const risky = d.status === "approved" && !d.prov.trusted;
    const actions = d.status === "pending"
      ? `<div class="diff-actions">
           <button data-act="approve" data-id="${d.id}">Approve</button>
           <button data-act="edit" data-id="${d.id}">Edit</button>
           <button data-act="reject" data-id="${d.id}">Reject</button>
         </div>`
      : "";
    const warn = risky && !d.ack
      ? `<div class="ack">
           <strong>Approved, but still not evidence-backed.</strong> Confirming a claim
           authorizes it; it does not create evidence for it. This content will be
           submitted under your name and recorded as <em>${d.prov.label.toLowerCase()}</em>.
           <div class="diff-actions">
             <button data-act="ack" data-id="${d.id}">I understand, submit it anyway</button>
             <button data-act="reject" data-id="${d.id}">Actually, revert it</button>
           </div>
         </div>`
      : risky && d.ack
        ? `<div class="acked">Acknowledged: submitting as ${d.prov.label.toLowerCase()}, not as verified content.</div>`
        : "";
    return `<div class="diff-card ${statusCls}">
      <div class="diff-head"><strong>${d.target}</strong>
        <span class="diff-status ${d.status}">${statusTxt}</span></div>
      <div class="diff-block before">${d.before}</div>
      <div class="diff-block after">${d.after}</div>
      <div class="diff-meta"><span class="why">Why: ${d.why}</span><br>
        Source check: ${d.sourceNote} ${badge(d.prov.label, d.prov.cls)}</div>
      ${actions}${warn}
    </div>`;
  }).join("");

  document.querySelectorAll(".diff-actions button").forEach((b) => {
    b.onclick = () => {
      const d = diffs.find((x) => x.id === b.dataset.id);
      switch (b.dataset.act) {
        case "approve": d.status = "approved"; break;
        case "reject":  d.status = "rejected"; d.after = d.before; d.prov = PROV.PROFILE; d.ack = false; break;
        case "ack":     d.ack = true; break;
        case "edit": {
          const v = window.prompt("Edit the proposed text (demo only):", d.after);
          if (v === null) return;
          d.after = v;
          d.status = "approved";
          // Editing changes WHO asserted the claim, not whether evidence exists.
          d.prov = PROV.ASSERTED;
          d.sourceNote = "User-written text. No independent evidence in the profile.";
          d.ack = false;
          break;
        }
      }
      update();
    };
  });
}

/* ---------------- gate + TQA ---------------- */

function gateItems() {
  const factsDone = facts.every((f) => f.value);
  const diffsDone = diffs.every((d) => d.status !== "pending");
  const riskyUnacked = diffs.some((d) => d.status === "approved" && !d.prov.trusted && !d.ack);
  return [
    { label: "All critical fields sourced (profile / policy / confirmation)", done: factsDone },
    { label: "Work-authorization answer verified against profile", done: true },
    { label: "Salary unit checked against posting (annual)", done: !!facts.find((f) => f.id === "salary").value },
    { label: "Resume attached: Jordan_Lee_Resume_v3.pdf (fictional)", done: true },
    { label: "All material resume changes reviewed", done: diffsDone },
    { label: "Non-evidence-backed content explicitly acknowledged", done: !riskyUnacked },
  ];
}

function renderGate() {
  const items = gateItems();
  $("#gateList").innerHTML = items.map((it) =>
    `<li><span class="gate-ico">${it.done ? "✅" : "🔲"}</span>
     <span class="${it.done ? "done" : "todo"}">${it.label}</span></li>`).join("");

  const blockers = items.filter((it) => !it.done);
  const btn = $("#submitBtn");
  btn.disabled = blockers.length > 0 || submission !== "not_attempted";
  btn.textContent = {
    not_attempted: "Submit application",
    attempted: "Submitted, awaiting site confirmation…",
    verified: "Submission confirmed by site",
    failed: "Site reported the submission incomplete",
  }[submission];

  $("#gateNote").innerHTML = {
    not_attempted: blockers.length
      ? `Blocked on: ${blockers.map((b) => b.label.toLowerCase()).join("; ")}.`
      : "Every pre-submission item is verified. Submission unlocked.",
    attempted: "The agent has attempted submission. <strong>It cannot confirm the result itself.</strong> Waiting for the application site's own state.",
    verified: "The application site confirmed receipt. Only an external signal can close this loop.",
    failed: "The site reported the submission did not complete. The agent's own view said otherwise, which is exactly why self-reported state is never trusted here.",
  }[submission];
}

function renderTQA() {
  const factsOk = facts.every((f) => f.value);
  const diffsOk = diffs.every((d) => d.status !== "pending") &&
                  !diffs.some((d) => d.status === "approved" && !d.prov.trusted && !d.ack);
  const conditions = [
    { label: "Qualified: matches saved constraints (role, location policy, salary floor)", ok: true },
    { label: "Factually grounded: critical facts sourced, nothing model-generated", ok: factsOk },
    { label: "Submission verified by the site, not by the agent", ok: submission === "verified" },
    { label: "Interview-ready: every change reviewed, provenance recorded", ok: diffsOk },
  ];
  $("#tqaReasons").innerHTML = conditions
    .map((c) => `<li>${c.ok ? "✅" : submission === "attempted" && c.label.startsWith("Submission") ? "⏳" : "❌"} ${c.label}</li>`)
    .join("");

  const all = conditions.every((c) => c.ok);
  const pendingExternal = conditions.slice(0, 2).concat(conditions[3]).every((c) => c.ok) &&
                          submission !== "verified";
  const v = $("#tqaVerdict");
  if (all) { v.textContent = "Yes: this counts"; v.className = "tqa-verdict yes"; }
  else if (pendingExternal) { v.textContent = "Eligible: external verification pending"; v.className = "tqa-verdict pending"; }
  else { v.textContent = "Not yet"; v.className = "tqa-verdict no"; }

  const asserted = diffs.filter((d) => d.status === "approved" && d.prov === PROV.ASSERTED).length;
  $("#tqaFootnote").textContent = asserted
    ? `Note: ${asserted} approved change is recorded as user-asserted rather than evidence-backed. It passes the gate because you acknowledged it, and the record says so.`
    : "";
}

/* ---------------- glue ---------------- */

function toast(msg) {
  const t = $("#toast");
  t.textContent = msg;
  t.hidden = false;
  setTimeout(() => { t.hidden = true; }, 4000);
}

function update() { renderFacts(); renderPause(); renderDiffs(); renderGate(); renderTQA(); }

$("#submitBtn").addEventListener("click", () => {
  submission = "attempted";
  update();
  toast("Concept demo: nothing was submitted anywhere. Simulating the site's own confirmation…");
  // The agent cannot mark its own work verified. A separate external signal does.
  setTimeout(() => { submission = "verified"; update(); }, 2600);
});

update();
