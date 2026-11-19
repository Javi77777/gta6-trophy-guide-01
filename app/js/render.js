// Rendering for the Leonida Platinum tracker: the progress header, the
// trophy checklist, the guide detail pane and the sources list. All text
// from the data file is set with textContent, so nothing in the trophy data
// is ever parsed as HTML; source links are built as real anchor elements.

const KIND_LABELS = {
  platinum: 'Platinum',
  story: 'Story',
  completion: '100% completion',
  activities: 'Activities',
  side: 'Side missions',
  collectibles: 'Collectibles',
  crime: 'Crime',
};

export function gradeMedal(grade) {
  const span = document.createElement('span');
  span.className = `medal ${grade}`;
  span.textContent = grade;
  return span;
}

export function kindTag(kind) {
  const span = document.createElement('span');
  span.className = 'tag';
  span.textContent = KIND_LABELS[kind] ?? kind;
  return span;
}

function spoilerHidden(trophy, earned, spoilerOn) {
  return spoilerOn && trophy.kind === 'story' && !earned.has(trophy.name);
}

export function renderProgress(trophies, earned, elements) {
  const done = trophies.filter((t) => earned.has(t.name)).length;
  elements.count.textContent = String(done);
  elements.barFill.style.width = `${(done / trophies.length) * 100}%`;
  elements.label.textContent =
    done === 0
      ? '0 earned — the platinum is about 200 hours away'
      : done === trophies.length
        ? 'Platinum earned — you are a Leonida Legend!'
        : `${done} earned — ${trophies.length - done} to go`;
  const next = trophies.find((t) => t.id !== 1 && t.id !== 14 && !earned.has(t.name));
  elements.nextUp.textContent = next ? `Next up: ${next.name}` : '';
}

export function renderList(trophies, earned, filters, listEl, metaEl, emptyEl, onSelect, selectedName) {
  const query = filters.search.trim().toLowerCase();
  const visible = trophies.filter((t) => {
    if (filters.kind === 'missable' && !t.missable) return false;
    if (filters.kind === 'online') return false;
    if (filters.kind !== 'all' && filters.kind !== 'missable' && t.kind !== filters.kind) return false;
    if (filters.grade !== 'all' && t.grade !== filters.grade) return false;
    if (filters.state === 'earned' && !earned.has(t.name)) return false;
    if (filters.state === 'unearned' && earned.has(t.name)) return false;
    if (query && !(t.name + ' ' + t.description + ' ' + t.guide).toLowerCase().includes(query)) return false;
    return true;
  });

  listEl.replaceChildren();
  for (const trophy of visible) {
    const li = document.createElement('li');
    li.className = 'trophyrow' + (earned.has(trophy.name) ? ' earned' : '') + (trophy.name === selectedName ? ' selected' : '');
    const box = document.createElement('input');
    box.type = 'checkbox';
    box.checked = earned.has(trophy.name);
    box.setAttribute('aria-label', `Mark ${trophy.name} earned`);
    box.addEventListener('change', () => {
      if (box.checked) earned.add(trophy.name);
      else earned.delete(trophy.name);
      onSelect(trophy.name, { toggleOnly: true });
    });
    li.append(box);

    const body = document.createElement('div');
    const name = document.createElement('div');
    name.className = 'tname';
    const desc = document.createElement('div');
    desc.className = 'tdesc';
    if (spoilerHidden(trophy, earned, filters.spoilerOn)) {
      name.textContent = 'Hidden story trophy — earn it to reveal';
      name.classList.add('spoilered');
      desc.textContent = 'Spoiler-safe mode is on. Tick it off when you earn it.';
    } else {
      name.textContent = trophy.name;
      desc.textContent = trophy.description;
    }
    body.append(name, desc);
    li.append(body);

    const meta = document.createElement('div');
    meta.className = 'tmeta';
    meta.append(gradeMedal(trophy.grade));
    meta.append(document.createElement('br'));
    meta.append(kindTag(trophy.kind));
    if (trophy.missable) {
      const tag = document.createElement('span');
      tag.className = 'tag missable';
      tag.textContent = '⚠ Missable';
      meta.append(tag);
    }
    if (trophy.hidden) {
      const tag = document.createElement('span');
      tag.className = 'tag hidden';
      tag.textContent = 'Hidden';
      meta.append(tag);
    }
    li.append(meta);

    li.addEventListener('click', (event) => {
      if (event.target !== box) onSelect(trophy.name, {});
    });
    listEl.append(li);
  }

  const earnedCount = visible.filter((t) => earned.has(t.name)).length;
  metaEl.textContent = `Showing ${visible.length} of ${trophies.length} trophies (${earnedCount} earned in this view)`;
  emptyEl.hidden = visible.length !== 0;
}

export function renderDetail(trophy, earned, spoilerOn, pane) {
  pane.replaceChildren();
  if (!trophy) {
    const p = document.createElement('p');
    p.className = 'empty-detail';
    p.textContent = 'Pick a trophy from the checklist to read its guide and sources.';
    pane.append(p);
    return;
  }

  const title = document.createElement('h2');
  const official = document.createElement('p');
  official.className = 'official';
  if (spoilerHidden(trophy, earned, spoilerOn)) {
    title.textContent = 'Hidden story trophy';
    official.textContent = 'Spoiler-safe mode hides this story trophy until you earn it.';
    pane.append(title, official);
    return;
  }
  title.textContent = trophy.name;
  official.textContent = `“${trophy.description}” — official description, ${trophy.grade}`;
  pane.append(title, official);
  pane.append(gradeMedal(trophy.grade));
  pane.append(document.createTextNode(' '));
  pane.append(kindTag(trophy.kind));
  if (trophy.missable) {
    const tag = document.createElement('span');
    tag.className = 'tag missable';
    tag.textContent = '⚠ Missable';
    pane.append(document.createTextNode(' '), tag);
  }
  if (trophy.count !== null && trophy.count !== undefined) {
    const count = document.createElement('p');
    count.className = 'countline';
    count.textContent = `Target: ${trophy.count.toLocaleString('en-US')}`;
    pane.append(count);
  }

  const guideHead = document.createElement('h3');
  guideHead.textContent = 'Guide';
  pane.append(guideHead);
  const guide = document.createElement('p');
  guide.textContent = trophy.guide;
  pane.append(guide);

  if (trophy.steps && trophy.steps.length) {
    const stepsHead = document.createElement('h3');
    stepsHead.textContent = 'Steps';
    pane.append(stepsHead);
    const steps = document.createElement('ol');
    for (const step of trophy.steps) {
      const item = document.createElement('li');
      item.textContent = step;
      steps.append(item);
    }
    pane.append(steps);
  }

  const sourcesHead = document.createElement('h3');
  sourcesHead.textContent = 'Sources';
  pane.append(sourcesHead);
  const list = document.createElement('ul');
  list.className = 'sources';
  for (const source of trophy.sources ?? []) {
    const item = document.createElement('li');
    const link = document.createElement('a');
    link.href = source.url;
    link.textContent = source.name;
    link.target = '_blank';
    link.rel = 'noopener';
    item.append(link);
    list.append(item);
  }
  const own = document.createElement('li');
  own.textContent = 'Guide text: written in our own words for this entry from the sources above.';
  list.append(own);
  pane.append(list);

  if (trophy.missable) {
    const warn = document.createElement('p');
    warn.className = 'unconfirmed';
    warn.textContent = 'Missable warning: do the Chapter 1 meditation before that chapter ends — there is no mission replay. Keep a manual save from the start of Chapter 1.';
    pane.append(warn);
  }
}

export function renderSources(trophies, listEl) {
  const seen = new Map();
  for (const trophy of trophies) {
    for (const source of trophy.sources ?? []) {
      if (!seen.has(source.url)) seen.set(source.url, source.name);
    }
  }
  listEl.replaceChildren();
  for (const [url, name] of seen) {
    const item = document.createElement('li');
    const link = document.createElement('a');
    link.href = url;
    link.textContent = name;
    link.target = '_blank';
    link.rel = 'noopener';
    item.append(link);
    listEl.append(item);
  }
}
