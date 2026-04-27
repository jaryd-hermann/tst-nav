// Product-specific search forms. Each form: icons on left, centered,
// ends with a primary Search button. Built on Mantine.
(function() {
const { TextInput, Select, NumberInput, Button, Group, Stack, Popover, UnstyledButton, Text, Box, Divider, ActionIcon } = window.mantine;

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

function LocationField({ label, value, onChange, placeholder, icon = I.pin, flex = 1.4, suggestions, product = 'hotels' }) {
  const [opened, setOpened] = React.useState(false);
  const Trigger = React.forwardRef(function Trigger(props, ref) {
    return (
      <Box ref={ref} {...props} style={{ flex, minWidth: 180 }}>
        <div
          style={{
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
          }}
          onClick={() => setOpened(true)}
        >
          <FieldIcon>{icon}</FieldIcon>
          <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0 }}>
            <Text size="xs" c="dimmed" style={{ lineHeight: 1.1, fontWeight: 500, letterSpacing: 0.2, textTransform: 'uppercase', fontSize: 10 }}>{label}</Text>
            <input
              value={value}
              onChange={(e) => onChange(e.target.value)}
              onFocus={() => setOpened(true)}
              placeholder={placeholder}
              style={{ border: 'none', outline: 'none', fontSize: 14, fontWeight: 600, marginTop: 2, color: 'var(--mantine-color-gray-9)', background: 'transparent', width: '100%' }}
            />
          </div>
        </div>
      </Box>
    );
  });
  return (
    <Popover opened={opened} onChange={setOpened} position="bottom-start" offset={6} withinPortal shadow="md">
      <Popover.Target>
        <Trigger />
      </Popover.Target>
      <Popover.Dropdown p={6} style={{ width: 380 }}>
        {window.PlaceTypeahead ? (
          <window.PlaceTypeahead
            value={value}
            onChange={onChange}
            onSelect={(p) => { onChange(p.name + (p.sub && p.type !== 'airport' ? `, ${p.sub.split(',').pop().trim()}` : '')); setOpened(false); }}
            product={product}
          />
        ) : (
          <Stack gap={2}>
            <Text size="xs" c="dimmed" px="xs" py={4} fw={600}>Popular destinations</Text>
            {(suggestions || []).map((s) => (
              <UnstyledButton key={s} onClick={() => { onChange(s); setOpened(false); }} style={{ padding: '8px 10px', borderRadius: 8, fontSize: 14 }}>
                <Group gap={10}><FieldIcon>{I.pin}</FieldIcon>{s}</Group>
              </UnstyledButton>
            ))}
          </Stack>
        )}
      </Popover.Dropdown>
    </Popover>
  );
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

// Benefits popover — Hertz promo + reward number, in line with car search.
function BenefitsField({ value, onChange, flex = 0.9, minWidth = 160 }) {
  const [opened, setOpened] = React.useState(false);
  const [promo, setPromo] = React.useState('');
  const [reward, setReward] = React.useState('');
  const has = !!(promo || reward);
  const display = (() => {
    const parts = [];
    if (promo) parts.push('Promo');
    if (reward) parts.push('Rewards');
    return parts.join(' · ');
  })();
  return (
    <Popover opened={opened} onChange={setOpened} position="bottom-end" offset={6} withinPortal shadow="md">
      <Popover.Target>
        <FieldShell icon={I.bolt} label="Benefits" value={display} placeholder="Add benefits" onClick={() => setOpened((o) => !o)} opened={opened} flex={flex} minWidth={minWidth} />
      </Popover.Target>
      <Popover.Dropdown p="md" style={{ width: 280 }}>
        <Stack gap="sm">
          <Text size="sm" fw={700}>Discounts & rewards</Text>
          <TextInput size="sm" label="Hertz promo code (CDP/PC)" placeholder="e.g. 1234567" value={promo} onChange={(e) => setPromo(e.target.value)} />
          <TextInput size="sm" label="Hertz Gold Plus Rewards #" placeholder="Member number" value={reward} onChange={(e) => setReward(e.target.value)} />
          <Group justify="space-between" mt={4}>
            <Button size="xs" variant="subtle" onClick={() => { setPromo(''); setReward(''); onChange('none'); }}>Clear</Button>
            <Button size="xs" color="teal" onClick={() => { onChange(has ? 'set' : 'none'); setOpened(false); }}>Apply</Button>
          </Group>
        </Stack>
      </Popover.Dropdown>
    </Popover>
  );
}
window.BenefitsField = BenefitsField;

// Compact form shell — single row, dense, dark-pill backdrop, used in
// the results-page nav. Same field components, smaller padding.
// On mobile, renders as a single full-width "search summary" pill that
// expands to a sheet on click — see CompactMobilePill below.
function CompactFormShell({ children, onSearch, mobile, summary }) {
  if (mobile) {
    return <window.CompactMobilePill summary={summary} onClick={onSearch || (() => {})} />;
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
