// Shared destination/place dataset + typeahead UI.
// Categorized suggestions tagged by product applicability so each
// product surfaces the right kind of result.
(function () {
const { Stack, UnstyledButton, Text, Group, Box, Divider } = window.mantine;
const I = window.SearchIcons;

// type: city | airport | hotel | landmark | port | region | neighborhood | trail
// products: which products this entry is relevant for (used to filter).
const PLACES = [
  // ---- Cities (universal) ----
  { id: 'paris', type: 'city', name: 'Paris', sub: 'France', country: 'France', products: ['hotels', 'flights', 'tours', 'activities', 'packages', 'rentals', 'cars'] },
  { id: 'tokyo', type: 'city', name: 'Tokyo', sub: 'Japan', country: 'Japan', products: ['hotels', 'flights', 'tours', 'activities', 'packages', 'rentals', 'cars'] },
  { id: 'london', type: 'city', name: 'London', sub: 'United Kingdom', country: 'United Kingdom', products: ['hotels', 'flights', 'tours', 'activities', 'packages', 'rentals', 'cars'] },
  { id: 'nyc', type: 'city', name: 'New York', sub: 'New York, USA', country: 'United States', products: ['hotels', 'flights', 'tours', 'activities', 'packages', 'rentals', 'cars'] },
  { id: 'rome', type: 'city', name: 'Rome', sub: 'Italy', country: 'Italy', products: ['hotels', 'flights', 'tours', 'activities', 'packages', 'rentals', 'cars'] },
  { id: 'lisbon', type: 'city', name: 'Lisbon', sub: 'Portugal', country: 'Portugal', products: ['hotels', 'flights', 'tours', 'activities', 'packages', 'rentals', 'cars'] },
  { id: 'barcelona', type: 'city', name: 'Barcelona', sub: 'Spain', country: 'Spain', products: ['hotels', 'flights', 'tours', 'activities', 'packages', 'rentals', 'cars'] },
  { id: 'reykjavik', type: 'city', name: 'Reykjavík', sub: 'Iceland', country: 'Iceland', products: ['hotels', 'flights', 'tours', 'activities', 'packages', 'rentals', 'cars'] },
  { id: 'cdmx', type: 'city', name: 'Mexico City', sub: 'Mexico', country: 'Mexico', products: ['hotels', 'flights', 'tours', 'activities', 'packages', 'rentals', 'cars'] },
  { id: 'sf', type: 'city', name: 'San Francisco', sub: 'California, USA', country: 'United States', products: ['hotels', 'flights', 'tours', 'activities', 'packages', 'rentals', 'cars'] },
  { id: 'la', type: 'city', name: 'Los Angeles', sub: 'California, USA', country: 'United States', products: ['hotels', 'flights', 'tours', 'activities', 'packages', 'rentals', 'cars'] },
  { id: 'miami', type: 'city', name: 'Miami', sub: 'Florida, USA', country: 'United States', products: ['hotels', 'flights', 'tours', 'activities', 'packages', 'rentals', 'cars'] },
  { id: 'sandiego', type: 'city', name: 'San Diego', sub: 'California, USA', country: 'United States', products: ['hotels', 'flights', 'tours', 'activities', 'packages', 'rentals', 'cars'] },
  { id: 'banff', type: 'city', name: 'Banff', sub: 'Alberta, Canada', country: 'Canada', products: ['hotels', 'tours', 'activities', 'packages', 'rentals'] },
  { id: 'kyoto', type: 'city', name: 'Kyoto', sub: 'Japan', country: 'Japan', products: ['hotels', 'tours', 'activities', 'packages', 'rentals'] },

  // ---- Airports ----
  { id: 'sfo', type: 'airport', name: 'SFO — San Francisco Intl.', sub: 'San Francisco, California', code: 'SFO', products: ['flights', 'cars'] },
  { id: 'jfk', type: 'airport', name: 'JFK — John F. Kennedy Intl.', sub: 'New York, NY', code: 'JFK', products: ['flights', 'cars'] },
  { id: 'lax', type: 'airport', name: 'LAX — Los Angeles Intl.', sub: 'Los Angeles, California', code: 'LAX', products: ['flights', 'cars'] },
  { id: 'lhr', type: 'airport', name: 'LHR — London Heathrow', sub: 'London, UK', code: 'LHR', products: ['flights', 'cars'] },
  { id: 'cdg', type: 'airport', name: 'CDG — Paris Charles de Gaulle', sub: 'Paris, France', code: 'CDG', products: ['flights', 'cars'] },
  { id: 'nrt', type: 'airport', name: 'NRT — Tokyo Narita', sub: 'Tokyo, Japan', code: 'NRT', products: ['flights', 'cars'] },
  { id: 'mia', type: 'airport', name: 'MIA — Miami Intl.', sub: 'Miami, Florida', code: 'MIA', products: ['flights', 'cars'] },
  { id: 'ord', type: 'airport', name: 'ORD — Chicago O\u2019Hare', sub: 'Chicago, Illinois', code: 'ORD', products: ['flights', 'cars'] },
  { id: 'dfw', type: 'airport', name: 'DFW — Dallas/Fort Worth', sub: 'Dallas, Texas', code: 'DFW', products: ['flights', 'cars'] },
  { id: 'sea', type: 'airport', name: 'SEA — Seattle-Tacoma Intl.', sub: 'Seattle, Washington', code: 'SEA', products: ['flights', 'cars'] },

  // ---- Hotels (used for hotel typeahead) ----
  { id: 'h-ritz-paris', type: 'hotel', name: 'Hôtel de Crillon', sub: 'Place de la Concorde, Paris', products: ['hotels', 'packages'] },
  { id: 'h-park-hyatt', type: 'hotel', name: 'Park Hyatt Tokyo', sub: 'Shinjuku, Tokyo', products: ['hotels', 'packages'] },
  { id: 'h-savoy', type: 'hotel', name: 'The Savoy', sub: 'Strand, London', products: ['hotels', 'packages'] },

  // ---- Cruise ports ----
  { id: 'p-miami', type: 'port', name: 'PortMiami', sub: 'Miami, Florida', products: ['cruises'] },
  { id: 'p-barcelona', type: 'port', name: 'Port of Barcelona', sub: 'Barcelona, Spain', products: ['cruises'] },
  { id: 'p-southampton', type: 'port', name: 'Port of Southampton', sub: 'Southampton, UK', products: ['cruises'] },
  { id: 'p-civitavecchia', type: 'port', name: 'Civitavecchia', sub: 'Rome, Italy', products: ['cruises'] },
  { id: 'p-vancouver', type: 'port', name: 'Port of Vancouver', sub: 'British Columbia, Canada', products: ['cruises'] },

  // ---- Cruise regions ----
  { id: 'r-caribbean', type: 'region', name: 'Caribbean', sub: 'Cruise region', products: ['cruises'] },
  { id: 'r-med', type: 'region', name: 'Mediterranean', sub: 'Cruise region', products: ['cruises'] },
  { id: 'r-alaska', type: 'region', name: 'Alaska', sub: 'Cruise region', products: ['cruises'] },
  { id: 'r-norway', type: 'region', name: 'Norwegian Fjords', sub: 'Cruise region', products: ['cruises'] },

  // ---- Landmarks / activity hubs ----
  { id: 'l-eiffel', type: 'landmark', name: 'Eiffel Tower', sub: 'Paris, France', products: ['activities', 'tours'] },
  { id: 'l-colosseum', type: 'landmark', name: 'Colosseum', sub: 'Rome, Italy', products: ['activities', 'tours'] },
  { id: 'l-sagrada', type: 'landmark', name: 'Sagrada Família', sub: 'Barcelona, Spain', products: ['activities', 'tours'] },
  { id: 'l-machu', type: 'landmark', name: 'Machu Picchu', sub: 'Cusco region, Peru', products: ['activities', 'tours', 'packages'] },
  { id: 'l-grand-canyon', type: 'landmark', name: 'Grand Canyon National Park', sub: 'Arizona, USA', products: ['activities', 'tours', 'packages'] },

  // ---- Neighborhoods (vacation rentals) ----
  { id: 'n-marais', type: 'neighborhood', name: 'Le Marais', sub: 'Paris, France', products: ['rentals', 'hotels'] },
  { id: 'n-shibuya', type: 'neighborhood', name: 'Shibuya', sub: 'Tokyo, Japan', products: ['rentals', 'hotels'] },
  { id: 'n-soho-ny', type: 'neighborhood', name: 'SoHo', sub: 'Manhattan, NY', products: ['rentals', 'hotels'] },
  { id: 'n-mission', type: 'neighborhood', name: 'Mission District', sub: 'San Francisco, CA', products: ['rentals', 'hotels'] },
];

const TYPE_META = {
  city:         { label: 'City',         icon: I.pin },
  airport:      { label: 'Airport',      icon: I.plane },
  hotel:        { label: 'Hotel',        icon: I.home },
  port:         { label: 'Port',         icon: I.ship },
  region:       { label: 'Region',       icon: I.ship },
  landmark:     { label: 'Landmark',     icon: I.bolt },
  neighborhood: { label: 'Neighborhood', icon: I.home },
  trail:        { label: 'Trail',        icon: I.pin },
};

// Default category labels per product (used as section headers).
const PRODUCT_HEAD = {
  hotels:     [{ types: ['city', 'neighborhood'], label: 'Cities & neighborhoods' }, { types: ['hotel'], label: 'Hotels' }, { types: ['airport'], label: 'Near airports' }],
  flights:    [{ types: ['airport'], label: 'Airports' }, { types: ['city'], label: 'Cities' }],
  cars:       [{ types: ['airport'], label: 'Airport pickup' }, { types: ['city'], label: 'City pickup' }],
  cruises:    [{ types: ['region'], label: 'Cruise regions' }, { types: ['port'], label: 'Departure ports' }, { types: ['city'], label: 'Cities' }],
  tours:      [{ types: ['city'], label: 'Cities' }, { types: ['landmark'], label: 'Landmarks' }, { types: ['region'], label: 'Regions' }],
  activities: [{ types: ['landmark'], label: 'Top experiences' }, { types: ['city'], label: 'Cities' }],
  packages:   [{ types: ['city'], label: 'Cities' }, { types: ['landmark'], label: 'Landmarks' }, { types: ['region'], label: 'Regions' }],
  rentals:    [{ types: ['city'], label: 'Cities' }, { types: ['neighborhood'], label: 'Neighborhoods' }],
};

const RECENT = ['paris', 'sfo', 'r-med'];

function PlaceTypeahead({ value, onChange, onSelect, product = 'hotels', placeholder = 'Where to?', maxPerSection = 4, footer = null }) {
  const q = (value || '').trim().toLowerCase();
  const sections = (PRODUCT_HEAD[product] || PRODUCT_HEAD.hotels);
  const allowed = (p) => p.products.includes(product);
  const matches = (p) =>
    !q ||
    p.name.toLowerCase().includes(q) ||
    p.sub.toLowerCase().includes(q) ||
    (p.code || '').toLowerCase().includes(q);

  const recent = !q ? PLACES.filter((p) => allowed(p) && RECENT.includes(p.id)) : [];

  const grouped = sections
    .map(({ types, label }) => ({
      label,
      items: PLACES.filter((p) => allowed(p) && types.includes(p.type) && matches(p)).slice(0, maxPerSection),
    }))
    .filter((s) => s.items.length > 0);

  const empty = grouped.length === 0 && recent.length === 0;

  return (
    <Stack gap={4} style={{ minWidth: 320 }}>
      {recent.length > 0 && (
        <Section label="Recent searches" items={recent} onPick={(p) => { onChange(p.name); onSelect?.(p); }} />
      )}
      {grouped.map((sec) => (
        <Section key={sec.label} label={sec.label} items={sec.items} onPick={(p) => { onChange(p.name); onSelect?.(p); }} />
      ))}
      {empty && (
        <Box px="xs" py="md">
          <Text size="sm" c="dimmed">No matches for &ldquo;{value}&rdquo;.</Text>
          <Text size="xs" c="dimmed" mt={4}>Try a city, airport, or landmark.</Text>
        </Box>
      )}
      {footer}
    </Stack>
  );
}

function Section({ label, items, onPick }) {
  return (
    <Box>
      <Text size="xs" c="dimmed" px="xs" py={4} fw={700} style={{ letterSpacing: 0.4, textTransform: 'uppercase', fontSize: 10 }}>{label}</Text>
      {items.map((p) => {
        const meta = TYPE_META[p.type];
        return (
          <UnstyledButton
            key={p.id}
            onClick={() => onPick(p)}
            style={{ width: '100%', padding: '8px 10px', borderRadius: 8, display: 'flex', alignItems: 'center', gap: 12, textAlign: 'left' }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'var(--mantine-color-gray-1)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
          >
            <Box style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--mantine-color-gray-1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <span style={{ width: 16, height: 16, color: 'var(--mantine-color-gray-7)', display: 'inline-flex' }}>{meta.icon}</span>
            </Box>
            <Box style={{ minWidth: 0, flex: 1 }}>
              <Text size="sm" fw={600} truncate>{p.name}</Text>
              <Text size="xs" c="dimmed" truncate>{p.sub}</Text>
            </Box>
            <Text size="xs" c="dimmed" style={{ textTransform: 'uppercase', letterSpacing: 0.5, fontSize: 10, fontWeight: 600 }}>{meta.label}</Text>
          </UnstyledButton>
        );
      })}
    </Box>
  );
}

window.Places = PLACES;
window.PlaceTypeahead = PlaceTypeahead;
window.PRODUCT_HEAD = PRODUCT_HEAD;
window.TYPE_META = TYPE_META;
})();
