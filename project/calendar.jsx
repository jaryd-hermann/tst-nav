// Calendar building blocks: a real 2-month range calendar and a
// pickup/drop-off picker with time selectors (for cars).
(function () {
const { Box, Group, Stack, Text, ActionIcon, Button, Popover, UnstyledButton } = window.mantine;
const I = window.SearchIcons;

// -- helpers -----------------------------------------------------------------
const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const MONTHS_LONG = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const DOW = ['S','M','T','W','T','F','S'];

function ymd(d) { return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`; }
function fmtShort(d) { if (!d) return ''; return `${MONTHS[d.getMonth()]} ${String(d.getDate()).padStart(2,'0')}`; }
function fmtLong(d) { if (!d) return ''; return `${MONTHS[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`; }
function parseISO(s) { if (!s) return null; const [y, m, d] = s.split('-').map(Number); if (!y || !m || !d) return null; return new Date(y, m - 1, d); }
function addMonths(d, n) { return new Date(d.getFullYear(), d.getMonth() + n, 1); }
function startOfMonth(d) { return new Date(d.getFullYear(), d.getMonth(), 1); }
function daysInMonth(d) { return new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate(); }
function sameDay(a, b) { return a && b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate(); }
function inRange(d, a, b) { if (!a || !b || !d) return false; const t = d.getTime(); return t >= a.getTime() && t <= b.getTime(); }

window.calFmtShort = fmtShort;
window.calFmtLong = fmtLong;
window.calParseISO = parseISO;

// -- Single-month grid -------------------------------------------------------
function MonthGrid({ monthDate, start, end, hover, onHover, onPick, minDate }) {
  const first = startOfMonth(monthDate);
  const offset = first.getDay(); // 0 Sun
  const dim = daysInMonth(first);
  const cells = [];
  for (let i = 0; i < offset; i++) cells.push(null);
  for (let d = 1; d <= dim; d++) cells.push(new Date(first.getFullYear(), first.getMonth(), d));
  while (cells.length % 7 !== 0) cells.push(null);

  return (
    <Box style={{ width: 244 }}>
      <Text ta="center" fw={700} size="sm" mb={8}>
        {MONTHS_LONG[monthDate.getMonth()]} {monthDate.getFullYear()}
      </Text>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 0 }}>
        {DOW.map((d, i) => (
          <div key={i} style={{ textAlign: 'center', color: '#9aa1a8', fontSize: 11, fontWeight: 600, padding: '2px 0' }}>{d}</div>
        ))}
        {cells.map((c, i) => {
          if (!c) return <div key={i} />;
          const isStart = sameDay(c, start);
          const isEnd = sameDay(c, end);
          const isEndpoint = isStart || isEnd;
          const provisionalEnd = !end && hover ? hover : end;
          const within = start && provisionalEnd && c.getTime() > Math.min(start.getTime(), provisionalEnd.getTime()) && c.getTime() < Math.max(start.getTime(), provisionalEnd.getTime());
          const disabled = minDate && c.getTime() < minDate.getTime();
          return (
            <button
              key={i}
              disabled={disabled}
              onClick={() => onPick(c)}
              onMouseEnter={() => onHover(c)}
              onMouseLeave={() => onHover(null)}
              style={{
                position: 'relative',
                background: 'transparent',
                border: 'none',
                padding: 0,
                height: 32,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: disabled ? 'default' : 'pointer',
              }}
            >
              {within && (
                <span style={{ position: 'absolute', inset: '4px 0', background: 'var(--mantine-color-teal-0)', zIndex: 0 }} />
              )}
              {isStart && end && !sameDay(start, end) && (
                <span style={{ position: 'absolute', top: 4, bottom: 4, right: 0, left: '50%', background: 'var(--mantine-color-teal-0)', zIndex: 0 }} />
              )}
              {isEnd && start && !sameDay(start, end) && (
                <span style={{ position: 'absolute', top: 4, bottom: 4, left: 0, right: '50%', background: 'var(--mantine-color-teal-0)', zIndex: 0 }} />
              )}
              <span
                style={{
                  position: 'relative',
                  zIndex: 1,
                  width: 28,
                  height: 28,
                  borderRadius: '50%',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 13,
                  fontWeight: isEndpoint ? 700 : 500,
                  color: disabled ? '#cbcfd4' : isEndpoint ? '#fff' : '#1a1a1a',
                  background: isEndpoint ? 'var(--mantine-color-teal-7)' : 'transparent',
                }}
              >
                {c.getDate()}
              </span>
            </button>
          );
        })}
      </div>
    </Box>
  );
}

// -- 2-month range calendar with click-to-select-range -----------------------
function RangeCalendar({ start, end, onChange, minDate, monthsToShow = 2, initialMonth }) {
  const [cursor, setCursor] = React.useState(() => initialMonth || startOfMonth(start || new Date()));
  const [hover, setHover] = React.useState(null);

  const handlePick = (d) => {
    if (!start || (start && end)) {
      onChange({ start: d, end: null });
    } else if (d.getTime() < start.getTime()) {
      onChange({ start: d, end: null });
    } else {
      onChange({ start, end: d });
    }
  };

  return (
    <Box>
      <Group justify="space-between" mb={6}>
        <ActionIcon variant="subtle" color="gray" onClick={() => setCursor(addMonths(cursor, -1))}>‹</ActionIcon>
        <div style={{ flex: 1 }} />
        <ActionIcon variant="subtle" color="gray" onClick={() => setCursor(addMonths(cursor, 1))}>›</ActionIcon>
      </Group>
      <Group align="flex-start" gap={20} wrap="nowrap" style={{ overflowX: 'auto' }}>
        {Array.from({ length: monthsToShow }).map((_, i) => (
          <MonthGrid
            key={i}
            monthDate={addMonths(cursor, i)}
            start={start}
            end={end}
            hover={hover}
            onHover={setHover}
            onPick={handlePick}
            minDate={minDate}
          />
        ))}
      </Group>
    </Box>
  );
}

// -- DateRangeField (replaces the lo-fi version) -----------------------------
function DateRangeField({ label, value, onChange, icon = I.cal, flex = 1.4, minDays = 0, height }) {
  const [opened, setOpened] = React.useState(false);
  const startD = typeof value?.start === 'string' ? parseISO(value.start) : value?.start || null;
  const endD = typeof value?.end === 'string' ? parseISO(value.end) : value?.end || null;
  const display = startD && endD ? `${fmtShort(startD)} – ${fmtShort(endD)}` : startD ? fmtShort(startD) : '';
  const setRange = ({ start: s, end: e }) => onChange({ start: s ? ymd(s) : '', end: e ? ymd(e) : '' });

  return (
    <Popover opened={opened} onChange={setOpened} position="bottom-start" offset={6} withinPortal shadow="md">
      <Popover.Target>
        <window.FieldShell icon={icon} label={label} value={display} placeholder="Add dates" onClick={() => setOpened((o) => !o)} opened={opened} flex={flex} minWidth={210} height={height} />
      </Popover.Target>
      <Popover.Dropdown p="md" style={{ width: 540 }}>
        <Stack gap="sm">
          <RangeCalendar start={startD} end={endD} onChange={setRange} />
          <Group justify="space-between">
            <Button variant="subtle" size="xs" onClick={() => setRange({ start: null, end: null })}>Clear</Button>
            <Button size="xs" color="teal" onClick={() => setOpened(false)}>Done</Button>
          </Group>
        </Stack>
      </Popover.Dropdown>
    </Popover>
  );
}

// -- Compact version (for the slim results-page strip) -----------------------
function CompactDateRangeField({ label, value, onChange, icon = I.cal, flex = 1.2, minWidth = 200 }) {
  const [opened, setOpened] = React.useState(false);
  const startD = typeof value?.start === 'string' ? parseISO(value.start) : value?.start || null;
  const endD = typeof value?.end === 'string' ? parseISO(value.end) : value?.end || null;
  const display = startD && endD ? `${fmtShort(startD)} – ${fmtShort(endD)}` : startD ? fmtShort(startD) : '';
  const setRange = ({ start: s, end: e }) => onChange({ start: s ? ymd(s) : '', end: e ? ymd(e) : '' });
  return (
    <Popover opened={opened} onChange={setOpened} position="bottom-start" offset={6} withinPortal shadow="md">
      <Popover.Target>
        <window.CompactField icon={icon} label={label} value={display} placeholder="Add dates" onClick={() => setOpened((o) => !o)} opened={opened} flex={flex} minWidth={minWidth} />
      </Popover.Target>
      <Popover.Dropdown p="md" style={{ width: 540 }}>
        <Stack gap="sm">
          <RangeCalendar start={startD} end={endD} onChange={setRange} />
          <Group justify="space-between">
            <Button variant="subtle" size="xs" onClick={() => setRange({ start: null, end: null })}>Clear</Button>
            <Button size="xs" color="teal" onClick={() => setOpened(false)}>Done</Button>
          </Group>
        </Stack>
      </Popover.Dropdown>
    </Popover>
  );
}

// -- Time picker (15-minute increments) --------------------------------------
const TIMES = (() => {
  const out = [];
  for (let h = 0; h < 24; h++) {
    for (const m of [0, 15, 30, 45]) {
      const hh = h % 12 === 0 ? 12 : h % 12;
      const ap = h < 12 ? 'AM' : 'PM';
      const v = `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}`;
      const label = `${hh}:${String(m).padStart(2,'0')} ${ap}`;
      out.push({ v, label });
    }
  }
  return out;
})();
window.TIMES = TIMES;

function TimePicker({ value, onChange, label }) {
  const [open, setOpen] = React.useState(false);
  const display = TIMES.find((t) => t.v === value)?.label || value || 'Select time';
  return (
    <Popover opened={open} onChange={setOpen} position="bottom-start" offset={4} withinPortal shadow="md">
      <Popover.Target>
        <UnstyledButton
          onClick={() => setOpen((o) => !o)}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 8,
            padding: '8px 12px',
            border: `1px solid ${open ? 'var(--mantine-color-teal-7)' : 'var(--mantine-color-gray-3)'}`,
            borderRadius: 8,
            background: '#fff',
            minWidth: 130,
            fontSize: 13,
            fontWeight: 600,
          }}
        >
          {label && <Text size="xs" c="dimmed" style={{ fontSize: 10, fontWeight: 500, textTransform: 'uppercase', letterSpacing: 0.4 }}>{label}</Text>}
          <span>{display}</span>
          <span style={{ fontSize: 10, opacity: 0.6 }}>▾</span>
        </UnstyledButton>
      </Popover.Target>
      <Popover.Dropdown p={4} style={{ width: 160 }}>
        <Box style={{ maxHeight: 240, overflow: 'auto' }}>
          {TIMES.filter((_, i) => i % 2 === 0).map((t) => {
            const sel = t.v === value;
            return (
              <UnstyledButton
                key={t.v}
                onClick={() => { onChange(t.v); setOpen(false); }}
                style={{
                  display: 'block',
                  width: '100%',
                  padding: '6px 10px',
                  borderRadius: 6,
                  fontSize: 13,
                  fontWeight: sel ? 700 : 500,
                  background: sel ? 'var(--mantine-color-teal-0)' : 'transparent',
                  color: sel ? 'var(--mantine-color-teal-8)' : 'inherit',
                }}
                onMouseEnter={(e) => { if (!sel) e.currentTarget.style.background = 'var(--mantine-color-gray-1)'; }}
                onMouseLeave={(e) => { if (!sel) e.currentTarget.style.background = 'transparent'; }}
              >
                {t.label}
              </UnstyledButton>
            );
          })}
        </Box>
      </Popover.Dropdown>
    </Popover>
  );
}

// -- Car date+time field -----------------------------------------------------
// value: { start, startTime, end, endTime } — start/end as YYYY-MM-DD strings.
function CarDateTimeField({ label, value, onChange, icon = I.cal, flex = 1.5, minWidth = 240, compact = false }) {
  const [opened, setOpened] = React.useState(false);
  const startD = typeof value?.start === 'string' ? parseISO(value.start) : value?.start || null;
  const endD = typeof value?.end === 'string' ? parseISO(value.end) : value?.end || null;
  const startT = value?.startTime || '10:00';
  const endT = value?.endTime || '10:00';
  const display = startD && endD
    ? `${fmtShort(startD)} ${TIMES.find(t => t.v === startT)?.label || ''} – ${fmtShort(endD)} ${TIMES.find(t => t.v === endT)?.label || ''}`
    : startD
    ? `${fmtShort(startD)} ${TIMES.find(t => t.v === startT)?.label || ''}`
    : '';
  const Trigger = compact ? window.CompactField : window.FieldShell;

  const setRange = ({ start: s, end: e }) => {
    onChange({
      ...value,
      start: s ? ymd(s) : '',
      end: e ? ymd(e) : '',
    });
  };

  return (
    <Popover opened={opened} onChange={setOpened} position="bottom-start" offset={6} withinPortal shadow="md">
      <Popover.Target>
        <Trigger icon={icon} label={label} value={display} placeholder="Add dates &amp; times" onClick={() => setOpened((o) => !o)} opened={opened} flex={flex} minWidth={minWidth} />
      </Popover.Target>
      <Popover.Dropdown p="md" style={{ width: 560 }}>
        <Stack gap="sm">
          <RangeCalendar start={startD} end={endD} onChange={setRange} />
          <Group grow>
            <Stack gap={4}>
              <Text size="xs" c="dimmed" fw={600} style={{ textTransform: 'uppercase', letterSpacing: 0.4, fontSize: 10 }}>Pickup time</Text>
              <TimePicker value={startT} onChange={(v) => onChange({ ...value, startTime: v })} />
            </Stack>
            <Stack gap={4}>
              <Text size="xs" c="dimmed" fw={600} style={{ textTransform: 'uppercase', letterSpacing: 0.4, fontSize: 10 }}>Drop-off time</Text>
              <TimePicker value={endT} onChange={(v) => onChange({ ...value, endTime: v })} />
            </Stack>
          </Group>
          <Group justify="space-between">
            <Button variant="subtle" size="xs" onClick={() => onChange({ start: '', end: '', startTime: '10:00', endTime: '10:00' })}>Clear</Button>
            <Button size="xs" color="teal" onClick={() => setOpened(false)}>Done</Button>
          </Group>
        </Stack>
      </Popover.Dropdown>
    </Popover>
  );
}

window.RangeCalendar = RangeCalendar;
window.MonthGrid = MonthGrid;
window.DateRangeFieldV2 = DateRangeField;
window.CompactDateRangeFieldV2 = CompactDateRangeField;
window.CarDateTimeField = CarDateTimeField;
window.TimePicker = TimePicker;
})();
