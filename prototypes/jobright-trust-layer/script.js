/* Trust Layer prototype. All data fictional (persona: Jordan Lee).
   Demonstrates: provenance table, read-never-generated pauses, resume diff
   review, a submission trust gate, and a live TQA verdict. No storage, no
   network, no real submission. */
"use strict";

/* ---------------- state ---------------- */

const facts = [
  {
    id: "employer", label: "Latest employer", value: "Brightfield Media (fictional)",
    source: "Canonical profile", confidence: "verified", genAllowed: false,
  },
  {
    id: "education", label: "Education", value: "B.A. Economics, Lakeview University (fictional)",
    source: "Canonical profile", confidence: "verified", genAllowed: false,
  },
  {
    id: "workauth", label: "Work authorization", value: "Authorized; will require sponsorship in the future",
    source: "Canonical profile", confidence: "verified", genAllowed: false,
  },
  {
    id: "referral", label: "Referral", value: null,
    source: null, confidence: "missing", genAllowed: false,
    ask: {
      text: "This application asks whether you have a referral. There is nothing in your profile. The agent will not invent one.",
      options: [
        { label: "No referral", value: "No", source: "Explicit user confirmation" },
        { label: "Yes, I have one (type name)", prompt: true, source: "Explicit user confirmation" },
      ],
    },
  },
  {
    id: "salary", label: "Expected salary", value: null,
    source: null, confidence: "missing", genAllowed: false,
    ask: {
      text: "The posting states $70,000 to $85,000 per year (annual unit detected). Your saved policy: 'prefer the JD midpoint when a range is posted.' Proposed answer: $77,500 / year.",
      options: [
        { label: "Use $77,500 / year", value: "$77,500 / year", source: "Saved policy + JD range" },
        { label: "Enter a different amount", prompt: true, source: "Explicit user confirmation" },
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
    grounded: false, status: "pending",
  },
  {
    id: "d2", target: "Skills section",
    before: "SQL, Excel, Tableau.",
    after: "SQL, Excel, Tableau, A/B testing.",
    why: "JD lists experiment experience.",
    sourceNote: "A/B testing appears in profile project 'Pricing page test, 2025'.",
    grounded: true, status: "pending",
  },
];

let submitted = false;

/* ---------------- rendering ---------------- */

const $ = (sel) => document.querySelector(sel);

function badge(text, cls) { return `<span class="badge ${cls}">${text}</span>`; }

function renderFacts() {
  const rows = facts.map((f) => {
    const val = f.value
      ? f.value
      : `<span class="missing">Missing, agent paused</span>`;
    const conf = f.confidence === "verified"
      ? badge("verified", "ok")
      : f.confidence === "confirmed"
        ? badge("user-confirmed", "ok")
        : badge("needs input", "warn");
    const gen = f.genAllowed ? badge("allowed", "neutral") : badge("never", "bad");
    return `<tr>
      <td><strong>${f.label}</strong></td>
      <td>${val}</td>
      <td class="src">${f.source ?? "None"}</td>
      <td>${conf}</td>
      <td>${gen}</td>
    </tr>`;
  }).join("");
  $("#factsTable tbody").innerHTML = rows;
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
      pending.source = opt.source;
      pending.confidence = "confirmed";
      update();
    };
    actions.appendChild(b);
  });
}

function renderDiffs() {
  $("#diffList").innerHTML = diffs.map((d) => {
    const statusCls = d.status === "pending" ? "pending" : `resolved-${d.status}`;
    const statusTxt = { pending: "NEEDS REVIEW", approved: "APPROVED", rejected: "REJECTED" }[d.status];
    const grounded = d.grounded
      ? badge("grounded in profile", "ok")
      : badge("ungrounded content", "bad");
    const actions = d.status === "pending"
      ? `<div class="diff-actions">
           <button data-act="approve" data-id="${d.id}">Approve</button>
           <button data-act="edit" data-id="${d.id}">Edit</button>
           <button data-act="reject" data-id="${d.id}">Reject</button>
         </div>`
      : "";
    return `<div class="diff-card ${statusCls}">
      <div class="diff-head"><strong>${d.target}</strong>
        <span class="diff-status ${d.status}">${statusTxt}</span></div>
      <div class="diff-block before">${d.before}</div>
      <div class="diff-block after">${d.after}</div>
      <div class="diff-meta"><span class="why">Why: ${d.why}</span><br>Source check: ${d.sourceNote} ${grounded}</div>
      ${actions}
    </div>`;
  }).join("");

  document.querySelectorAll(".diff-actions button").forEach((b) => {
    b.onclick = () => {
      const d = diffs.find((x) => x.id === b.dataset.id);
      const act = b.dataset.act;
      if (act === "approve") d.status = "approved";
      if (act === "reject") { d.status = "rejected"; d.after = d.before; }
      if (act === "edit") {
        const v = window.prompt("Edit the proposed text (demo only):", d.after);
        if (v === null) return;
        d.after = v; d.status = "approved"; d.grounded = true;
        d.sourceNote = "User-edited text (explicit confirmation).";
      }
      update();
    };
  });
}

/* ---------------- gate + TQA ---------------- */

function gateItems() {
  const factsDone = facts.every((f) => f.value);
  const diffsDone = diffs.every((d) => d.status !== "pending");
  const ungroundedApproved = diffs.some((d) => d.status === "approved" && !d.grounded);
  return [
    { label: "All critical fields sourced (profile / policy / confirmation)", done: factsDone },
    { label: "Work-authorization answer verified against profile", done: true },
    { label: "Salary unit checked against posting (annual)", done: !!facts.find((f) => f.id === "salary").value },
    { label: "Resume attached: Jordan_Lee_Resume_v3.pdf (fictional)", done: true },
    { label: "All material resume changes reviewed", done: diffsDone },
    { label: "No unreviewed ungrounded content", done: !ungroundedApproved && diffsDone },
    { label: "Submission will be verified against the site's own state", done: submitted, future: !submitted },
  ];
}

function renderGate() {
  const items = gateItems();
  $("#gateList").innerHTML = items.map((it) => {
    const ico = it.done ? "✅" : it.future ? "⏳" : "🔲";
    const cls = it.done ? "done" : "todo";
    return `<li><span class="gate-ico">${ico}</span><span class="${cls}">${it.label}</span></li>`;
  }).join("");

  const blockers = items.filter((it) => !it.done && !it.future);
  const btn = $("#submitBtn");
  btn.disabled = blockers.length > 0 || submitted;
  btn.textContent = submitted ? "Submitted (demo)" : "Submit application";
  $("#gateNote").textContent = submitted
    ? "Demo complete. In a real product, completion state would be read from the application site's own validation, never self-reported."
    : blockers.length
      ? `Blocked on: ${blockers.map((b) => b.label.toLowerCase()).join("; ")}.`
      : "All critical items verified. Submission unlocked.";
}

function renderTQA() {
  const factsOk = facts.every((f) => f.value);
  const diffsOk = diffs.every((d) => d.status !== "pending") &&
                  !diffs.some((d) => d.status === "approved" && !d.grounded);
  const conditions = [
    { label: "Qualified: matches saved constraints (role, location policy, salary floor)", ok: true },
    { label: "Factually grounded: critical facts read from verified sources", ok: factsOk },
    { label: "Submission verified", ok: submitted },
    { label: "Interview-ready: every change reviewed and explainable", ok: diffsOk },
  ];
  $("#tqaReasons").innerHTML = conditions
    .map((c) => `<li>${c.ok ? "✅" : "❌"} ${c.label}</li>`).join("");
  const all = conditions.every((c) => c.ok);
  const v = $("#tqaVerdict");
  v.textContent = all ? "Yes: this counts" : "Not yet";
  v.className = `tqa-verdict ${all ? "yes" : "no"}`;
}

/* ---------------- glue ---------------- */

function toast(msg) {
  const t = $("#toast");
  t.textContent = msg;
  t.hidden = false;
  setTimeout(() => { t.hidden = true; }, 3200);
}

function update() {
  renderFacts();
  renderPause();
  renderDiffs();
  renderGate();
  renderTQA();
}

$("#submitBtn").addEventListener("click", () => {
  submitted = true;
  toast("Concept demo: nothing was actually submitted anywhere.");
  update();
});

update();
