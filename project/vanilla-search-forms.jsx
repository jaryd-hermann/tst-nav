// vanilla-search-forms.jsx
// Out-of-the-box Mantine components — only color customisation (color="brand").
// No custom heights, borders, shadows, or padding overrides.
(function() {
const {
  Group, Stack, Paper, Box, Text, Badge,
  TextInput, Select, Autocomplete, NumberInput, SegmentedControl,
  Button, Divider,
} = window.mantine;

const I = window.SearchIcons || {};

// Icon wrapper sized for Mantine leftSection
function Ic({ icon, size = 16 }) {
  return (
    <span style={{ width: size, height: size, display: 'inline-flex', flexShrink: 0,
      color: 'var(--mantine-color-gray-5)' }}>{icon}</span>
  );
}

// ── Static suggestion data ────────────────────────────────────────────────
const PLACES = {
  hotels:     ['Paris, France','London, UK','New York, USA','Tokyo, Japan','Barcelona, Spain','Rome, Italy','Amsterdam, Netherlands','Prague, Czech Republic'],
  flights:    ['SFO — San Francisco','JFK — New York','LAX — Los Angeles','LHR — London Heathrow','CDG — Paris Charles de Gaulle','NRT — Tokyo Narita','DXB — Dubai','SYD — Sydney'],
  cars:       ['LAX — Los Angeles Intl.','JFK — New York JFK','SFO — San Francisco','Midtown Manhattan, NY','Miami Beach, FL','Las Vegas Strip, NV'],
  cruises:    ['Miami, FL','Port Canaveral, FL','Fort Lauderdale, FL','Galveston, TX','Barcelona, Spain','Southampton, UK'],
  tours:      ['Italy','France','Japan','Peru','Morocco','India','New Zealand','Greece'],
  activities: ['Paris, France','Lisbon, Portugal','Rome, Italy','Barcelona, Spain','Tokyo, Japan','New York, USA'],
  packages:   ['Cancún, Mexico','Maui, Hawaii','Tulum, Mexico','Phuket, Thailand','Bali, Indonesia','Maldives'],
  rentals:    ['Maui, Hawaii','Aspen, CO','Miami Beach, FL','Malibu, CA','Nantucket, MA','Lake Tahoe, CA'],
};

// ── Hero form shell ───────────────────────────────────────────────────────
// Paper + Group(align=flex-end) — the only structure, no custom styles.
function VShell({ children, onSearch, label = 'Search' }) {
  return (
    <Paper shadow="md" withBorder radius="md" p="lg">
      <Group align="flex-end" gap="md" wrap="wrap">
        {children}
        <Button size="lg" color="brand" onClick={onSearch} style={{ flexShrink: 0, alignSelf: 'flex-end' }}>
          {label}
        </Button>
      </Group>
    </Paper>
  );
}

// ══════════════════════════════════════════════════════════════════════════
//  HERO SEARCH FORMS
// ══════════════════════════════════════════════════════════════════════════

function VHotelSearch({ mobile, onSearch }) {
  const [where, setWhere]   = React.useState('Paris, France');
  const [cin, setCin]       = React.useState('2026-05-12');
  const [cout, setCout]     = React.useState('2026-05-19');
  const [adults, setAdults] = React.useState(2);
  const [rooms, setRooms]   = React.useState(1);
  return (
    <VShell onSearch={onSearch || (() => {})} label="Search hotels">
      <Autocomplete label="Where to" placeholder="City, hotel, or landmark"
        value={where} onChange={setWhere} data={PLACES.hotels}
        leftSection={<Ic icon={I.pin} />} style={{ flex: '1 1 240px', minWidth: 180 }} />
      <TextInput type="date" label="Check-in" value={cin}
        onChange={(e) => setCin(e.target.value)}
        leftSection={<Ic icon={I.cal} />} style={{ flex: '1 1 150px', minWidth: 130 }} />
      <TextInput type="date" label="Check-out" value={cout}
        onChange={(e) => setCout(e.target.value)}
        leftSection={<Ic icon={I.cal} />} style={{ flex: '1 1 150px', minWidth: 130 }} />
      <NumberInput label="Adults" value={adults} onChange={setAdults} min={1} max={10}
        leftSection={<Ic icon={I.user} />} style={{ flex: '0 1 110px', minWidth: 90 }} />
      <NumberInput label="Rooms" value={rooms} onChange={setRooms} min={1} max={10}
        leftSection={<Ic icon={I.home} />} style={{ flex: '0 1 100px', minWidth: 85 }} />
    </VShell>
  );
}

function VFlightSearch({ mobile, onSearch }) {
  const [tripType, setTripType] = React.useState('roundtrip');
  const [from, setFrom]         = React.useState('SFO — San Francisco');
  const [to, setTo]             = React.useState('NRT — Tokyo Narita');
  const [depart, setDepart]     = React.useState('2026-06-04');
  const [ret, setRet]           = React.useState('2026-06-14');
  const [adults, setAdults]     = React.useState(1);
  const [cabin, setCabin]       = React.useState('economy');
  return (
    <Paper shadow="md" withBorder radius="md" p="lg">
      <Stack gap="md">
        <SegmentedControl
          value={tripType} onChange={setTripType} color="brand"
          data={[{ value: 'roundtrip', label: 'Round trip' }, { value: 'oneway', label: 'One way' }, { value: 'multi', label: 'Multi-city' }]}
          style={{ alignSelf: 'flex-start' }}
        />
        <Group align="flex-end" gap="md" wrap="wrap">
          <Autocomplete label="From" placeholder="City or airport"
            value={from} onChange={setFrom} data={PLACES.flights}
            leftSection={<Ic icon={I.plane} />} style={{ flex: '1 1 200px', minWidth: 160 }} />
          <Autocomplete label="To" placeholder="City or airport"
            value={to} onChange={setTo} data={PLACES.flights}
            leftSection={<Ic icon={I.plane} />} style={{ flex: '1 1 200px', minWidth: 160 }} />
          <TextInput type="date" label="Depart" value={depart}
            onChange={(e) => setDepart(e.target.value)}
            leftSection={<Ic icon={I.cal} />} style={{ flex: '1 1 150px', minWidth: 130 }} />
          {tripType !== 'oneway' && (
            <TextInput type="date" label="Return" value={ret}
              onChange={(e) => setRet(e.target.value)}
              leftSection={<Ic icon={I.cal} />} style={{ flex: '1 1 150px', minWidth: 130 }} />
          )}
          <NumberInput label="Adults" value={adults} onChange={setAdults} min={1} max={9}
            leftSection={<Ic icon={I.user} />} style={{ flex: '0 1 100px', minWidth: 85 }} />
          <Select label="Cabin" value={cabin} onChange={setCabin}
            leftSection={<Ic icon={I.plane} />} style={{ flex: '0 1 160px', minWidth: 130 }}
            data={[{ value: 'economy', label: 'Economy' }, { value: 'premium', label: 'Premium economy' }, { value: 'business', label: 'Business' }, { value: 'first', label: 'First' }]} />
          <Button size="lg" color="brand" style={{ flexShrink: 0, alignSelf: 'flex-end' }} onClick={onSearch || (() => {})}>
            Search flights
          </Button>
        </Group>
      </Stack>
    </Paper>
  );
}

function VCarSearch({ mobile, onSearch }) {
  const [pickup, setPickup]   = React.useState('LAX — Los Angeles Intl.');
  const [dropoff, setDropoff] = React.useState('same');
  const [pickDate, setPickDate] = React.useState('2026-05-12');
  const [dropDate, setDropDate] = React.useState('2026-05-19');
  const [pickTime, setPickTime] = React.useState('10:00');
  return (
    <VShell onSearch={onSearch || (() => {})} label="Search cars">
      <Autocomplete label="Pickup location" placeholder="Airport, city, or address"
        value={pickup} onChange={setPickup} data={PLACES.cars}
        leftSection={<Ic icon={I.car} />} style={{ flex: '1 1 240px', minWidth: 180 }} />
      <Select label="Drop-off" value={dropoff} onChange={setDropoff}
        leftSection={<Ic icon={I.car} />} style={{ flex: '0 1 180px', minWidth: 150 }}
        data={[{ value: 'same', label: 'Same location' }, { value: 'diff', label: 'Different location' }]} />
      <TextInput type="date" label="Pick-up date" value={pickDate}
        onChange={(e) => setPickDate(e.target.value)}
        leftSection={<Ic icon={I.cal} />} style={{ flex: '1 1 150px', minWidth: 130 }} />
      <TextInput type="time" label="Pick-up time" value={pickTime}
        onChange={(e) => setPickTime(e.target.value)}
        style={{ flex: '0 1 120px', minWidth: 100 }} />
      <TextInput type="date" label="Drop-off date" value={dropDate}
        onChange={(e) => setDropDate(e.target.value)}
        leftSection={<Ic icon={I.cal} />} style={{ flex: '1 1 150px', minWidth: 130 }} />
    </VShell>
  );
}

function VCruiseSearch({ mobile, onSearch }) {
  const [dest, setDest]       = React.useState('Caribbean');
  const [port, setPort]       = React.useState('Miami, FL');
  const [duration, setDur]    = React.useState('7-9');
  const [from, setFrom]       = React.useState('2026-06-01');
  const [to, setTo]           = React.useState('2026-06-30');
  const [adults, setAdults]   = React.useState(2);
  return (
    <VShell onSearch={onSearch || (() => {})} label="Search cruises">
      <Autocomplete label="Destination" placeholder="Where to sail"
        value={dest} onChange={setDest} data={['Caribbean','Mediterranean','Alaska','Bahamas','Europe','Hawaii','Asia','Australia']}
        leftSection={<Ic icon={I.pin} />} style={{ flex: '1 1 180px', minWidth: 150 }} />
      <Autocomplete label="Departure port" placeholder="Any port"
        value={port} onChange={setPort} data={PLACES.cruises}
        leftSection={<Ic icon={I.ship} />} style={{ flex: '1 1 180px', minWidth: 150 }} />
      <Select label="Duration" value={duration} onChange={setDur}
        leftSection={<Ic icon={I.cal} />} style={{ flex: '0 1 160px', minWidth: 130 }}
        data={[{ value: '1-4', label: '1 – 4 nights' }, { value: '5-6', label: '5 – 6 nights' }, { value: '7-9', label: '7 – 9 nights' }, { value: '10+', label: '10+ nights' }]} />
      <TextInput type="date" label="Earliest departure" value={from}
        onChange={(e) => setFrom(e.target.value)}
        leftSection={<Ic icon={I.cal} />} style={{ flex: '1 1 150px', minWidth: 130 }} />
      <TextInput type="date" label="Latest departure" value={to}
        onChange={(e) => setTo(e.target.value)}
        leftSection={<Ic icon={I.cal} />} style={{ flex: '1 1 150px', minWidth: 130 }} />
      <NumberInput label="Guests" value={adults} onChange={setAdults} min={1} max={20}
        leftSection={<Ic icon={I.user} />} style={{ flex: '0 1 100px', minWidth: 85 }} />
    </VShell>
  );
}

function VTourSearch({ mobile, onSearch }) {
  const [dest, setDest]     = React.useState('Italy');
  const [from, setFrom]     = React.useState('2026-09-10');
  const [to, setTo]         = React.useState('2026-09-22');
  const [duration, setDur]  = React.useState('mid');
  const [adults, setAdults] = React.useState(2);
  return (
    <VShell onSearch={onSearch || (() => {})} label="Search tours">
      <Autocomplete label="Destination" placeholder="Country or region"
        value={dest} onChange={setDest} data={PLACES.tours}
        leftSection={<Ic icon={I.pin} />} style={{ flex: '1 1 200px', minWidth: 160 }} />
      <TextInput type="date" label="Depart from" value={from}
        onChange={(e) => setFrom(e.target.value)}
        leftSection={<Ic icon={I.cal} />} style={{ flex: '1 1 150px', minWidth: 130 }} />
      <TextInput type="date" label="Depart by" value={to}
        onChange={(e) => setTo(e.target.value)}
        leftSection={<Ic icon={I.cal} />} style={{ flex: '1 1 150px', minWidth: 130 }} />
      <Select label="Tour length" value={duration} onChange={setDur}
        leftSection={<Ic icon={I.cal} />} style={{ flex: '0 1 160px', minWidth: 130 }}
        data={[{ value: 'any', label: 'Any length' }, { value: 'short', label: '3 – 6 days' }, { value: 'mid', label: '7 – 10 days' }, { value: 'long', label: '11+ days' }]} />
      <NumberInput label="Travelers" value={adults} onChange={setAdults} min={1} max={20}
        leftSection={<Ic icon={I.user} />} style={{ flex: '0 1 110px', minWidth: 90 }} />
    </VShell>
  );
}

function VActivitySearch({ mobile, onSearch }) {
  const [dest, setDest] = React.useState('Lisbon, Portugal');
  const [date, setDate] = React.useState('2026-05-18');
  return (
    <VShell onSearch={onSearch || (() => {})} label="Search experiences">
      <Autocomplete label="Where" placeholder="City or attraction"
        value={dest} onChange={setDest} data={PLACES.activities}
        leftSection={<Ic icon={I.pin} />} style={{ flex: '2 1 280px', minWidth: 200 }} />
      <TextInput type="date" label="Date" value={date}
        onChange={(e) => setDate(e.target.value)}
        leftSection={<Ic icon={I.cal} />} style={{ flex: '1 1 150px', minWidth: 130 }} />
    </VShell>
  );
}

function VPackageSearch({ mobile, onSearch }) {
  const [combo, setCombo]   = React.useState('flight-hotel');
  const [from, setFrom]     = React.useState('SFO — San Francisco');
  const [to, setTo]         = React.useState('Cancún, Mexico');
  const [depart, setDepart] = React.useState('2026-07-10');
  const [ret, setRet]       = React.useState('2026-07-17');
  const [adults, setAdults] = React.useState(2);
  const [rooms, setRooms]   = React.useState(1);
  return (
    <VShell onSearch={onSearch || (() => {})} label="Search packages">
      <Select label="Bundle type" value={combo} onChange={setCombo}
        leftSection={<Ic icon={I.bolt} />} style={{ flex: '0 1 200px', minWidth: 170 }}
        data={[{ value: 'flight-hotel', label: 'Flight + Hotel' }, { value: 'flight-hotel-car', label: 'Flight + Hotel + Car' }, { value: 'hotel-car', label: 'Hotel + Car' }]} />
      {combo.startsWith('flight') && (
        <Autocomplete label="Flying from" placeholder="City or airport"
          value={from} onChange={setFrom} data={PLACES.flights}
          leftSection={<Ic icon={I.plane} />} style={{ flex: '1 1 180px', minWidth: 150 }} />
      )}
      <Autocomplete label="Going to" placeholder="City or resort"
        value={to} onChange={setTo} data={PLACES.packages}
        leftSection={<Ic icon={I.pin} />} style={{ flex: '1 1 180px', minWidth: 150 }} />
      <TextInput type="date" label="Depart" value={depart}
        onChange={(e) => setDepart(e.target.value)}
        leftSection={<Ic icon={I.cal} />} style={{ flex: '1 1 150px', minWidth: 130 }} />
      <TextInput type="date" label="Return" value={ret}
        onChange={(e) => setRet(e.target.value)}
        leftSection={<Ic icon={I.cal} />} style={{ flex: '1 1 150px', minWidth: 130 }} />
      <NumberInput label="Adults" value={adults} onChange={setAdults} min={1} max={10}
        leftSection={<Ic icon={I.user} />} style={{ flex: '0 1 100px', minWidth: 85 }} />
      <NumberInput label="Rooms" value={rooms} onChange={setRooms} min={1} max={10}
        leftSection={<Ic icon={I.home} />} style={{ flex: '0 1 95px', minWidth: 80 }} />
    </VShell>
  );
}

function VRentalSearch({ mobile, onSearch }) {
  const [where, setWhere]   = React.useState('Maui, Hawaii');
  const [cin, setCin]       = React.useState('2026-08-02');
  const [cout, setCout]     = React.useState('2026-08-09');
  const [guests, setGuests] = React.useState(4);
  const [beds, setBeds]     = React.useState(2);
  return (
    <VShell onSearch={onSearch || (() => {})} label="Search rentals">
      <Autocomplete label="Where to" placeholder="City, region, or property name"
        value={where} onChange={setWhere} data={PLACES.rentals}
        leftSection={<Ic icon={I.pin} />} style={{ flex: '1 1 240px', minWidth: 180 }} />
      <TextInput type="date" label="Check-in" value={cin}
        onChange={(e) => setCin(e.target.value)}
        leftSection={<Ic icon={I.cal} />} style={{ flex: '1 1 150px', minWidth: 130 }} />
      <TextInput type="date" label="Check-out" value={cout}
        onChange={(e) => setCout(e.target.value)}
        leftSection={<Ic icon={I.cal} />} style={{ flex: '1 1 150px', minWidth: 130 }} />
      <NumberInput label="Guests" value={guests} onChange={setGuests} min={1} max={20}
        leftSection={<Ic icon={I.user} />} style={{ flex: '0 1 100px', minWidth: 85 }} />
      <NumberInput label="Bedrooms" value={beds} onChange={setBeds} min={1} max={10}
        leftSection={<Ic icon={I.home} />} style={{ flex: '0 1 110px', minWidth: 90 }} />
    </VShell>
  );
}

// ══════════════════════════════════════════════════════════════════════════
//  COMPACT FORMS  (results strip — size="sm", no Paper wrapper)
// ══════════════════════════════════════════════════════════════════════════

function VCShell({ children, onSearch, label = 'Search' }) {
  return (
    <Group align="center" gap="xs" wrap="nowrap" style={{ flex: 1, minWidth: 0, overflow: 'hidden' }}>
      {children}
      <Button size="sm" color="brand" onClick={onSearch} style={{ flexShrink: 0 }}>
        {label}
      </Button>
    </Group>
  );
}

function VHotelCompact({ mobile, onSearch }) {
  const [where, setWhere] = React.useState('Paris, France');
  const [cin, setCin]     = React.useState('2026-05-12');
  const [cout, setCout]   = React.useState('2026-05-19');
  return (
    <VCShell onSearch={onSearch || (() => {})}>
      <Autocomplete size="sm" placeholder="Where to" value={where} onChange={setWhere}
        data={PLACES.hotels} leftSection={<Ic icon={I.pin} size={13} />}
        style={{ flex: '1 1 140px', minWidth: 110 }} />
      <TextInput size="sm" type="date" value={cin} onChange={(e) => setCin(e.target.value)}
        leftSection={<Ic icon={I.cal} size={13} />}
        style={{ flex: '0 1 140px', minWidth: 120 }} />
      <TextInput size="sm" type="date" value={cout} onChange={(e) => setCout(e.target.value)}
        leftSection={<Ic icon={I.cal} size={13} />}
        style={{ flex: '0 1 140px', minWidth: 120 }} />
    </VCShell>
  );
}

function VFlightCompact({ mobile, onSearch }) {
  const [from, setFrom] = React.useState('SFO');
  const [to, setTo]     = React.useState('NRT');
  const [date, setDate] = React.useState('2026-06-04');
  const [cabin, setCabin] = React.useState('economy');
  return (
    <VCShell onSearch={onSearch || (() => {})}>
      <Autocomplete size="sm" placeholder="From" value={from} onChange={setFrom}
        data={PLACES.flights} leftSection={<Ic icon={I.plane} size={13} />}
        style={{ flex: '1 1 120px', minWidth: 90 }} />
      <Autocomplete size="sm" placeholder="To" value={to} onChange={setTo}
        data={PLACES.flights} leftSection={<Ic icon={I.plane} size={13} />}
        style={{ flex: '1 1 120px', minWidth: 90 }} />
      <TextInput size="sm" type="date" value={date} onChange={(e) => setDate(e.target.value)}
        leftSection={<Ic icon={I.cal} size={13} />}
        style={{ flex: '0 1 140px', minWidth: 120 }} />
      <Select size="sm" value={cabin} onChange={setCabin}
        data={[{value:'economy',label:'Economy'},{value:'business',label:'Business'},{value:'first',label:'First'}]}
        style={{ flex: '0 1 120px', minWidth: 100 }} />
    </VCShell>
  );
}

function VCarCompact({ mobile, onSearch }) {
  const [pickup, setPickup] = React.useState('LAX');
  const [date, setDate]     = React.useState('2026-05-12');
  return (
    <VCShell onSearch={onSearch || (() => {})}>
      <Autocomplete size="sm" placeholder="Pickup location" value={pickup} onChange={setPickup}
        data={PLACES.cars} leftSection={<Ic icon={I.car} size={13} />}
        style={{ flex: '1 1 160px', minWidth: 120 }} />
      <TextInput size="sm" type="date" value={date} onChange={(e) => setDate(e.target.value)}
        leftSection={<Ic icon={I.cal} size={13} />}
        style={{ flex: '0 1 140px', minWidth: 120 }} />
    </VCShell>
  );
}

function VCruiseCompact({ mobile, onSearch }) {
  const [dest, setDest]   = React.useState('Caribbean');
  const [date, setDate]   = React.useState('2026-06-01');
  const [dur, setDur]     = React.useState('7-9');
  return (
    <VCShell onSearch={onSearch || (() => {})}>
      <Autocomplete size="sm" placeholder="Destination" value={dest} onChange={setDest}
        data={['Caribbean','Mediterranean','Alaska','Bahamas','Europe','Hawaii']}
        leftSection={<Ic icon={I.pin} size={13} />}
        style={{ flex: '1 1 140px', minWidth: 110 }} />
      <Select size="sm" value={dur} onChange={setDur}
        data={[{value:'1-4',label:'1–4 nights'},{value:'5-6',label:'5–6 nights'},{value:'7-9',label:'7–9 nights'},{value:'10+',label:'10+ nights'}]}
        style={{ flex: '0 1 130px', minWidth: 110 }} />
      <TextInput size="sm" type="date" value={date} onChange={(e) => setDate(e.target.value)}
        leftSection={<Ic icon={I.cal} size={13} />}
        style={{ flex: '0 1 140px', minWidth: 120 }} />
    </VCShell>
  );
}

function VTourCompact({ mobile, onSearch }) {
  const [dest, setDest] = React.useState('Italy');
  const [date, setDate] = React.useState('2026-09-10');
  return (
    <VCShell onSearch={onSearch || (() => {})}>
      <Autocomplete size="sm" placeholder="Destination" value={dest} onChange={setDest}
        data={PLACES.tours} leftSection={<Ic icon={I.pin} size={13} />}
        style={{ flex: '1 1 150px', minWidth: 120 }} />
      <TextInput size="sm" type="date" value={date} onChange={(e) => setDate(e.target.value)}
        leftSection={<Ic icon={I.cal} size={13} />}
        style={{ flex: '0 1 140px', minWidth: 120 }} />
    </VCShell>
  );
}

function VActivityCompact({ mobile, onSearch }) {
  const [dest, setDest] = React.useState('Lisbon, Portugal');
  const [date, setDate] = React.useState('2026-05-18');
  return (
    <VCShell onSearch={onSearch || (() => {})}>
      <Autocomplete size="sm" placeholder="Where" value={dest} onChange={setDest}
        data={PLACES.activities} leftSection={<Ic icon={I.pin} size={13} />}
        style={{ flex: '2 1 180px', minWidth: 140 }} />
      <TextInput size="sm" type="date" value={date} onChange={(e) => setDate(e.target.value)}
        leftSection={<Ic icon={I.cal} size={13} />}
        style={{ flex: '0 1 140px', minWidth: 120 }} />
    </VCShell>
  );
}

function VPackageCompact({ mobile, onSearch }) {
  const [from, setFrom] = React.useState('SFO');
  const [to, setTo]     = React.useState('Cancún');
  const [date, setDate] = React.useState('2026-07-10');
  return (
    <VCShell onSearch={onSearch || (() => {})}>
      <Autocomplete size="sm" placeholder="From" value={from} onChange={setFrom}
        data={PLACES.flights} leftSection={<Ic icon={I.plane} size={13} />}
        style={{ flex: '1 1 120px', minWidth: 90 }} />
      <Autocomplete size="sm" placeholder="Going to" value={to} onChange={setTo}
        data={PLACES.packages} leftSection={<Ic icon={I.pin} size={13} />}
        style={{ flex: '1 1 120px', minWidth: 90 }} />
      <TextInput size="sm" type="date" value={date} onChange={(e) => setDate(e.target.value)}
        leftSection={<Ic icon={I.cal} size={13} />}
        style={{ flex: '0 1 140px', minWidth: 120 }} />
    </VCShell>
  );
}

function VRentalCompact({ mobile, onSearch }) {
  const [where, setWhere] = React.useState('Maui, Hawaii');
  const [cin, setCin]     = React.useState('2026-08-02');
  const [cout, setCout]   = React.useState('2026-08-09');
  return (
    <VCShell onSearch={onSearch || (() => {})}>
      <Autocomplete size="sm" placeholder="Where to" value={where} onChange={setWhere}
        data={PLACES.rentals} leftSection={<Ic icon={I.pin} size={13} />}
        style={{ flex: '1 1 150px', minWidth: 120 }} />
      <TextInput size="sm" type="date" value={cin} onChange={(e) => setCin(e.target.value)}
        leftSection={<Ic icon={I.cal} size={13} />}
        style={{ flex: '0 1 140px', minWidth: 120 }} />
      <TextInput size="sm" type="date" value={cout} onChange={(e) => setCout(e.target.value)}
        leftSection={<Ic icon={I.cal} size={13} />}
        style={{ flex: '0 1 140px', minWidth: 120 }} />
    </VCShell>
  );
}

// ── Exports ───────────────────────────────────────────────────────────────
window.VanillaProductSearch = {
  hotels: VHotelSearch, flights: VFlightSearch, cars: VCarSearch,
  cruises: VCruiseSearch, tours: VTourSearch, activities: VActivitySearch,
  packages: VPackageSearch, rentals: VRentalSearch,
};

window.VanillaProductCompactSearch = {
  hotels: VHotelCompact, flights: VFlightCompact, cars: VCarCompact,
  cruises: VCruiseCompact, tours: VTourCompact, activities: VActivityCompact,
  packages: VPackageCompact, rentals: VRentalCompact,
};
})();
