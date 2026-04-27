// Mock results pages — one for each product. Same shell: filters rail (left) + cards grid.
(function() {
const { Container, Stack, Group, Text, Badge, Box, Button, ActionIcon, Divider, Slider, Checkbox } = window.mantine;

function FiltersRail({ mobile, sections }) {
  if (mobile) return null;
  return (
    <Box style={{ width: 260, flexShrink: 0 }}>
      <Stack gap="lg">
        <Group justify="space-between">
          <Text fw={700} size="sm">Filters</Text>
          <Text size="xs" c="dimmed" style={{ cursor: 'pointer' }}>Clear all</Text>
        </Group>
        {sections.map((sec) => (
          <Box key={sec.title}>
            <Text size="xs" fw={700} tt="uppercase" c="dimmed" mb={10} style={{ letterSpacing: 0.6 }}>{sec.title}</Text>
            {sec.kind === 'price' && (
              <Stack gap={6}>
                <Slider color="teal" defaultValue={420} min={50} max={1200} marks={[{value:50,label:'$50'},{value:1200,label:'$1.2k'}]} />
                <Group justify="space-between"><Text size="xs" c="dimmed">$50</Text><Text size="xs" c="dimmed">$1,200</Text></Group>
              </Stack>
            )}
            {sec.kind === 'checks' && (
              <Stack gap={8}>
                {sec.options.map((o) => (
                  <Checkbox key={o.label} label={<Group gap={6}><span>{o.label}</span><Text size="xs" c="dimmed">({o.count})</Text></Group>} color="teal" defaultChecked={o.on} size="xs" />
                ))}
              </Stack>
            )}
          </Box>
        ))}
      </Stack>
    </Box>
  );
}

function PlaceholderImage({ hue, label, h = 180 }) {
  return (
    <div style={{
      height: h,
      backgroundImage: `repeating-linear-gradient(135deg, oklch(0.85 0.06 ${hue}) 0 12px, oklch(0.78 0.07 ${hue}) 12px 24px)`,
      position: 'relative', display: 'flex', alignItems: 'flex-end', padding: 10,
    }}>
      <span style={{ fontFamily: 'ui-monospace, Menlo, monospace', fontSize: 10, background: 'rgba(255,255,255,0.85)', padding: '2px 6px', borderRadius: 4, color: '#444' }}>
        {label}
      </span>
    </div>
  );
}

function ResultCard({ image, title, subtitle, badges = [], rating, reviews, price, priceUnit, ctaLabel = 'View', mobile }) {
  return (
    <Box style={{
      borderRadius: 14, background: '#fff', border: '1px solid var(--mantine-color-gray-2)',
      overflow: 'hidden', display: 'flex', flexDirection: mobile ? 'column' : 'row',
    }}>
      <Box style={{ width: mobile ? '100%' : 240, flexShrink: 0 }}>{image}</Box>
      <Box style={{ flex: 1, padding: 16, display: 'flex', flexDirection: 'column', gap: 6 }}>
        <Group justify="space-between" wrap="nowrap" align="flex-start">
          <Box>
            <Text fw={700} size={mobile ? 'sm' : 'md'} style={{ letterSpacing: -0.2 }}>{title}</Text>
            <Text size="xs" c="dimmed" mt={2}>{subtitle}</Text>
          </Box>
          {rating && (
            <Group gap={4} wrap="nowrap">
              <Badge variant="light" color="teal" size="md" style={{ fontVariantNumeric: 'tabular-nums' }}>{rating}</Badge>
              <Text size="xs" c="dimmed">({reviews})</Text>
            </Group>
          )}
        </Group>
        <Group gap={6} mt={4}>
          {badges.map((b) => (
            <Badge key={b} variant="default" size="sm" radius="sm" style={{ textTransform: 'none', fontWeight: 500 }}>{b}</Badge>
          ))}
        </Group>
        <Box style={{ flex: 1 }} />
        <Group justify="space-between" align="flex-end" wrap="nowrap" mt={4}>
          <Box>
            <Text size="lg" fw={800} style={{ letterSpacing: -0.5 }}>${price}</Text>
            <Text size="xs" c="dimmed">{priceUnit}</Text>
          </Box>
          <Button color="teal" size="sm" radius="md">{ctaLabel}</Button>
        </Group>
      </Box>
    </Box>
  );
}

function SortHeader({ count, sort, onSort, label }) {
  const opts = [
    { value: 'recommended', label: 'Recommended' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'rating', label: 'Rating' },
  ];
  return (
    <Group justify="space-between" align="flex-end" wrap="wrap">
      <Box>
        <Text size="xs" c="dimmed" tt="uppercase" fw={700} style={{ letterSpacing: 0.6 }}>{count} {label}</Text>
        <Text component="h1" style={{ fontSize: 22, fontWeight: 700, margin: '4px 0 0', letterSpacing: -0.3 }}>Results</Text>
      </Box>
      <Group gap={8}>
        {opts.map((o) => (
          <Button key={o.value} variant={sort === o.value ? 'filled' : 'default'} color="teal" size="xs" radius="md" onClick={() => onSort(o.value)}>{o.label}</Button>
        ))}
      </Group>
    </Group>
  );
}

const FILTER_SETS = {
  hotels: [
    { title: 'Price per night', kind: 'price' },
    { title: 'Star rating', kind: 'checks', options: [{label:'5 stars', count: 12, on: true}, {label:'4 stars', count: 47}, {label:'3 stars', count: 91}] },
    { title: 'Amenities', kind: 'checks', options: [{label:'Pool', count: 38}, {label:'Free Wi-Fi', count: 142, on: true}, {label:'Breakfast', count: 56}, {label:'Pet-friendly', count: 21}] },
  ],
  flights: [
    { title: 'Total price', kind: 'price' },
    { title: 'Stops', kind: 'checks', options: [{label:'Nonstop', count: 24, on: true}, {label:'1 stop', count: 88}, {label:'2+ stops', count: 41}] },
    { title: 'Airlines', kind: 'checks', options: [{label:'United', count: 22}, {label:'Delta', count: 31, on: true}, {label:'JAL', count: 18}, {label:'ANA', count: 14}] },
  ],
  cars: [
    { title: 'Total price', kind: 'price' },
    { title: 'Car type', kind: 'checks', options: [{label:'Economy', count: 14, on: true}, {label:'SUV', count: 22}, {label:'Convertible', count: 6}, {label:'Electric', count: 9}] },
    { title: 'Supplier', kind: 'checks', options: [{label:'Hertz', count: 11}, {label:'Avis', count: 9}, {label:'Sixt', count: 7}] },
  ],
  cruises: [
    { title: 'Price per person', kind: 'price' },
    { title: 'Cruise line', kind: 'checks', options: [{label:'Royal Caribbean', count: 18, on: true}, {label:'Norwegian', count: 12}, {label:'Celebrity', count: 9}] },
    { title: 'Ports', kind: 'checks', options: [{label:'Miami', count: 22}, {label:'Galveston', count: 8}, {label:'San Juan', count: 6}] },
  ],
  tours: [
    { title: 'Trip price', kind: 'price' },
    { title: 'Style', kind: 'checks', options: [{label:'Small group', count: 32, on: true}, {label:'Private', count: 18}, {label:'Self-guided', count: 9}] },
    { title: 'Operator', kind: 'checks', options: [{label:'Intrepid', count: 12}, {label:'G Adventures', count: 14}, {label:'Trafalgar', count: 7}] },
  ],
  activities: [
    { title: 'Price per person', kind: 'price' },
    { title: 'Category', kind: 'checks', options: [{label:'Tours', count: 64, on: true}, {label:'Food & drink', count: 41}, {label:'Outdoor', count: 33}, {label:'Workshops', count: 12}] },
    { title: 'Duration', kind: 'checks', options: [{label:'Up to 1 hour', count: 22}, {label:'1–4 hours', count: 88}, {label:'Full day', count: 31}] },
  ],
  packages: [
    { title: 'Total price', kind: 'price' },
    { title: 'Includes', kind: 'checks', options: [{label:'Flight + Hotel', count: 28, on: true}, {label:'+ Car', count: 12}, {label:'+ Activity', count: 8}] },
    { title: 'Resort type', kind: 'checks', options: [{label:'All-inclusive', count: 19}, {label:'Adults-only', count: 7}, {label:'Family-friendly', count: 14}] },
  ],
  rentals: [
    { title: 'Price per night', kind: 'price' },
    { title: 'Property type', kind: 'checks', options: [{label:'House', count: 88, on: true}, {label:'Apartment', count: 124}, {label:'Villa', count: 22}, {label:'Cabin', count: 14}] },
    { title: 'Bedrooms', kind: 'checks', options: [{label:'1+', count: 220}, {label:'2+', count: 178, on: true}, {label:'3+', count: 91}] },
  ],
};

const CARD_SETS = {
  hotels: [
    { title: 'Hôtel des Marais', subtitle: '4th arrondissement · 0.4 km from city center', badges: ['Free Wi-Fi','Breakfast included'], rating: 9.2, reviews: '1,840 reviews', price: 312, priceUnit: 'per night · taxes incl.', hue: 30 },
    { title: 'Le Grand Boulevard', subtitle: '9th arrondissement · 1.2 km from city center', badges: ['Pool','Spa','Pet-friendly'], rating: 9.0, reviews: '982 reviews', price: 268, priceUnit: 'per night · taxes incl.', hue: 80 },
    { title: 'Maison Latin', subtitle: '5th arrondissement · 0.8 km from city center', badges: ['Free Wi-Fi'], rating: 8.8, reviews: '2,310 reviews', price: 189, priceUnit: 'per night · taxes incl.', hue: 160 },
    { title: 'Hotel Trocadéro', subtitle: '16th arrondissement · 2.4 km from city center', badges: ['View of Eiffel'], rating: 9.4, reviews: '1,022 reviews', price: 482, priceUnit: 'per night · taxes incl.', hue: 220 },
  ],
  flights: [
    { title: 'United · 11h 30m · Nonstop', subtitle: 'SFO 10:35 AM → NRT 2:05 PM (next day)', badges: ['Carry-on included','In-flight Wi-Fi'], rating: 8.4, reviews: 'On-time 88%', price: 942, priceUnit: 'round-trip · per traveler', hue: 200, ctaLabel: 'Select' },
    { title: 'JAL · 10h 55m · Nonstop', subtitle: 'SFO 11:20 AM → NRT 2:15 PM (next day)', badges: ['Premium meals'], rating: 9.1, reviews: 'On-time 94%', price: 1088, priceUnit: 'round-trip · per traveler', hue: 0, ctaLabel: 'Select' },
    { title: 'Delta · 14h 10m · 1 stop SEA', subtitle: 'SFO 6:00 AM → NRT 1:10 PM (next day)', badges: ['Refundable'], rating: 8.6, reviews: 'On-time 86%', price: 814, priceUnit: 'round-trip · per traveler', hue: 120, ctaLabel: 'Select' },
  ],
  cars: [
    { title: 'Toyota Corolla or similar', subtitle: 'Economy · Auto · 4 seats · A/C · Hertz', badges: ['Free cancellation','Unlimited miles'], rating: 8.6, reviews: '1,210 reviews', price: 38, priceUnit: 'per day · all-in', hue: 180 },
    { title: 'Tesla Model 3', subtitle: 'Electric · Auto · 5 seats · Sixt', badges: ['EV','Free supercharging'], rating: 9.2, reviews: '420 reviews', price: 92, priceUnit: 'per day · all-in', hue: 250 },
    { title: 'Jeep Wrangler 4-door', subtitle: 'SUV · Auto · 5 seats · Avis', badges: ['Convertible top'], rating: 8.9, reviews: '612 reviews', price: 78, priceUnit: 'per day · all-in', hue: 50 },
  ],
  cruises: [
    { title: 'Western Caribbean · 7 nights', subtitle: 'Royal Caribbean · Wonder of the Seas · from Miami', badges: ['Drinks pkg available','3 ports'], rating: 8.9, reviews: '4,210 reviews', price: 689, priceUnit: 'per person · interior', hue: 200 },
    { title: 'Bahamas Escape · 4 nights', subtitle: 'Norwegian · Joy · from Port Canaveral', badges: ['Last-minute deal'], rating: 8.4, reviews: '2,118 reviews', price: 412, priceUnit: 'per person · interior', hue: 160 },
    { title: 'Eastern Caribbean · 9 nights', subtitle: 'Celebrity · Apex · from Fort Lauderdale', badges: ['Premium dining'], rating: 9.2, reviews: '922 reviews', price: 1340, priceUnit: 'per person · oceanview', hue: 230 },
  ],
  tours: [
    { title: 'Highlights of Italy', subtitle: '12 days · Rome → Florence → Venice → Lake Como', badges: ['Small group','English'], rating: 9.1, reviews: '1,432 reviews', price: 2890, priceUnit: 'per person · land only', hue: 30 },
    { title: 'Sicily by Train', subtitle: '8 days · Palermo → Agrigento → Taormina', badges: ['Self-guided'], rating: 8.9, reviews: '288 reviews', price: 1640, priceUnit: 'per person · land only', hue: 80 },
    { title: 'Northern Italy Lakes', subtitle: '7 days · Milan → Como → Verona → Venice', badges: ['Private driver'], rating: 9.4, reviews: '202 reviews', price: 4100, priceUnit: 'per person · land only', hue: 130 },
  ],
  activities: [
    { title: 'Lisbon: Tuk-tuk City Highlights', subtitle: '3 hours · Local guide · 6 stops', badges: ['Skip the line'], rating: 9.3, reviews: '4,820 reviews', price: 49, priceUnit: 'per person', hue: 30, ctaLabel: 'Book' },
    { title: 'Sintra Day Trip from Lisbon', subtitle: '8 hours · Includes Pena Palace', badges: ['Bestseller'], rating: 9.1, reviews: '2,290 reviews', price: 78, priceUnit: 'per person', hue: 100, ctaLabel: 'Book' },
    { title: 'Fado Dinner Experience', subtitle: '2.5 hours · 3-course meal · Live music', badges: ['Adults only'], rating: 9.5, reviews: '1,108 reviews', price: 92, priceUnit: 'per person', hue: 320, ctaLabel: 'Book' },
  ],
  packages: [
    { title: '7 nights · Cancún + Flight from SFO', subtitle: 'Hyatt Ziva All-Inclusive · Direct flight', badges: ['All-inclusive','Bundle save 28%'], rating: 9.0, reviews: '880 reviews', price: 1840, priceUnit: 'per person · taxes incl.', hue: 200 },
    { title: '5 nights · Tulum + Flight from SFO', subtitle: 'Conrad Tulum · 1-stop flight', badges: ['Adults-only'], rating: 9.4, reviews: '410 reviews', price: 2120, priceUnit: 'per person · taxes incl.', hue: 160 },
    { title: '6 nights · Riviera Maya + Flight + Car', subtitle: 'Iberostar Selection · Compact rental car included', badges: ['Bundle save 22%'], rating: 8.8, reviews: '512 reviews', price: 1560, priceUnit: 'per person · taxes incl.', hue: 130 },
  ],
  rentals: [
    { title: 'Oceanfront Villa with Pool', subtitle: 'Wailea, Maui · 4 BR · 8 guests', badges: ['Self check-in','Pool','Beach'], rating: 9.6, reviews: '184 reviews', price: 642, priceUnit: 'per night · 7-night min', hue: 200 },
    { title: 'Modern Cabin in Upcountry', subtitle: 'Kula, Maui · 3 BR · 6 guests', badges: ['Hot tub','Mountain view'], rating: 9.4, reviews: '92 reviews', price: 388, priceUnit: 'per night', hue: 140 },
    { title: 'Beachfront Condo', subtitle: 'Ka\u02bbanapali, Maui · 2 BR · 4 guests', badges: ['Pool','Pet-friendly'], rating: 9.0, reviews: '328 reviews', price: 312, priceUnit: 'per night', hue: 60 },
  ],
};

const PRODUCT_LABELS = {
  hotels: 'hotels in Paris', flights: 'flights SFO → NRT', cars: 'cars in Los Angeles',
  cruises: 'Caribbean cruises', tours: 'tours in Italy', activities: 'experiences in Lisbon',
  packages: 'packages to Mexico', rentals: 'rentals in Maui',
};

function ResultsPage({ product, mobile }) {
  return (
    <Box style={{ background: '#fafaf7', minHeight: '40vh' }}>
      {/* Max-width annotation for implementers */}
      <Box style={{ borderBottom: '1px solid var(--mantine-color-gray-2)', background: '#fff' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: mobile ? '20px 16px' : '28px 24px', position: 'relative' }}>
          {/* Red rule lines showing the 1280px boundary */}
          <div style={{ position: 'absolute', top: 0, bottom: 0, left: 24, width: 1, background: 'rgba(220,38,38,0.25)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', top: 0, bottom: 0, right: 24, width: 1, background: 'rgba(220,38,38,0.25)', pointerEvents: 'none' }} />

          <Box style={{ border: '1.5px dashed rgba(220,38,38,0.4)', borderRadius: 10, padding: mobile ? '16px 14px' : '20px 24px', background: 'rgba(220,38,38,0.03)' }}>
            <Group justify="space-between" align="flex-start" wrap={mobile ? 'wrap' : 'nowrap'} gap={16}>
              <Stack gap={6}>
                <Group gap={8} align="center">
                  <Box style={{ width: 10, height: 10, borderRadius: '50%', background: 'rgb(220,38,38)', flexShrink: 0 }} />
                  <Text size="xs" fw={700} style={{ color: 'rgb(220,38,38)', textTransform: 'uppercase', letterSpacing: 0.8 }}>
                    Layout spec — page content width
                  </Text>
                </Group>
                <Text fw={700} style={{ fontSize: mobile ? 18 : 22, letterSpacing: -0.4 }}>
                  Max content width: <span style={{ fontFamily: 'ui-monospace, monospace', color: 'rgb(220,38,38)' }}>1280px</span>
                </Text>
                <Text size="sm" c="dimmed" style={{ maxWidth: 520, lineHeight: 1.55 }}>
                  All page content — nav, search strip, and results body — is constrained to a <strong>1280px</strong> max-width container, centered with <span style={{ fontFamily: 'ui-monospace, monospace', fontSize: 12 }}>margin: 0 auto</span> and <span style={{ fontFamily: 'ui-monospace, monospace', fontSize: 12 }}>padding: 0 24px</span>. The full-width background colors still bleed to the viewport edge.
                </Text>
              </Stack>

              <Stack gap={8} style={{ flexShrink: 0, minWidth: mobile ? '100%' : 200 }}>
                <SpecRow label="Max content width" value="1280px" />
                <SpecRow label="Horizontal padding" value="24px (desktop)" />
                <SpecRow label="Horizontal padding" value="16px (mobile)" />
                <SpecRow label="Nav height" value="56px (compact strip)" />
                <SpecRow label="Hero height" value="auto / 56px min" />
              </Stack>
            </Group>
          </Box>
        </div>
      </Box>

      {/* Back link */}
      <Box style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 24px' }}>
        <a
          href={`/landing/${product || 'hotels'}`}
          style={{ fontSize: 15, fontWeight: 600, color: 'var(--mantine-color-teal-7)', textDecoration: 'none' }}
          onMouseEnter={(e) => e.currentTarget.style.textDecoration = 'underline'}
          onMouseLeave={(e) => e.currentTarget.style.textDecoration = 'none'}
        >
          ← Back to landing page
        </a>
      </Box>
    </Box>
  );
}

function SpecRow({ label, value }) {
  return (
    <Group justify="space-between" gap={12} wrap="nowrap">
      <Text size="xs" c="dimmed" style={{ whiteSpace: 'nowrap' }}>{label}</Text>
      <Text size="xs" fw={700} style={{ fontFamily: 'ui-monospace, monospace', color: 'var(--mantine-color-gray-8)', whiteSpace: 'nowrap' }}>{value}</Text>
    </Group>
  );
}

window.ResultsPage = ResultsPage;
})();
