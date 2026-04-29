// Product-specific search forms. Each form: icons on left, centered,
// ends with a primary Search button. Built on Mantine.
(function() {
const { TextInput, Select, NumberInput, Button, Group, Stack, Popover, UnstyledButton, Text, Box, Divider, ActionIcon, Combobox, useCombobox } = window.mantine;

// ---- Tiny helpers ---------------------------------------------------------

function FieldIcon({ children }) {
  return (
    <span style={{ display: 'inline-flex', color: 'var(--mantine-color-gray-6)', width: 18, height: 18 }}>
      {children}
    </span>
  );
}

// Reusable "fake input" trigger for popovers (date / travelers etc.)
const FieldShell = React.forwardRef(function FieldShell({ icon, label, value, placeholder, onClick, opened, flex = 1, minWidth = 0, ...rest }, ref) {
  return (
    <UnstyledButton
      ref={ref}
      onClick={onClick}
      {...rest}
      style={{
        flex,
        minWidth,
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '0 16px',
        height: 62,
        background: '#fff',
        border: `1px solid ${opened ? 'var(--mantine-color-teal-7)' : 'var(--mantine-color-gray-3)'}`,
        borderRadius: 12,
        boxShadow: opened ? '0 0 0 3px color-mix(in oklab, var(--mantine-color-teal-7) 18%, transparent)' : 'none',
        transition: 'border-color 120ms, box-shadow 120ms',
        textAlign: 'left',
      }}
    >
      <FieldIcon>{icon}</FieldIcon>
      <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0, flex: 1 }}>
        <Text size="xs" c="dimmed" style={{ lineHeight: 1.1, fontWeight: 500, letterSpacing: 0.2, textTransform: 'uppercase', fontSize: 10 }}>{label}</Text>
        <Text size="sm" fw={600} truncate style={{ marginTop: 2, color: value ? 'var(--mantine-color-gray-9)' : 'var(--mantine-color-gray-5)' }}>
          {value || placeholder}
        </Text>
      </div>
    </UnstyledButton>
  );
});

// ---- Icons (originals, simple geometry) -----------------------------------
const I = {
  pin: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 21s7-6.5 7-12a7 7 0 1 0-14 0c0 5.5 7 12 7 12z"/><circle cx="12" cy="9" r="2.5"/></svg>,
  cal: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/></svg>,
  user: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8"/></svg>,
  plane: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 14l-9-3V4.5a1.5 1.5 0 0 0-3 0V11l-7 3v2l7-1.5V20l-2 1.5V23l3.5-1L14 23v-1.5L12 20v-5.5l9 1V14z"/></svg>,
  car: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M5 13l1.6-4.5A2 2 0 0 1 8.5 7h7a2 2 0 0 1 1.9 1.5L19 13"/><path d="M3 17v-3a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v3"/><path d="M5 17v2M19 17v2"/><circle cx="7.5" cy="16.5" r="1.5"/><circle cx="16.5" cy="16.5" r="1.5"/></svg>,
  ship: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 18c2 1.5 4 1.5 6 0s4-1.5 6 0 4 1.5 6 0"/><path d="M5 16l1-6h12l1 6"/><path d="M12 4v6M9 7h6"/></svg>,
  pkg: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 8l-9-5-9 5 9 5 9-5z"/><path d="M3 8v8l9 5 9-5V8"/><path d="M12 13v8"/></svg>,
  bolt: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M13 3L4 14h7l-1 7 9-11h-7l1-7z"/></svg>,
  home: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 11l9-8 9 8"/><path d="M5 10v10h14V10"/><path d="M10 20v-6h4v6"/></svg>,
  search: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>,
  swap: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M7 7h13l-3-3M17 17H4l3 3"/></svg>,
};

window.SearchIcons = I;

// ---- Field building blocks -----------------------------------------------

function DateRangeField(props) {
  // Delegate to the real 2-month calendar implementation if it has loaded.
  if (window.DateRangeFieldV2) return window.DateRangeFieldV2(props);
  // Fallback: old lo-fi popover (kept so this file still works standalone).
  return DateRangeFieldLegacy(props);
}

function DateRangeFieldLegacy({ label, value, onChange, icon = I.cal, flex = 1.4 }) {
  const [opened, setOpened] = React.useState(false);
  const display = value?.start && value?.end ? `${value.start} — ${value.end}` : value?.start ? value.start : '';
  return (
    <Popover opened={opened} onChange={setOpened} position="bottom-start" offset={6} withinPortal shadow="md">
      <Popover.Target>
        <FieldShell icon={icon} label={label} value={display} placeholder="Add dates" onClick={() => setOpened((o) => !o)} opened={opened} flex={flex} minWidth={180} />
      </Popover.Target>
      <Popover.Dropdown p="md" style={{ width: 320 }}>
        <Stack gap="sm">
          <Text size="sm" fw={600}>Select dates</Text>
          <Group grow>
            <TextInput label="Start" placeholder="May 12, 2026" value={value?.start || ''} onChange={(e) => onChange({ ...value, start: e.target.value })} />
            <TextInput label="End" placeholder="May 19, 2026" value={value?.end || ''} onChange={(e) => onChange({ ...value, end: e.target.value })} />
          </Group>
          <CalendarMock onPick={(s, e) => onChange({ start: s, end: e })} />
          <Group justify="flex-end">
            <Button variant="subtle" size="xs" onClick={() => { onChange({ start: '', end: '' }); }}>Clear</Button>
            <Button size="xs" color="teal" onClick={() => setOpened(false)}>Done</Button>
          </Group>
        </Stack>
      </Popover.Dropdown>
    </Popover>
  );
}

function CalendarMock({ onPick }) {
  // Light visual calendar — not functional date logic, just believable.
  const days = Array.from({ length: 35 }, (_, i) => i - 2);
  const [hover, setHover] = React.useState(null);
  const [start, setStart] = React.useState(12);
  const [end, setEnd] = React.useState(19);
  return (
    <Box>
      <Group justify="space-between" mb={6}>
        <ActionIcon variant="subtle" size="sm">‹</ActionIcon>
        <Text size="sm" fw={600}>May 2026</Text>
        <ActionIcon variant="subtle" size="sm">›</ActionIcon>
      </Group>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2, fontSize: 12 }}>
        {['S','M','T','W','T','F','S'].map((d, i) => (
          <div key={i} style={{ textAlign: 'center', color: '#888', fontSize: 10, padding: 4 }}>{d}</div>
        ))}
        {days.map((d) => {
          const valid = d > 0 && d <= 31;
          const inRange = valid && d >= start && d <= end;
          const isEnd = d === start || d === end;
          return (
            <button
              key={d}
              disabled={!valid}
              onClick={() => {
                if (start && !end) { setEnd(d); onPick?.(`May ${start}, 2026`, `May ${d}, 2026`); }
                else { setStart(d); setEnd(null); }
              }}
              onMouseEnter={() => setHover(d)}
              style={{
                padding: '8px 0',
                border: 'none',
                background: isEnd ? 'var(--mantine-color-teal-7)' : inRange ? 'var(--mantine-color-teal-0)' : 'transparent',
                color: isEnd ? '#fff' : valid ? '#222' : 'transparent',
                borderRadius: isEnd ? 6 : 0,
                cursor: valid ? 'pointer' : 'default',
                fontWeight: isEnd ? 600 : 400,
                fontSize: 12,
              }}
            >
              {valid ? d : ''}
            </button>
          );
        })}
      </div>
    </Box>
  );
}

function TravelersField({ value, onChange, label = 'Travelers', flex = 1, options = ['rooms'] }) {
  const [opened, setOpened] = React.useState(false);
  const display = (() => {
    const parts = [];
    if (value.adults != null) parts.push(`${value.adults} ${value.adults === 1 ? 'adult' : 'adults'}`);
    if (value.children != null) parts.push(`${value.children} ${value.children === 1 ? 'child' : 'children'}`);
    if (options.includes('rooms') && value.rooms != null) parts.push(`${value.rooms} ${value.rooms === 1 ? 'room' : 'rooms'}`);
    return parts.join(' · ');
  })();

  return (
    <Popover opened={opened} onChange={setOpened} position="bottom-start" offset={6} withinPortal shadow="md">
      <Popover.Target>
        <FieldShell icon={I.user} label={label} value={display} placeholder="Add travelers" onClick={() => setOpened((o) => !o)} opened={opened} flex={flex} minWidth={170} />
      </Popover.Target>
      <Popover.Dropdown p="md" style={{ width: 280 }}>
        <Stack gap="sm">
          <CounterRow label="Adults" sub="13 or older" value={value.adults} min={1} onChange={(v) => onChange({ ...value, adults: v })} />
          <CounterRow label="Children" sub="Ages 2–12" value={value.children} min={0} onChange={(v) => onChange({ ...value, children: v })} />
          {options.includes('rooms') && (
            <CounterRow label="Rooms" value={value.rooms} min={1} onChange={(v) => onChange({ ...value, rooms: v })} />
          )}
          <Group justify="flex-end" mt={4}>
            <Button size="xs" color="teal" onClick={() => setOpened(false)}>Done</Button>
          </Group>
        </Stack>
      </Popover.Dropdown>
    </Popover>
  );
}

function CounterRow({ label, sub, value, onChange, min = 0 }) {
  return (
    <Group justify="space-between" wrap="nowrap">
      <div>
        <Text size="sm" fw={600}>{label}</Text>
        {sub && <Text size="xs" c="dimmed">{sub}</Text>}
      </div>
      <Group gap={6} wrap="nowrap">
        <ActionIcon variant="default" size="md" radius="xl" disabled={value <= min} onClick={() => onChange(Math.max(min, value - 1))}>−</ActionIcon>
        <Text size="sm" fw={600} w={20} ta="center">{value}</Text>
        <ActionIcon variant="default" size="md" radius="xl" onClick={() => onChange(value + 1)}>+</ActionIcon>
      </Group>
    </Group>
  );
}

// Unified Mantine Combobox-based place picker used by both the hero
// search bar (compact=false, 62px) and the compact results bar (compact=true, 48px).
function PlaceField({ label, value, onChange, placeholder, icon = I.pin, flex = 1.4, minWidth = 180, product = 'hotels', compact = false }) {
  const store = useCombobox({ onDropdownClose: () => store.resetSelectedOption() });
  const [search, setSearch] = React.useState(value || '');
  React.useEffect(() => { setSearch(value || ''); }, [value]);

  const PLACES = window.Places || [];
  const PRODUCT_HEAD = window.PRODUCT_HEAD || {};
  const TYPE_META = window.TYPE_META || {};
  const sections = PRODUCT_HEAD[product] || [{ types: ['city', 'airport'], label: 'Destinations' }];
  const q = search.toLowerCase().trim();

  const groups = sections.map(({ types, label: grpLabel }) => ({
    label: grpLabel,
    items: PLACES
      .filter(p => p.products.includes(product) && types.includes(p.type))
      .filter(p => !q || p.name.toLowerCase().includes(q) || (p.sub || '').toLowerCase().includes(q) || (p.code || '').toLowerCase().includes(q))
      .slice(0, 5),
  })).filter(g => g.items.length > 0);

  const handleSelect = (placeId) => {
    const place = PLACES.find(p => p.id === placeId);
    if (!place) return;
    const display = place.type === 'airport' ? place.name : `${place.name}, ${place.sub.split(',')[0].trim()}`;
    onChange(display);
    setSearch(display);
    store.closeDropdown();
  };

  const opened = store.dropdownOpened;
  const h = compact ? 48 : 62;
  const borderColor = opened ? 'var(--mantine-color-teal-7)' : compact ? 'transparent' : 'var(--mantine-color-gray-3)';
  const shadow = opened ? '0 0 0 3px color-mix(in oklab, var(--mantine-color-teal-7) 22%, transparent)' : 'none';

  return (
    <Combobox store={store} withinPortal width={380} onOptionSubmit={handleSelect}>
      <Combobox.Target>
        <div
          style={{ flex, minWidth, display: 'flex', alignItems: 'center', gap: compact ? 10 : 12,
            padding: compact ? '8px 14px' : '0 16px', height: h, background: '#fff',
            border: `1px solid ${borderColor}`, borderRadius: compact ? 10 : 12,
            boxShadow: shadow, transition: 'border-color 120ms, box-shadow 120ms', cursor: 'text' }}
          onClick={() => store.openDropdown()}
        >
          <FieldIcon>{icon}</FieldIcon>
          <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0 }}>
            <Text c="dimmed" style={{ lineHeight: 1, fontWeight: 500, textTransform: 'uppercase', letterSpacing: compact ? 0.4 : 0.2, fontSize: compact ? 9 : 10 }}>{label}</Text>
            <input
              value={search}
              onChange={(e) => { const v = e.target.value; setSearch(v); onChange(v); store.openDropdown(); }}
              onFocus={() => store.openDropdown()}
              onBlur={() => store.closeDropdown()}
              placeholder={placeholder}
              style={{ border: 'none', outline: 'none', fontSize: compact ? 12 : 14, fontWeight: 600, marginTop: 2,
                color: search ? 'var(--mantine-color-gray-9)' : 'var(--mantine-color-gray-5)', background: 'transparent', width: '100%' }}
            />
          </div>
        </div>
      </Combobox.Target>
      <Combobox.Dropdown onMouseDown={(e) => e.preventDefault()}>
        <Combobox.Options mah={320} style={{ overflowY: 'auto' }}>
          {groups.length > 0 ? groups.map((g) => (
            <Combobox.Group key={g.label} label={g.label}>
              {g.items.map((p) => {
                const meta = TYPE_META[p.type] || {};
                return (
                  <Combobox.Option key={p.id} value={p.id} style={{ padding: '8px 10px' }}>
                    <Group gap={10} wrap="nowrap">
                      <Box style={{ width: 30, height: 30, borderRadius: 8, background: 'var(--mantine-color-gray-1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <span style={{ width: 14, height: 14, color: 'var(--mantine-color-gray-6)', display: 'inline-flex' }}>{meta.icon}</span>
                      </Box>
                      <Box style={{ minWidth: 0, flex: 1 }}>
                        <Text size="sm" fw={600} truncate>{p.name}</Text>
                        <Text size="xs" c="dimmed" truncate>{p.sub}</Text>
                      </Box>
                      <Text size="xs" c="dimmed" style={{ textTransform: 'uppercase', letterSpacing: 0.5, fontSize: 10, fontWeight: 600, flexShrink: 0 }}>{meta.label}</Text>
                    </Group>
                  </Combobox.Option>
                );
              })}
            </Combobox.Group>
          )) : (
            <Combobox.Empty>No results for &ldquo;{search}&rdquo;</Combobox.Empty>
          )}
        </Combobox.Options>
      </Combobox.Dropdown>
    </Combobox>
  );
}
window.PlaceField = PlaceField;

function LocationField({ label, value, onChange, placeholder, icon = I.pin, flex = 1.4, product = 'hotels' }) {
  return <PlaceField label={label} value={value} onChange={onChange} placeholder={placeholder} icon={icon} flex={flex} product={product} />;
}

// ---- Form layout shell ----------------------------------------------------

function SearchFormShell({ children, onSearch, mobile }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: mobile ? 'column' : 'row',
        gap: 8,
        background: 'var(--wf-search-bar-bg, #E6EFFB)',
        padding: 8,
        borderRadius: 16,
        alignItems: 'stretch',
        width: '100%',
        flexWrap: 'wrap',
      }}
    >
      <div style={{ display: 'flex', flexDirection: mobile ? 'column' : 'row', gap: 8, flex: '1 1 480px', minWidth: 0, flexWrap: 'wrap' }}>
        {children}
      </div>
      <Button
        size="lg"
        color="teal"
        leftSection={<span style={{ display: 'inline-flex', width: 18, height: 18 }}>{I.search}</span>}
        onClick={onSearch}
        style={{
          height: mobile ? 52 : 62,
          minWidth: mobile ? '100%' : 130,
          paddingInline: 22,
          alignSelf: 'stretch',
          fontWeight: 600,
          borderRadius: 12,
          flexShrink: 0,
        }}
      >
        Search
      </Button>
    </div>
  );
}

window.SearchFormShell = SearchFormShell;
window.LocationField = LocationField;
window.DateRangeField = DateRangeField;
window.TravelersField = TravelersField;
window.FieldShell = FieldShell;
window.FieldIcon = FieldIcon;

// Select-style field built on FieldShell for visual consistency.
function SelectField({ label, value, onChange, options, icon, flex = 1, minWidth = 150 }) {
  const [opened, setOpened] = React.useState(false);
  const display = options.find((o) => (o.value ?? o) === value)?.label ?? value;
  return (
    <Popover opened={opened} onChange={setOpened} position="bottom-start" offset={6} withinPortal shadow="md">
      <Popover.Target>
        <FieldShell icon={icon} label={label} value={display} placeholder="Select" onClick={() => setOpened((o) => !o)} opened={opened} flex={flex} minWidth={minWidth} />
      </Popover.Target>
      <Popover.Dropdown p={6} style={{ minWidth: 200 }}>
        <Stack gap={2}>
          {options.map((o) => {
            const v = o.value ?? o;
            const l = o.label ?? o;
            const sel = v === value;
            return (
              <UnstyledButton key={v} onClick={() => { onChange(v); setOpened(false); }}
                style={{ padding: '8px 10px', borderRadius: 8, fontSize: 14, fontWeight: sel ? 700 : 500, color: sel ? 'var(--mantine-color-teal-8)' : 'inherit', background: sel ? 'var(--mantine-color-teal-0)' : 'transparent' }}
                onMouseEnter={(e) => { if (!sel) e.currentTarget.style.background = 'var(--mantine-color-gray-1)'; }}
                onMouseLeave={(e) => { if (!sel) e.currentTarget.style.background = 'transparent'; }}>
                {l}
              </UnstyledButton>
            );
          })}
        </Stack>
      </Popover.Dropdown>
    </Popover>
  );
}
window.SelectField = SelectField;

// Benefits popover — collapsible benefit types each with a NumberInput.
const BENEFIT_TYPES = [
  { key: 'cdp',     label: 'Hertz CDP #',              placeholder: 'Corporate discount number', desc: 'Corporate Discount Program' },
  { key: 'pc',      label: 'Hertz PC #',               placeholder: 'Product code', desc: 'Product / promotional code' },
  { key: 'rewards', label: 'Hertz Gold Plus Rewards #', placeholder: 'Rewards member number', desc: 'Gold Plus Rewards loyalty number' },
];

function BenefitsField({ value, onChange, flex = 0.9, minWidth = 160 }) {
  const [opened, setOpened] = React.useState(false);
  const [vals, setVals] = React.useState({ cdp: '', pc: '', rewards: '' });
  const [active, setActive] = React.useState({ cdp: false, pc: false, rewards: false });

  const setVal = (key, v) => setVals((prev) => ({ ...prev, [key]: v }));
  const toggle = (key) => setActive((prev) => ({ ...prev, [key]: !prev[key] }));

  const filledCount = BENEFIT_TYPES.filter(b => active[b.key] && vals[b.key]).length;
  const display = filledCount > 0 ? `${filledCount} benefit${filledCount > 1 ? 's' : ''} added` : '';

  const apply = () => {
    const out = BENEFIT_TYPES.filter(b => active[b.key] && vals[b.key]).reduce((acc, b) => ({ ...acc, [b.key]: vals[b.key] }), {});
    onChange(Object.keys(out).length ? out : 'none');
    setOpened(false);
  };
  const clear = () => {
    setVals({ cdp: '', pc: '', rewards: '' });
    setActive({ cdp: false, pc: false, rewards: false });
    onChange('none');
  };

  return (
    <Popover opened={opened} onChange={setOpened} position="bottom-end" offset={6} withinPortal shadow="md">
      <Popover.Target>
        <FieldShell icon={I.bolt} label="Benefits" value={display} placeholder="Add benefits" onClick={() => setOpened((o) => !o)} opened={opened} flex={flex} minWidth={minWidth} />
      </Popover.Target>
      <Popover.Dropdown p="md" style={{ width: 300 }}>
        <Stack gap="md">
          <Text size="sm" fw={700}>Discounts & rewards</Text>
          {BENEFIT_TYPES.map((b) => (
            <Box key={b.key}>
              <UnstyledButton
                onClick={() => toggle(b.key)}
                style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 0' }}
              >
                <Box>
                  <Text size="sm" fw={600}>{b.label}</Text>
                  <Text size="xs" c="dimmed">{b.desc}</Text>
                </Box>
                <Box style={{
                  width: 18, height: 18, borderRadius: 4, flexShrink: 0,
                  background: active[b.key] ? 'var(--mantine-color-teal-7)' : 'var(--mantine-color-gray-2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {active[b.key] && <span style={{ color: '#fff', fontSize: 11, fontWeight: 700, lineHeight: 1 }}>✓</span>}
                </Box>
              </UnstyledButton>
              {active[b.key] && (
                <NumberInput
                  mt={4}
                  size="sm"
                  placeholder={b.placeholder}
                  value={vals[b.key]}
                  onChange={(v) => setVal(b.key, v)}
                  hideControls
                  allowDecimal={false}
                  allowNegative={false}
                />
              )}
            </Box>
          ))}
          <Group justify="space-between" mt={4}>
            <Button size="xs" variant="subtle" onClick={clear}>Clear</Button>
            <Button size="xs" color="teal" onClick={apply}>Apply</Button>
          </Group>
        </Stack>
      </Popover.Dropdown>
    </Popover>
  );
}
window.BenefitsField = BenefitsField;

// Mobile full-screen search modal — opens when compact pill is tapped.
function MobileSearchModal({ open, onClose, onSearch, children, title = 'Edit search' }) {
  if (!open) return null;
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 9000, background: 'var(--mantine-color-gray-0)',
      display: 'flex', flexDirection: 'column', overscrollBehavior: 'contain' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '0 16px',
        height: 56, background: '#fff', borderBottom: '1px solid var(--mantine-color-gray-2)', flexShrink: 0 }}>
        <UnstyledButton onClick={onClose}
          style={{ width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center',
            borderRadius: 8, background: 'var(--mantine-color-gray-1)' }}>
          <span style={{ fontSize: 18, lineHeight: 1, color: 'var(--mantine-color-gray-7)' }}>←</span>
        </UnstyledButton>
        <Text fw={700} size="sm" style={{ flex: 1 }}>{title}</Text>
      </div>
      {/* Scrollable fields */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 16px 8px' }}>
        <Stack gap={10}>{children}</Stack>
      </div>
      {/* Search CTA */}
      <div style={{ padding: '12px 16px 20px', background: '#fff',
        borderTop: '1px solid var(--mantine-color-gray-2)', flexShrink: 0 }}>
        <Button fullWidth size="lg" color="teal"
          leftSection={<span style={{ display: 'inline-flex', width: 18, height: 18 }}>{I.search}</span>}
          onClick={() => { onSearch?.(); onClose(); }}
          style={{ height: 52, fontWeight: 600, borderRadius: 12 }}>
          Search
        </Button>
      </div>
    </div>
  );
}
window.MobileSearchModal = MobileSearchModal;

// ── Mobile bottom sheet ──────────────────────────────────────────────────────
// Slides up from the bottom; used by mobile field pickers inside the modal.
function MobileBottomSheet({ open, onClose, title, children, doneLabel = 'Done' }) {
  if (!open) return null;
  return (
    <>
      <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.45)', zIndex:9300 }} onClick={onClose} />
      <div style={{ position:'fixed', bottom:0, left:0, right:0, zIndex:9400,
        background:'#fff', borderRadius:'20px 20px 0 0', maxHeight:'85vh', overflowY:'auto',
        padding:'0 16px 32px', animation:'mobileSheetUp 0.22s ease' }}>
        <style>{`@keyframes mobileSheetUp { from { transform:translateY(100%) } to { transform:translateY(0) } }`}</style>
        <div style={{ width:40, height:4, background:'#e5e7eb', borderRadius:2, margin:'12px auto 16px' }} />
        {title && <Text fw={700} size="md" mb="md">{title}</Text>}
        {children}
        <Button fullWidth mt="lg" color="teal" size="lg" radius="md" onClick={onClose} style={{ fontWeight:600 }}>{doneLabel}</Button>
      </div>
    </>
  );
}
window.MobileBottomSheet = MobileBottomSheet;

function MobileFieldRow({ icon, label, value, placeholder, onClick }) {
  return (
    <div onClick={onClick} style={{
      background:'#fff', border:'1px solid #e5e7eb', borderRadius:12,
      padding:'14px 16px', display:'flex', alignItems:'center', gap:12,
      cursor:'pointer', minHeight:68, userSelect:'none', WebkitTapHighlightColor:'transparent' }}>
      {icon && <span style={{ width:20, height:20, color:'#9ca3af', flexShrink:0, display:'inline-flex', alignItems:'center', justifyContent:'center' }}>{icon}</span>}
      <div style={{ flex:1, minWidth:0 }}>
        <div style={{ fontSize:11, fontWeight:700, color:'#9ca3af', textTransform:'uppercase', letterSpacing:'0.06em', lineHeight:1 }}>{label}</div>
        <div style={{ fontSize:16, fontWeight:600, color: value ? '#111827' : '#d1d5db', marginTop:3, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
          {value || placeholder || 'Add...'}
        </div>
      </div>
      <span style={{ color:'#d1d5db', fontSize:20, lineHeight:1 }}>›</span>
    </div>
  );
}
window.MobileFieldRow = MobileFieldRow;

function MobileLocationField({ label, value, onChange, icon, placeholder, product }) {
  const [query, setQuery] = React.useState(value || '');
  const [focused, setFocused] = React.useState(false);
  const allPlaces = (window.PLACES && window.PLACES[product]) || [];
  const filtered = query ? allPlaces.filter(p => p.toLowerCase().includes(query.toLowerCase())) : allPlaces.slice(0, 6);
  const select = (v) => { onChange(v); setQuery(v); setFocused(false); };
  return (
    <div style={{ position:'relative' }}>
      <div style={{ border: `1px solid ${focused ? '#4263EB' : '#e5e7eb'}`, borderRadius:12, padding:'14px 16px',
        background:'#fff', display:'flex', alignItems:'center', gap:10, minHeight:68 }}>
        {icon && <span style={{ width:20, height:20, color:'#9ca3af', flexShrink:0, display:'inline-flex', alignItems:'center' }}>{icon}</span>}
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ fontSize:11, fontWeight:700, color:'#9ca3af', textTransform:'uppercase', letterSpacing:'0.06em', lineHeight:1 }}>{label}</div>
          <input type="text" value={query}
            onChange={e => { setQuery(e.target.value); onChange(e.target.value); }}
            onFocus={() => setFocused(true)}
            onBlur={() => setTimeout(() => setFocused(false), 180)}
            placeholder={placeholder || 'Search...'}
            style={{ border:'none', outline:'none', background:'transparent', fontSize:16, fontWeight:600,
              color:'#111827', padding:0, marginTop:3, width:'100%', fontFamily:'inherit' }} />
        </div>
      </div>
      {focused && filtered.length > 0 && (
        <div style={{ position:'absolute', top:'calc(100% + 4px)', left:0, right:0, zIndex:200,
          background:'#fff', border:'1px solid #e5e7eb', borderRadius:12, overflow:'hidden',
          boxShadow:'0 4px 20px rgba(0,0,0,0.12)' }}>
          {filtered.slice(0, 6).map((s, i) => (
            <div key={s} onMouseDown={() => select(s)} onClick={() => select(s)}
              style={{ padding:'14px 16px', borderBottom: i < Math.min(filtered.length,6)-1 ? '1px solid #f3f4f6':'none',
                fontSize:15, cursor:'pointer', color:'#111827' }}>{s}</div>
          ))}
          {filtered.length === 0 && query && (
            <div onMouseDown={() => select(query)} onClick={() => select(query)}
              style={{ padding:'14px 16px', fontSize:15, cursor:'pointer', color:'#4263EB' }}>Use "{query}"</div>
          )}
        </div>
      )}
    </div>
  );
}
window.MobileLocationField = MobileLocationField;

// Mini calendar for the date bottom sheet
function MiniCalendar({ start, end, onDateClick }) {
  const today = new Date();
  const [viewYear, setViewYear] = React.useState(today.getFullYear());
  const [viewMonth, setViewMonth] = React.useState(today.getMonth());
  const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  const DOW = ['SUN','MON','TUE','WED','THU','FRI','SAT'];
  const parseD = (s) => { if (!s) return null; const d = new Date(s+'T00:00:00'); return isNaN(d)?null:d; };
  const startD = parseD(start); const endD = parseD(end);
  const firstDow = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMo = new Date(viewYear, viewMonth+1, 0).getDate();
  const fmt = (y,m,d) => `${y}-${String(m+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
  const prevMo = () => { if(viewMonth===0){setViewYear(y=>y-1);setViewMonth(11);}else setViewMonth(m=>m-1); };
  const nextMo = () => { if(viewMonth===11){setViewYear(y=>y+1);setViewMonth(0);}else setViewMonth(m=>m+1); };
  const cells = [];
  for(let i=0;i<firstDow;i++) cells.push(null);
  for(let d=1;d<=daysInMo;d++) cells.push(d);
  return (
    <div>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:12 }}>
        <UnstyledButton onClick={prevMo} style={{ padding:'8px 12px', fontSize:22, color:'#374151' }}>‹</UnstyledButton>
        <Text fw={600} size="md">{MONTHS[viewMonth]} {viewYear}</Text>
        <UnstyledButton onClick={nextMo} style={{ padding:'8px 12px', fontSize:22, color:'#374151' }}>›</UnstyledButton>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', marginBottom:4 }}>
        {DOW.map(d => <div key={d} style={{ textAlign:'center', fontSize:10, fontWeight:700, color:'#9ca3af', padding:'4px 0' }}>{d}</div>)}
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', rowGap:4 }}>
        {cells.map((d, i) => {
          if (!d) return <div key={`e${i}`} />;
          const dt = new Date(viewYear, viewMonth, d);
          const isSt = startD && dt.getTime()===startD.getTime();
          const isEn = endD && dt.getTime()===endD.getTime();
          const inRng = startD && endD && dt > startD && dt < endD;
          const isToday = today.getDate()===d && today.getMonth()===viewMonth && today.getFullYear()===viewYear;
          return (
            <div key={d} onClick={() => onDateClick(fmt(viewYear,viewMonth,d))}
              style={{ position:'relative', display:'flex', alignItems:'center', justifyContent:'center',
                cursor:'pointer', height:40 }}>
              {inRng && <div style={{ position:'absolute', inset:'0 0 0 0', background:'#f3f4f6', zIndex:0 }} />}
              {(isSt||isEn) && <div style={{ position:'absolute', inset:'4px', borderRadius:'50%', background:'#111827', zIndex:1 }} />}
              <span style={{ position:'relative', zIndex:2, fontSize:15, fontWeight: (isSt||isEn||isToday)?700:400,
                color: (isSt||isEn)?'#fff': isToday?'#4263EB':'#111827' }}>{d}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function MobileDateField({ label, value, onChange, icon }) {
  const [open, setOpen] = React.useState(false);
  const [start, setStart] = React.useState(value?.start || '');
  const [end, setEnd] = React.useState(value?.end || '');
  const [picking, setPicking] = React.useState('start');
  const fmtDisplay = (s) => {
    if (!s) return '';
    const d = new Date(s+'T00:00:00');
    return isNaN(d) ? s : d.toLocaleDateString('en-US', { month:'short', day:'numeric' });
  };
  const display = start && end ? `${fmtDisplay(start)} – ${fmtDisplay(end)}` : fmtDisplay(start) || '';
  const handleDayClick = (dateStr) => {
    if (picking === 'start' || !start || dateStr < start) {
      setStart(dateStr); setEnd(''); setPicking('end');
    } else if (dateStr === start) {
      setStart(''); setEnd(''); setPicking('start');
    } else {
      setEnd(dateStr); setPicking('start');
    }
  };
  const confirm = () => { onChange({ start, end }); setOpen(false); };
  return (
    <>
      <MobileFieldRow icon={icon} label={label} value={display} placeholder="Add dates"
        onClick={() => { setStart(value?.start||''); setEnd(value?.end||''); setPicking('start'); setOpen(true); }} />
      <MobileBottomSheet open={open} onClose={confirm} title={null} doneLabel="Done">
        <div style={{ display:'flex', gap:10, marginBottom:16 }}>
          {[['start','Check in'], ['end','Check out']].map(([k, lbl]) => {
            const val = k==='start' ? start : end;
            return (
              <div key={k} onClick={() => setPicking(k)}
                style={{ flex:1, border: picking===k ? '2px solid #111827' : '1px solid #e5e7eb',
                  borderRadius:12, padding:'10px 14px', cursor:'pointer' }}>
                <div style={{ fontSize:11, fontWeight:600, color:'#6b7280', marginBottom:2 }}>{lbl}</div>
                <div style={{ fontSize:16, fontWeight:600, color: val?'#111827':'#d1d5db' }}>{fmtDisplay(val)||'Add date'}</div>
              </div>
            );
          })}
        </div>
        <MiniCalendar start={start} end={end} onDateClick={handleDayClick} />
      </MobileBottomSheet>
    </>
  );
}
window.MobileDateField = MobileDateField;

function MobileSelectField({ label, value, onChange, icon, options }) {
  const [open, setOpen] = React.useState(false);
  const display = options.find(o => (o.value ?? o) === value)?.label ?? value;
  return (
    <>
      <MobileFieldRow icon={icon} label={label} value={display} placeholder="Select" onClick={() => setOpen(true)} />
      <MobileBottomSheet open={open} onClose={() => setOpen(false)} title={label}>
        <div style={{ display:'flex', flexDirection:'column' }}>
          {options.map((o, i) => {
            const v = o.value ?? o; const l = o.label ?? o; const active = v === value;
            return (
              <UnstyledButton key={v} onClick={() => { onChange(v); setOpen(false); }}
                style={{ display:'flex', alignItems:'center', justifyContent:'space-between',
                  padding:'16px 8px', borderBottom: i < options.length-1 ? '1px solid #f3f4f6' : 'none',
                  fontSize:16, fontWeight: active ? 700 : 500, color: active ? '#4263EB' : '#111827', fontFamily:'inherit' }}>
                <span>{l}</span>
                {active && <span>✓</span>}
              </UnstyledButton>
            );
          })}
        </div>
      </MobileBottomSheet>
    </>
  );
}
window.MobileSelectField = MobileSelectField;

function MobileTravelersField({ label, value, onChange, icon, options = [] }) {
  const [open, setOpen] = React.useState(false);
  const [local, setLocal] = React.useState(value);
  const parts = [];
  if (local.adults != null) parts.push(`${local.adults} ${local.adults===1?'adult':'adults'}`);
  if (local.children != null) parts.push(`${local.children} ${local.children===1?'child':'children'}`);
  if (options.includes('rooms') && local.rooms != null) parts.push(`${local.rooms} ${local.rooms===1?'room':'rooms'}`);
  const display = parts.join(' · ');
  const confirm = () => { onChange(local); setOpen(false); };
  const Row = ({ k, lbl, min = 0 }) => (
    <Group justify="space-between" wrap="nowrap"
      style={{ padding:'14px 0', borderBottom:'1px solid #f3f4f6' }}>
      <Text size="md" fw={500}>{lbl}</Text>
      <Group gap={12} wrap="nowrap" align="center">
        <ActionIcon variant="default" size="lg" radius="xl"
          disabled={(local[k]??0)<=min} onClick={() => setLocal(p => ({ ...p, [k]: Math.max(min,(p[k]??0)-1) }))}>−</ActionIcon>
        <Text size="md" fw={700} w={24} ta="center">{local[k]??0}</Text>
        <ActionIcon variant="default" size="lg" radius="xl"
          onClick={() => setLocal(p => ({ ...p, [k]: (p[k]??0)+1 }))}>+</ActionIcon>
      </Group>
    </Group>
  );
  return (
    <>
      <MobileFieldRow icon={icon} label={label} value={display} placeholder="Add travelers"
        onClick={() => { setLocal(value); setOpen(true); }} />
      <MobileBottomSheet open={open} onClose={confirm} title={label} doneLabel="Confirm">
        <Row k="adults" lbl="Adults" min={1} />
        <Row k="children" lbl="Children" />
        {options.includes('rooms') && <Row k="rooms" lbl="Rooms" min={1} />}
      </MobileBottomSheet>
    </>
  );
}
window.MobileTravelersField = MobileTravelersField;

// Compact form shell — single row, dense, dark-pill backdrop, used in
// the results-page nav. Same field components, smaller padding.
// On mobile, renders as a single full-width "search summary" pill that
// opens a full-screen modal on click.
function CompactFormShell({ children, onSearch, mobile, summary, mobileModal }) {
  const [modalOpen, setModalOpen] = React.useState(false);
  if (mobile) {
    return (
      <>
        <window.CompactMobilePill summary={summary} onClick={() => mobileModal ? setModalOpen(true) : onSearch?.()} />
        {mobileModal && (
          <MobileSearchModal open={modalOpen} onClose={() => setModalOpen(false)} onSearch={onSearch}>
            {mobileModal}
          </MobileSearchModal>
        )}
      </>
    );
  }
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        gap: 6,
        padding: 6,
        borderRadius: 14,
        alignItems: 'stretch',
        background: 'var(--wf-search-bar-bg, #E6EFFB)',
        border: '1px solid rgba(255,255,255,0.08)',
        width: '100%',
        flexWrap: 'wrap',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'row', gap: 6, flex: '1 1 480px', minWidth: 0, flexWrap: 'wrap' }}>
        {children}
      </div>
      <Button
        size="md"
        color="teal"
        leftSection={<span style={{ display: 'inline-flex', width: 16, height: 16 }}>{I.search}</span>}
        onClick={onSearch}
        style={{
          height: 48,
          minWidth: 110,
          paddingInline: 18,
          fontWeight: 600,
          borderRadius: 10,
          flexShrink: 0,
        }}
      >
        Search
      </Button>
    </div>
  );
}
window.CompactFormShell = CompactFormShell;

// Mobile compact pill — full-width white card with search icon + main text + sub.
function CompactMobilePill({ summary, onClick }) {
  return (
    <UnstyledButton
      onClick={onClick}
      style={{
        width: '100%',
        background: '#fff',
        borderRadius: 12,
        padding: '14px 16px',
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        boxShadow: '0 4px 16px rgba(0,0,0,0.18)',
        textAlign: 'left',
      }}
    >
      <span style={{ display: 'inline-flex', width: 22, height: 22, color: 'var(--mantine-color-gray-7)', flexShrink: 0 }}>{I.search}</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <Text fw={700} size="md" truncate style={{ color: '#1a1a17', lineHeight: 1.2 }}>{summary?.main || 'Start a new search'}</Text>
        {summary?.sub && (
          <Text size="sm" c="dimmed" truncate style={{ marginTop: 2 }}>{summary.sub}</Text>
        )}
      </div>
    </UnstyledButton>
  );
}
window.CompactMobilePill = CompactMobilePill;

// Compact field shell — same vocabulary as FieldShell but slimmer,
// for the results-page header strip.
const CompactField = React.forwardRef(function CompactField({ icon, label, value, placeholder, onClick, opened, flex = 1, minWidth = 140, ...rest }, ref) {
  return (
    <UnstyledButton
      ref={ref}
      onClick={onClick}
      {...rest}
      style={{
        flex,
        minWidth,
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '8px 14px',
        background: '#fff',
        border: `1px solid ${opened ? 'var(--mantine-color-teal-7)' : 'transparent'}`,
        borderRadius: 10,
        boxShadow: opened ? '0 0 0 3px color-mix(in oklab, var(--mantine-color-teal-7) 22%, transparent)' : 'none',
        textAlign: 'left',
        height: 48,
      }}
    >
      <FieldIcon>{icon}</FieldIcon>
      <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0, flex: 1 }}>
        <Text size="xs" c="dimmed" style={{ lineHeight: 1, fontWeight: 500, letterSpacing: 0.4, textTransform: 'uppercase', fontSize: 9 }}>{label}</Text>
        <Text size="sm" fw={600} truncate style={{ marginTop: 2, color: value ? 'var(--mantine-color-gray-9)' : 'var(--mantine-color-gray-5)' }}>
          {value || placeholder}
        </Text>
      </div>
    </UnstyledButton>
  );
});
window.CompactField = CompactField;
})();
