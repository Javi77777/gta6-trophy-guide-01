// Boot for the Leonida Platinum tracker: loads the trophy data (a local
// file under app/, so the guide works with the network off), wires the
// filters, spoiler setting, export/import and hash routing, then renders.
// Hash routes: #/checklist, #/roadmap, #/missables, #/sources and
// #/trophy/<id> (opens a trophy's guide). Query ?demo=1 seeds 13 earned
// trophies for screenshots; ?spoiler=0 turns spoiler-safe mode off.

import { DEMO_EARNED_IDS, downloadProgress, loadEarned, loadSpoilerOn, parseImportedProgress, saveEarned, saveSpoilerOn } from './store.js';
import { renderDetail, renderList, renderProgress, renderSources } from './render.js';

const params = new URLSearchParams(location.search);
const response = await fetch('data/trophies.json');
const doc = await response.json();
const trophies = doc.trophies;

let earned = loadEarned();
let spoilerOn = loadSpoilerOn();
if (params.get('spoiler') === '0') spoilerOn = false;
if (params.get('spoiler') === '1') spoilerOn = true;
if (params.get('demo') === '1' && earned.size === 0) {
  earned = new Set(trophies.filter((t) => DEMO_EARNED_IDS.includes(t.id)).map((t) => t.name));
  saveEarned(earned);
}

const elements = {
  count: document.getElementById('earnedCount'),
  barFill: document.getElementById('barFill'),
  label: document.getElementById('progressLabel'),
  nextUp: document.getElementById('nextUp'),
};
const listEl = document.getElementById('trophyList');
const metaEl = document.getElementById('listMeta');
const emptyEl = document.getElementById('emptyMsg');
const pane = document.getElementById('detailPane');
const searchInput = document.getElementById('search');
const kindFilter = document.getElementById('kindFilter');
const gradeFilter = document.getElementById('gradeFilter');
const stateFilter = document.getElementById('stateFilter');
const spoilerToggle = document.getElementById('spoilerToggle');
const controls = document.getElementById('controls');

spoilerToggle.checked = spoilerOn;
let selectedName = 'Positive Mental Attitude';
let currentView = 'checklist';

function currentFilters() {
  return {
    search: searchInput.value,
    kind: kindFilter.value,
    grade: gradeFilter.value,
    state: stateFilter.value,
    spoilerOn,
  };
}

function renderAll() {
  renderProgress(trophies, earned, elements);
  renderList(trophies, earned, currentFilters(), listEl, metaEl, emptyEl, selectTrophy, selectedName);
  const selected = trophies.find((t) => t.name === selectedName) ?? null;
  renderDetail(selected, earned, spoilerOn, pane);
}

function selectTrophy(name, options) {
  selectedName = name;
  if (!options.toggleOnly) {
    history.replaceState(null, '', `#/trophy/${trophies.find((t) => t.name === name)?.id ?? ''}`);
  }
  saveEarned(earned);
  renderAll();
}

function showView(view) {
  currentView = view;
  for (const section of document.querySelectorAll('.view')) {
    section.hidden = section.id !== `view-${view}`;
  }
  for (const tab of document.querySelectorAll('.tab')) {
    tab.classList.toggle('active', tab.dataset.view === view);
  }
  controls.hidden = view !== 'checklist';
}

function routeFromHash() {
  const hash = location.hash || '#/checklist';
  const trophyMatch = hash.match(/^#\/trophy\/(\d+)$/);
  if (trophyMatch) {
    const found = trophies.find((t) => t.id === Number(trophyMatch[1]));
    if (found) selectedName = found.name;
    showView('checklist');
    renderAll();
    return;
  }
  const view = hash.replace('#/', '');
  showView(['checklist', 'roadmap', 'missables', 'sources'].includes(view) ? view : 'checklist');
  renderAll();
}

searchInput.addEventListener('input', renderAll);
kindFilter.addEventListener('change', renderAll);
gradeFilter.addEventListener('change', renderAll);
stateFilter.addEventListener('change', renderAll);
spoilerToggle.addEventListener('change', () => {
  spoilerOn = spoilerToggle.checked;
  saveSpoilerOn(spoilerOn);
  renderAll();
});

document.getElementById('exportBtn').addEventListener('click', () => downloadProgress(earned));
document.getElementById('importFile').addEventListener('change', async (event) => {
  const file = event.target.files[0];
  if (!file) return;
  const imported = parseImportedProgress(await file.text(), trophies.map((t) => t.name));
  if (imported === null) {
    alert('That file is not a trophy-progress export from this guide.');
    return;
  }
  earned = imported;
  saveEarned(earned);
  renderAll();
});
document.getElementById('resetBtn').addEventListener('click', () => {
  if (!confirm('Clear all earned trophies?')) return;
  earned = new Set();
  saveEarned(earned);
  renderAll();
});

window.addEventListener('hashchange', routeFromHash);
renderSources(trophies, document.getElementById('sourceList'));
routeFromHash();
