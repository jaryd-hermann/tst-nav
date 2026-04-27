// One form per product. All composed from window.LocationField etc.
(function() {
const { Group, Stack, SegmentedControl, Box, Text, Switch, ActionIcon } = window.mantine;
const I = window.SearchIcons;
const SF = window.SelectField;

// Shared segmented-control styles so the active label is readable.
const segStyles = {
  root: { background: '#fff', border: '1px solid var(--mantine-color-gray-3)' },
  indicator: { background: 'var(--mantine-color-teal-7)' },
  label: { fontWeight: 600, fontSize: 13 },
  innerLabel: { color: 'inherit' },
};
const segLabelCss = `
  .twkSeg [data-active="true"] { color: #fff !important; }
  .twkSeg [data-active="false"] { color: var(--mantine-color-gray-7); }
`;

function SegStyles() {
  return <style>{segLabelCss}</style>;
}

// HOTELS
function HotelSearch({ mobile, onSearch }) {
  const [where, setWhere] = React.useState('Paris, France');
  const [dates, setDates] = React.useState({ start: 'May 12, 2026', end: 'May 19, 2026' });
  const [travelers, setTravelers] = React.useState({ adults: 2, children: 0, rooms: 1 });
  return (
    <window.SearchFormShell mobile={mobile} onSearch={onSearch || (() => {})}>
      <window.LocationField label="Where to" value={where} onChange={setWhere} placeholder="City, hotel, or landmark" icon={I.pin} flex={1.6} />
      <window.DateRangeField label="When" value={dates} onChange={setDates} icon={I.cal} flex={1.4} />
      <window.TravelersField label="Travelers" value={travelers} onChange={setTravelers} options={['rooms']} flex={1.1} />
    </window.SearchFormShell>
  );
}

// FLIGHTS
function FlightSearch({ mobile, onSearch }) {
  const [tripType, setTripType] = React.useState('roundtrip');
  const [from, setFrom] = React.useState('SFO — San Francisco');
  const [to, setTo] = React.useState('NRT — Tokyo Narita');
  const [dates, setDates] = React.useState({ start: 'Jun 04, 2026', end: 'Jun 14, 2026' });
  const [travelers, setTravelers] = React.useState({ adults: 1, children: 0 });
  const [cabin, setCabin] = React.useState('economy');
  const swap = () => { const a = from; setFrom(to); setTo(a); };

  return (
    <window.SearchFormShell mobile={mobile} onSearch={onSearch || (() => {})}>
      <Box style={{ flex: '1 1 360px', position: 'relative', display: 'flex', gap: 8, flexDirection: mobile ? 'column' : 'row', minWidth: 0 }}>
        <window.LocationField label="From" value={from} onChange={setFrom} placeholder="City or airport" icon={I.plane} flex={1}
          suggestions={['SFO — San Francisco', 'JFK — New York', 'LHR — London Heathrow', 'NRT — Tokyo Narita', 'CDG — Paris CDG']} />
        {!mobile && (
          <ActionIcon
            onClick={swap}
            variant="default"
            radius="xl"
            size="lg"
            style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)', zIndex: 2, background: '#fff', border: '1px solid var(--mantine-color-gray-3)' }}
            aria-label="Swap"
          >
            <span style={{ width: 16, height: 16, display: 'inline-flex', color: 'var(--mantine-color-gray-7)' }}>{I.swap}</span>
          </ActionIcon>
        )}
        <window.LocationField label="To" value={to} onChange={setTo} placeholder="City or airport" icon={I.plane} flex={1}
          suggestions={['SFO — San Francisco', 'JFK — New York', 'LHR — London Heathrow', 'NRT — Tokyo Narita', 'CDG — Paris CDG']} />
      </Box>
      <SF
        label="Trip type"
        value={tripType}
        onChange={setTripType}
        icon={I.swap}
        options={[
          { value: 'roundtrip', label: 'Round trip' },
          { value: 'oneway', label: 'One way' },
          { value: 'multi', label: 'Multi-city' },
        ]}
        flex={0.9}
        minWidth={150}
      />
      <window.DateRangeField label={tripType === 'oneway' ? 'Depart' : 'Depart — Return'} value={dates} onChange={setDates} icon={I.cal} flex={1.4} />
      <window.TravelersField label="Travelers" value={travelers} onChange={setTravelers} options={[]} flex={1} />
      <SF
        label="Cabin"
        value={cabin}
        onChange={setCabin}
        icon={I.plane}
        options={[
          { value: 'economy', label: 'Economy' },
          { value: 'premium', label: 'Premium economy' },
          { value: 'business', label: 'Business' },
          { value: 'first', label: 'First' },
        ]}
        flex={0.9}
        minWidth={150}
      />
    </window.SearchFormShell>
  );
}

// CARS
function CarSearch({ mobile, onSearch }) {
  const [pickup, setPickup] = React.useState('LAX — Los Angeles Intl.');
  const [dropoff, setDropoff] = React.useState('');
  const [dates, setDates] = React.useState({ start: 'May 12, 2026 · 10:00', end: 'May 19, 2026 · 10:00' });
  const [returnLoc, setReturnLoc] = React.useState('same');
  const [benefits, setBenefits] = React.useState('none');

  return (
    <window.SearchFormShell mobile={mobile} onSearch={onSearch || (() => {})}>
      <window.LocationField label="Pickup" value={pickup} onChange={setPickup} placeholder="Airport or city" icon={I.car} flex={1.3}
        suggestions={['LAX — Los Angeles Intl.', 'JFK — New York Intl.', 'MIA — Miami Intl.', 'Downtown San Diego']} />
      <SF
        label="Drop-off"
        value={returnLoc}
        onChange={setReturnLoc}
        icon={I.car}
        options={[
          { value: 'same', label: 'Same location' },
          { value: 'diff', label: 'Different location' },
        ]}
        flex={0.9}
        minWidth={160}
      />
      {returnLoc === 'diff' && (
        <window.LocationField label="Drop-off" value={dropoff} onChange={setDropoff} placeholder="Airport or city" icon={I.car} flex={1.3} />
      )}
      <window.DateRangeField label="Pickup — Drop-off" value={dates} onChange={setDates} icon={I.cal} flex={1.5} />
      <window.BenefitsField value={benefits} onChange={setBenefits} flex={0.9} />
    </window.SearchFormShell>
  );
}

// CRUISES
function CruiseSearch({ mobile, onSearch }) {
  const [dest, setDest] = React.useState('Caribbean');
  const [from, setFrom] = React.useState('Miami, FL');
  const [duration, setDuration] = React.useState('7-9');
  const [window_, setWindow] = React.useState({ start: 'Jun 01, 2026', end: 'Jun 30, 2026' });
  const [travelers, setTravelers] = React.useState({ adults: 2, children: 0 });

  return (
    <window.SearchFormShell mobile={mobile} onSearch={onSearch || (() => {})}>
      <window.LocationField label="Destination" value={dest} onChange={setDest} placeholder="Where to sail" icon={I.ship} flex={1.3}
        suggestions={['Caribbean', 'Mediterranean', 'Alaska', 'Northern Europe', 'Asia & Pacific', 'Transatlantic']} />
      <window.LocationField label="Departure port" value={from} onChange={setFrom} placeholder="Any port" icon={I.pin} flex={1.2}
        suggestions={['Miami, FL', 'Fort Lauderdale, FL', 'Galveston, TX', 'Barcelona, Spain']} />
      <SF
        label="Duration"
        value={duration}
        onChange={setDuration}
        icon={I.cal}
        options={[
          { value: '1-4', label: '1 – 4 nights' },
          { value: '5-6', label: '5 – 6 nights' },
          { value: '7-9', label: '7 – 9 nights' },
          { value: '10+', label: '10+ nights' },
        ]}
        flex={1}
        minWidth={170}
      />
      <window.DateRangeField label="Departing between" value={window_} onChange={setWindow} icon={I.cal} flex={1.4} />
      <window.TravelersField label="Guests" value={travelers} onChange={setTravelers} options={[]} flex={1} />
    </window.SearchFormShell>
  );
}

// TOURS
function TourSearch({ mobile, onSearch }) {
  const [dest, setDest] = React.useState('Italy');
  const [dates, setDates] = React.useState({ start: 'Sep 10, 2026', end: 'Sep 22, 2026' });
  const [duration, setDuration] = React.useState('any');
  const [travelers, setTravelers] = React.useState({ adults: 2, children: 0 });

  return (
    <window.SearchFormShell mobile={mobile} onSearch={onSearch || (() => {})}>
      <window.LocationField label="Destination" value={dest} onChange={setDest} placeholder="Country or region" icon={I.pin} flex={1.5}
        suggestions={['Italy', 'Iceland', 'Japan', 'Peru', 'Egypt', 'Greece']} />
      <window.DateRangeField label="Departure window" value={dates} onChange={setDates} icon={I.cal} flex={1.5} />
      <SF
        label="Tour length"
        value={duration}
        onChange={setDuration}
        icon={I.cal}
        options={[
          { value: 'any', label: 'Any length' },
          { value: 'short', label: '3 – 6 days' },
          { value: 'mid', label: '7 – 10 days' },
          { value: 'long', label: '11+ days' },
        ]}
        flex={1}
        minWidth={170}
      />
      <window.TravelersField label="Travelers" value={travelers} onChange={setTravelers} options={[]} flex={1} />
    </window.SearchFormShell>
  );
}

// ACTIVITIES
function ActivitySearch({ mobile, onSearch }) {
  const [dest, setDest] = React.useState('Lisbon, Portugal');
  const [date, setDate] = React.useState({ start: 'May 18, 2026', end: '' });

  return (
    <window.SearchFormShell mobile={mobile} onSearch={onSearch || (() => {})}>
      <window.LocationField label="Where" value={dest} onChange={setDest} placeholder="City or attraction" icon={I.bolt} flex={2} />
      <window.DateRangeField label="Date" value={date} onChange={setDate} icon={I.cal} flex={1.2} />
    </window.SearchFormShell>
  );
}

// PACKAGES
function PackageSearch({ mobile, onSearch }) {
  const [combo, setCombo] = React.useState('flight-hotel');
  const [from, setFrom] = React.useState('SFO — San Francisco');
  const [to, setTo] = React.useState('Cancún, Mexico');
  const [dates, setDates] = React.useState({ start: 'Jul 10, 2026', end: 'Jul 17, 2026' });
  const [travelers, setTravelers] = React.useState({ adults: 2, children: 0, rooms: 1 });

  return (
    <window.SearchFormShell mobile={mobile} onSearch={onSearch || (() => {})}>
      <SF
        label="Bundle"
        value={combo}
        onChange={setCombo}
        icon={I.pkg}
        options={[
          { value: 'flight-hotel', label: 'Flight + Hotel' },
          { value: 'flight-hotel-car', label: 'Flight + Hotel + Car' },
          { value: 'hotel-car', label: 'Hotel + Car' },
        ]}
        flex={0.9}
        minWidth={180}
      />
      {combo.startsWith('flight') && (
        <window.LocationField label="Flying from" value={from} onChange={setFrom} placeholder="City or airport" icon={I.plane} flex={1.1} />
      )}
      <window.LocationField label="Going to" value={to} onChange={setTo} placeholder="City or resort" icon={I.pkg} flex={1.2} />
      <window.DateRangeField label="When" value={dates} onChange={setDates} icon={I.cal} flex={1.4} />
      <window.TravelersField label="Travelers" value={travelers} onChange={setTravelers} options={['rooms']} flex={1} />
    </window.SearchFormShell>
  );
}

// RENTALS
function RentalSearch({ mobile, onSearch }) {
  const [where, setWhere] = React.useState('Maui, Hawaii');
  const [dates, setDates] = React.useState({ start: 'Aug 02, 2026', end: 'Aug 09, 2026' });
  const [travelers, setTravelers] = React.useState({ adults: 4, children: 2, rooms: 2 });
  return (
    <window.SearchFormShell mobile={mobile} onSearch={onSearch || (() => {})}>
      <window.LocationField label="Where to" value={where} onChange={setWhere} placeholder="City, region, or property name" icon={I.home} flex={1.6} />
      <window.DateRangeField label="When" value={dates} onChange={setDates} icon={I.cal} flex={1.4} />
      <window.TravelersField label="Guests" value={travelers} onChange={setTravelers} options={['rooms']} flex={1.1} />
    </window.SearchFormShell>
  );
}

window.ProductSearch = {
  hotels: HotelSearch,
  flights: FlightSearch,
  cars: CarSearch,
  cruises: CruiseSearch,
  tours: TourSearch,
  activities: ActivitySearch,
  packages: PackageSearch,
  rentals: RentalSearch,
};

// ─── COMPACT (results-page) forms ────────────────────────────────────────
// One-line dense versions for use inside the dark nav strip.

function CompactBase({ fields, onSearch, mobile, summary }) {
  return (
    <window.CompactFormShell mobile={mobile} onSearch={onSearch} summary={summary}>
      {fields}
    </window.CompactFormShell>
  );
}

// Helper popovers using CompactField as trigger.
function CompactLocation({ label, value, onChange, icon, flex = 1.4, minWidth = 160, suggestions }) {
  const [opened, setOpened] = React.useState(false);
  const list = suggestions || ['Paris, France', 'Tokyo, Japan', 'Lisbon, Portugal', 'New York, USA'];
  const { Popover, Stack: PStack, UnstyledButton: UB, Text: PT } = window.mantine;
  return (
    <Popover opened={opened} onChange={setOpened} position="bottom-start" offset={6} withinPortal shadow="md">
      <Popover.Target>
        <window.CompactField icon={icon} label={label} value={value} placeholder="Anywhere" onClick={() => setOpened((o) => !o)} opened={opened} flex={flex} minWidth={minWidth} />
      </Popover.Target>
      <Popover.Dropdown p={6} style={{ minWidth: 240 }}>
        <PStack gap={2}>
          {list.map((s) => (
            <UB key={s} onClick={() => { onChange(s); setOpened(false); }} style={{ padding: '8px 10px', borderRadius: 8, fontSize: 14 }}>
              {s}
            </UB>
          ))}
        </PStack>
      </Popover.Dropdown>
    </Popover>
  );
}

function CompactDate({ label, value, onChange, icon, flex = 1.2, minWidth = 160 }) {
  const [opened, setOpened] = React.useState(false);
  const display = value?.start && value?.end ? `${value.start} – ${value.end}` : value?.start || '';
  const { Popover, Stack: PStack, Group: PG, Button: PB } = window.mantine;
  return (
    <Popover opened={opened} onChange={setOpened} position="bottom-start" offset={6} withinPortal shadow="md">
      <Popover.Target>
        <window.CompactField icon={icon} label={label} value={display} placeholder="Add dates" onClick={() => setOpened((o) => !o)} opened={opened} flex={flex} minWidth={minWidth} />
      </Popover.Target>
      <Popover.Dropdown p="md" style={{ width: 280 }}>
        <PG justify="space-between">
          <PB size="xs" variant="subtle" onClick={() => onChange({ start: '', end: '' })}>Clear</PB>
          <PB size="xs" color="teal" onClick={() => setOpened(false)}>Done</PB>
        </PG>
      </Popover.Dropdown>
    </Popover>
  );
}

function CompactSelect({ label, value, onChange, options, icon, flex = 1, minWidth = 140 }) {
  const [opened, setOpened] = React.useState(false);
  const display = options.find((o) => (o.value ?? o) === value)?.label ?? value;
  const { Popover, Stack: PStack, UnstyledButton: UB } = window.mantine;
  return (
    <Popover opened={opened} onChange={setOpened} position="bottom-start" offset={6} withinPortal shadow="md">
      <Popover.Target>
        <window.CompactField icon={icon} label={label} value={display} placeholder="Select" onClick={() => setOpened((o) => !o)} opened={opened} flex={flex} minWidth={minWidth} />
      </Popover.Target>
      <Popover.Dropdown p={6} style={{ minWidth: 200 }}>
        <PStack gap={2}>
          {options.map((o) => {
            const v = o.value ?? o; const l = o.label ?? o;
            return (
              <UB key={v} onClick={() => { onChange(v); setOpened(false); }} style={{ padding: '8px 10px', borderRadius: 8, fontSize: 14, fontWeight: v === value ? 700 : 500, color: v === value ? 'var(--mantine-color-teal-8)' : 'inherit' }}>{l}</UB>
            );
          })}
        </PStack>
      </Popover.Dropdown>
    </Popover>
  );
}

function CompactTravelers({ label = 'Guests', value, onChange, options = [], flex = 1, minWidth = 140 }) {
  const [opened, setOpened] = React.useState(false);
  const parts = [];
  if (value.adults != null) parts.push(`${value.adults} ${value.adults === 1 ? 'adult' : 'adults'}`);
  if (value.children != null) parts.push(`${value.children} ${value.children === 1 ? 'child' : 'children'}`);
  if (options.includes('rooms') && value.rooms != null) parts.push(`${value.rooms} ${value.rooms === 1 ? 'room' : 'rooms'}`);
  const display = parts.join(' · ');
  const { Popover, Stack: PStack, Group: PG, Text: PT, ActionIcon: AI, Button: PB } = window.mantine;
  const Row = ({ k, label, min = 0 }) => (
    <PG justify="space-between" wrap="nowrap">
      <PT size="sm" fw={600}>{label}</PT>
      <PG gap={6} wrap="nowrap">
        <AI variant="default" size="md" radius="xl" disabled={(value[k] ?? 0) <= min} onClick={() => onChange({ ...value, [k]: Math.max(min, (value[k] ?? 0) - 1) })}>−</AI>
        <PT size="sm" fw={600} w={20} ta="center">{value[k] ?? 0}</PT>
        <AI variant="default" size="md" radius="xl" onClick={() => onChange({ ...value, [k]: (value[k] ?? 0) + 1 })}>+</AI>
      </PG>
    </PG>
  );
  return (
    <Popover opened={opened} onChange={setOpened} position="bottom-end" offset={6} withinPortal shadow="md">
      <Popover.Target>
        <window.CompactField icon={I.user} label={label} value={display} placeholder="Add travelers" onClick={() => setOpened((o) => !o)} opened={opened} flex={flex} minWidth={minWidth} />
      </Popover.Target>
      <Popover.Dropdown p="md" style={{ width: 260 }}>
        <PStack gap="sm">
          <Row k="adults" label="Adults" min={1} />
          <Row k="children" label="Children" />
          {options.includes('rooms') && <Row k="rooms" label="Rooms" min={1} />}
          <PG justify="flex-end"><PB size="xs" color="teal" onClick={() => setOpened(false)}>Done</PB></PG>
        </PStack>
      </Popover.Dropdown>
    </Popover>
  );
}

function HotelCompact({ mobile, onSearch }) {
  const [where, setWhere] = React.useState('Paris, France');
  const [dates, setDates] = React.useState({ start: 'May 12', end: 'May 19' });
  const [travelers, setTravelers] = React.useState({ adults: 2, children: 0, rooms: 1 });
  const summary = { main: where, sub: `${dates.start} – ${dates.end} · ${travelers.rooms} room, ${travelers.adults} adults` };
  return (
    <CompactBase mobile={mobile} onSearch={onSearch} summary={summary} fields={<>
      <CompactLocation label="Where" value={where} onChange={setWhere} icon={I.pin} flex={1.4} />
      <CompactDate label="When" value={dates} onChange={setDates} icon={I.cal} flex={1.2} />
      <CompactTravelers label="Travelers" value={travelers} onChange={setTravelers} options={['rooms']} flex={1} />
    </>} />
  );
}
function FlightCompact({ mobile, onSearch }) {
  const [tripType, setTripType] = React.useState('roundtrip');
  const [from, setFrom] = React.useState('SFO');
  const [to, setTo] = React.useState('NRT');
  const [dates, setDates] = React.useState({ start: 'Jun 04', end: 'Jun 14' });
  const [travelers, setTravelers] = React.useState({ adults: 1, children: 0 });
  const [cabin, setCabin] = React.useState('economy');
  const tripLabel = { roundtrip: 'Round trip', oneway: 'One way', multi: 'Multi-city' }[tripType];
  const cabinLabel = { economy: 'Economy', premium: 'Premium', business: 'Business', first: 'First' }[cabin];
  const summary = { main: `${from} → ${to}`, sub: `${tripLabel} · ${dates.start} – ${dates.end} · ${travelers.adults} adult · ${cabinLabel}` };
  return (
    <CompactBase mobile={mobile} onSearch={onSearch} summary={summary} fields={<>
      <CompactLocation label="From" value={from} onChange={setFrom} icon={I.plane} flex={0.9} minWidth={110} />
      <CompactLocation label="To" value={to} onChange={setTo} icon={I.plane} flex={0.9} minWidth={110} />
      <CompactSelect label="Trip type" value={tripType} onChange={setTripType} icon={I.swap} options={[{value:'roundtrip',label:'Round trip'},{value:'oneway',label:'One way'},{value:'multi',label:'Multi-city'}]} flex={0.8} minWidth={140} />
      <CompactDate label="Dates" value={dates} onChange={setDates} icon={I.cal} flex={1.1} />
      <CompactTravelers label="Travelers" value={travelers} onChange={setTravelers} flex={0.9} />
      <CompactSelect label="Cabin" value={cabin} onChange={setCabin} icon={I.plane} options={[{value:'economy',label:'Economy'},{value:'premium',label:'Premium'},{value:'business',label:'Business'},{value:'first',label:'First'}]} flex={0.8} minWidth={130} />
    </>} />
  );
}
function CarCompact({ mobile, onSearch }) {
  const [returnLoc, setReturnLoc] = React.useState('same');
  const [pickup, setPickup] = React.useState('LAX');
  const [dates, setDates] = React.useState({ start: 'May 12', end: 'May 19' });
  const [benefits, setBenefits] = React.useState('none');
  const summary = { main: pickup, sub: `${dates.start} – ${dates.end} · ${returnLoc === 'same' ? 'Same drop-off' : 'Different drop-off'}` };
  return (
    <CompactBase mobile={mobile} onSearch={onSearch} summary={summary} fields={<>
      <CompactLocation label="Pickup" value={pickup} onChange={setPickup} icon={I.car} flex={1.2} />
      <CompactSelect label="Drop-off" value={returnLoc} onChange={setReturnLoc} icon={I.car} options={[{value:'same',label:'Same location'},{value:'diff',label:'Different location'}]} flex={0.9} minWidth={150} />
      <CompactDate label="Pickup – Drop-off" value={dates} onChange={setDates} icon={I.cal} flex={1.3} minWidth={180} />
      <CompactSelect label="Benefits" value={benefits} onChange={setBenefits} icon={I.bolt} options={[{value:'none',label:'No benefits'},{value:'promo',label:'Hertz promo code'},{value:'rewards',label:'Hertz rewards #'},{value:'both',label:'Promo + rewards'}]} flex={0.9} minWidth={150} />
    </>} />
  );
}
function CruiseCompact({ mobile, onSearch }) {
  const [dest, setDest] = React.useState('Caribbean');
  const [duration, setDuration] = React.useState('7-9');
  const [window_, setWindow] = React.useState({ start: 'Jun 01', end: 'Jun 30' });
  const [travelers, setTravelers] = React.useState({ adults: 2, children: 0 });
  const summary = { main: dest, sub: `${window_.start} – ${window_.end} · ${duration} nights · ${travelers.adults} adults` };
  return (
    <CompactBase mobile={mobile} onSearch={onSearch} summary={summary} fields={<>
      <CompactLocation label="Destination" value={dest} onChange={setDest} icon={I.ship} flex={1.2} />
      <CompactSelect label="Duration" value={duration} onChange={setDuration} icon={I.cal} options={[{value:'1-4',label:'1–4 nights'},{value:'5-6',label:'5–6 nights'},{value:'7-9',label:'7–9 nights'},{value:'10+',label:'10+ nights'}]} flex={1} />
      <CompactDate label="Departing between" value={window_} onChange={setWindow} icon={I.cal} flex={1.2} minWidth={170} />
      <CompactTravelers label="Guests" value={travelers} onChange={setTravelers} flex={1} />
    </>} />
  );
}
function TourCompact({ mobile, onSearch }) {
  const [dest, setDest] = React.useState('Italy');
  const [dates, setDates] = React.useState({ start: 'Sep 10', end: 'Sep 22' });
  const [duration, setDuration] = React.useState('mid');
  const [travelers, setTravelers] = React.useState({ adults: 2, children: 0 });
  const lenLabel = { any:'Any length', short:'3–6 days', mid:'7–10 days', long:'11+ days' }[duration];
  const summary = { main: dest, sub: `${dates.start} – ${dates.end} · ${lenLabel} · ${travelers.adults} adults` };
  return (
    <CompactBase mobile={mobile} onSearch={onSearch} summary={summary} fields={<>
      <CompactLocation label="Destination" value={dest} onChange={setDest} icon={I.pin} flex={1.2} />
      <CompactDate label="Departure window" value={dates} onChange={setDates} icon={I.cal} flex={1.3} minWidth={180} />
      <CompactSelect label="Length" value={duration} onChange={setDuration} icon={I.cal} options={[{value:'any',label:'Any length'},{value:'short',label:'3–6 days'},{value:'mid',label:'7–10 days'},{value:'long',label:'11+ days'}]} flex={0.9} />
      <CompactTravelers label="Travelers" value={travelers} onChange={setTravelers} flex={1} />
    </>} />
  );
}
function ActivityCompact({ mobile, onSearch }) {
  const [dest, setDest] = React.useState('Lisbon, Portugal');
  const [date, setDate] = React.useState({ start: 'May 18, 2026', end: '' });
  const summary = { main: dest, sub: date.start || 'Any date' };
  return (
    <CompactBase mobile={mobile} onSearch={onSearch} summary={summary} fields={<>
      <CompactLocation label="Where" value={dest} onChange={setDest} icon={I.bolt} flex={2} />
      <CompactDate label="Date" value={date} onChange={setDate} icon={I.cal} flex={1.2} />
    </>} />
  );
}
function PackageCompact({ mobile, onSearch }) {
  const [combo, setCombo] = React.useState('flight-hotel');
  const [from, setFrom] = React.useState('SFO');
  const [to, setTo] = React.useState('Cancún');
  const [dates, setDates] = React.useState({ start: 'Jul 10', end: 'Jul 17' });
  const [travelers, setTravelers] = React.useState({ adults: 2, children: 0, rooms: 1 });
  const comboLabel = { 'flight-hotel':'Flight + Hotel', 'flight-hotel-car':'Flight + Hotel + Car', 'hotel-car':'Hotel + Car' }[combo];
  const summary = { main: `${from} → ${to}`, sub: `${comboLabel} · ${dates.start} – ${dates.end} · ${travelers.adults} adults` };
  return (
    <CompactBase mobile={mobile} onSearch={onSearch} summary={summary} fields={<>
      <CompactSelect label="Bundle" value={combo} onChange={setCombo} icon={I.pkg} options={[{value:'flight-hotel',label:'Flight + Hotel'},{value:'flight-hotel-car',label:'Flight + Hotel + Car'},{value:'hotel-car',label:'Hotel + Car'}]} flex={1} minWidth={170} />
      {combo.startsWith('flight') && <CompactLocation label="From" value={from} onChange={setFrom} icon={I.plane} flex={0.9} minWidth={110} />}
      <CompactLocation label="To" value={to} onChange={setTo} icon={I.pkg} flex={1} />
      <CompactDate label="When" value={dates} onChange={setDates} icon={I.cal} flex={1.2} />
      <CompactTravelers label="Travelers" value={travelers} onChange={setTravelers} options={['rooms']} flex={1} />
    </>} />
  );
}
function RentalCompact({ mobile, onSearch }) {
  const [where, setWhere] = React.useState('Maui, Hawaii');
  const [dates, setDates] = React.useState({ start: 'Aug 02', end: 'Aug 09' });
  const [travelers, setTravelers] = React.useState({ adults: 4, children: 2, rooms: 2 });
  const summary = { main: where, sub: `${dates.start} – ${dates.end} · ${travelers.adults + travelers.children} guests, ${travelers.rooms} bedrooms` };
  return (
    <CompactBase mobile={mobile} onSearch={onSearch} summary={summary} fields={<>
      <CompactLocation label="Where" value={where} onChange={setWhere} icon={I.home} flex={1.5} />
      <CompactDate label="When" value={dates} onChange={setDates} icon={I.cal} flex={1.2} />
      <CompactTravelers label="Guests" value={travelers} onChange={setTravelers} options={['rooms']} flex={1} />
    </>} />
  );
}

window.ProductCompactSearch = {
  hotels: HotelCompact,
  flights: FlightCompact,
  cars: CarCompact,
  cruises: CruiseCompact,
  tours: TourCompact,
  activities: ActivityCompact,
  packages: PackageCompact,
  rentals: RentalCompact,
};
})();
