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

const BRAND_RAMP = ['#E6EFFB','#CCE0F7','#A8CBF3','#74ACE8','#3D89D9','#0064B1','#004E96','#1B3A8A','#152E74','#0F2460'];

const SEMANTIC_TOKENS = [
  { name: 'Page bg',        hex: '#fafaf7', usage: 'body — warm off-white' },
  { name: 'Hero light',     hex: '#E6EFFB', usage: 'brand[0] — search hero, selected tab' },
  { name: 'Hero dark',      hex: '#1B3A8A', usage: 'brand[7] — dark search bar mode' },
  { name: 'Active / link',  hex: '#0064B1', usage: 'brand[5] — nav active state, text links' },
  { name: 'Primary action', hex: '#1B3A8A', usage: 'brand[7] — filled button bg' },
  { name: 'Surface',        hex: '#ffffff', usage: 'cards, inputs, popover backgrounds' },
  { name: 'Border',         hex: '#dee2e6', usage: 'gray[3] — input & card borders' },
];

const TYPE_SCALE = [
  { label: 'h1 — Page headline',   size: 44, weight: 800, tracking: -1,    sample: 'Find a place to stay' },
  { label: 'h2 — Section heading', size: 28, weight: 700, tracking: -0.4,  sample: 'Where travelers go this week' },
  { label: 'h3 — Card / result',   size: 18, weight: 700, tracking: -0.2,  sample: 'Hôtel des Marais · Paris' },
  { label: 'body — Default',       size: 14, weight: 400, tracking: 0,     sample: '4th arrondissement · 0.4 km from center' },
  { label: 'label — Input / badge',size: 10, weight: 700, tracking: 0.4,   sample: 'WHERE TO  ·  TRAVELERS  ·  NONSTOP', upper: true },
];

const THEME_CODE =
`// theme.ts — drop into your Mantine 8 project
import { createTheme, rem } from '@mantine/core';

export const theme = createTheme({
  primaryColor: 'brand',
  primaryShade: { light: 7, dark: 5 },

  colors: {
    brand: [
      '#E6EFFB', // [0]  hero light bg, selected tab
      '#CCE0F7', // [1]
      '#A8CBF3', // [2]
      '#74ACE8', // [3]
      '#3D89D9', // [4]
      '#0064B1', // [5]  active nav, text links
      '#004E96', // [6]
      '#1B3A8A', // [7]  primary button, dark hero bg
      '#152E74', // [8]
      '#0F2460', // [9]
    ],
  },

  fontFamily:
    'Inter, system-ui, -apple-system, sans-serif',
  fontFamilyMonospace:
    'ui-monospace, Menlo, Monaco, monospace',

  headings: {
    fontFamily: 'Inter, system-ui, sans-serif',
    fontWeight: '700',
    sizes: {
      h1: { fontSize: rem(44), lineHeight: '1.05',
            fontWeight: '800' },
      h2: { fontSize: rem(28), lineHeight: '1.2',
            fontWeight: '700' },
      h3: { fontSize: rem(22), lineHeight: '1.3',
            fontWeight: '700' },
    },
  },

  defaultRadius: 'md',
  radius: {
    xs: rem(4),   sm: rem(6),
    md: rem(8),   lg: rem(12),   xl: rem(16),
  },

  shadows: {
    xs: '0 1px 3px rgba(0,0,0,0.05)',
    sm: '0 2px 8px rgba(0,0,0,0.06)',
    md: '0 4px 16px rgba(0,0,0,0.10)',
    lg: '0 8px 32px rgba(0,0,0,0.12)',
  },

  components: {
    Button: {
      defaultProps: { radius: 'md' },
      styles: { root: { fontWeight: '600' } },
    },
    TextInput: {
      styles: {
        label: {
          fontWeight: 600,
          fontSize: rem(10),
          textTransform: 'uppercase',
          letterSpacing: '0.04em',
          color: 'var(--mantine-color-gray-6)',
        },
        input: {
          height: rem(62),        // compact variant: rem(48)
          fontWeight: 600,
          borderRadius: rem(12),  // compact variant: rem(10)
          border: '1px solid var(--mantine-color-gray-3)',
        },
      },
    },
    Card: {
      defaultProps: { radius: 'md', withBorder: true },
    },
    Badge: {
      defaultProps: { radius: 'sm', variant: 'default' },
    },
  },
});`;

function ResultsPage({ product, mobile }) {
  return (
    <Box style={{ background: '#fafaf7' }}>
      {/* Page width spec */}
      <Box style={{ borderBottom: '1px solid var(--mantine-color-gray-2)', background: '#fff' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: mobile ? '20px 16px' : '28px 24px', position: 'relative' }}>
          <div style={{ position: 'absolute', top: 0, bottom: 0, left: 24, width: 1, background: 'rgba(220,38,38,0.2)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', top: 0, bottom: 0, right: 24, width: 1, background: 'rgba(220,38,38,0.2)', pointerEvents: 'none' }} />
          <Box style={{ border: '1.5px dashed rgba(220,38,38,0.35)', borderRadius: 10, padding: mobile ? '16px 14px' : '20px 24px', background: 'rgba(220,38,38,0.025)' }}>
            <Group justify="space-between" align="flex-start" wrap={mobile ? 'wrap' : 'nowrap'} gap={16}>
              <Stack gap={6}>
                <Group gap={8} align="center">
                  <Box style={{ width: 8, height: 8, borderRadius: '50%', background: 'rgb(220,38,38)', flexShrink: 0 }} />
                  <Text size="xs" fw={700} style={{ color: 'rgb(220,38,38)', textTransform: 'uppercase', letterSpacing: 0.8 }}>Layout spec — content width</Text>
                </Group>
                <Text fw={700} style={{ fontSize: mobile ? 16 : 20, letterSpacing: -0.3 }}>
                  Max-width: <span style={{ fontFamily: 'ui-monospace, monospace', color: 'rgb(220,38,38)' }}>1280px</span>
                </Text>
                <Text size="sm" c="dimmed" style={{ maxWidth: 520, lineHeight: 1.55 }}>
                  All content is constrained to <strong>1280px</strong>, centered with <code style={{ fontFamily: 'ui-monospace, monospace', fontSize: 11 }}>margin: 0 auto</code> and <code style={{ fontFamily: 'ui-monospace, monospace', fontSize: 11 }}>padding: 0 24px</code>. Background colors bleed to viewport edge.
                </Text>
              </Stack>
              <Stack gap={6} style={{ flexShrink: 0, minWidth: mobile ? '100%' : 190 }}>
                <SpecRow label="Max content width"   value="1280px" />
                <SpecRow label="H-padding desktop"   value="24px" />
                <SpecRow label="H-padding mobile"    value="16px" />
                <SpecRow label="Nav (compact strip)"  value="56px tall" />
                <SpecRow label="Search hero"          value="auto height" />
              </Stack>
            </Group>
          </Box>
        </div>
      </Box>

      {/* Theme doc */}
      <ThemeDoc mobile={mobile} />

      {/* Atoms doc */}
      <AtomsDoc mobile={mobile} />

      {/* Back link */}
      <Box style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px', borderTop: '1px solid var(--mantine-color-gray-2)' }}>
        <a
          href={`/landing/${product || 'hotels'}`}
          style={{ fontSize: 14, fontWeight: 600, color: 'var(--mantine-color-teal-7)', textDecoration: 'none' }}
          onMouseEnter={(e) => e.currentTarget.style.textDecoration = 'underline'}
          onMouseLeave={(e) => e.currentTarget.style.textDecoration = 'none'}
        >
          ← Back to landing page
        </a>
      </Box>
    </Box>
  );
}

function ThemeDoc({ mobile }) {
  const [copied, setCopied] = React.useState(false);
  const handleCopy = () => {
    navigator.clipboard?.writeText(THEME_CODE).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <Box style={{ background: '#fff', borderTop: '1px solid var(--mantine-color-gray-2)' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: mobile ? '32px 16px' : '56px 24px' }}>
        {/* Header */}
        <Stack gap={6} mb={mobile ? 28 : 44}>
          <Text size="xs" fw={700} tt="uppercase" c="dimmed" style={{ letterSpacing: 1 }}>Design system</Text>
          <Text fw={800} style={{ fontSize: mobile ? 22 : 30, letterSpacing: -0.5 }}>Mantine 8 theme override</Text>
          <Text size="sm" c="dimmed" style={{ maxWidth: 580, lineHeight: 1.65 }}>
            Apply these tokens once in <code style={{ fontFamily: 'ui-monospace, monospace', fontSize: 12, background: 'var(--mantine-color-gray-1)', padding: '1px 5px', borderRadius: 4 }}>theme.ts</code> — then use any Mantine component and the spacing, color, radius, and typography all follow automatically. No component prescriptions needed.
          </Text>
        </Stack>

        <div style={{ display: 'grid', gridTemplateColumns: mobile ? '1fr' : '1fr 1.05fr', gap: mobile ? 36 : 52, alignItems: 'start' }}>

          {/* LEFT: visual tokens */}
          <Stack gap={36}>

            {/* Brand palette */}
            <Stack gap={10}>
              <DocLabel>Brand color ramp — <span style={{ fontFamily: 'ui-monospace, monospace', fontWeight: 400 }}>colors.brand</span></DocLabel>
              <div style={{ display: 'flex', borderRadius: 10, overflow: 'hidden', border: '1px solid var(--mantine-color-gray-2)', height: 48 }}>
                {BRAND_RAMP.map((hex, i) => (
                  <div key={i} title={`brand[${i}]  ${hex}`}
                    style={{ flex: 1, background: hex, position: 'relative', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', paddingBottom: 4 }}>
                    <span style={{ fontSize: 8, fontWeight: 700, fontFamily: 'ui-monospace, monospace',
                      color: i < 4 ? 'rgba(0,0,0,0.4)' : 'rgba(255,255,255,0.6)' }}>[{i}]</span>
                  </div>
                ))}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px 16px' }}>
                {[
                  { i: 0, note: 'Hero light / tab bg' },
                  { i: 5, note: 'Active nav / links' },
                  { i: 7, note: 'Primary button / dark hero' },
                  { i: 9, note: 'Deepest navy' },
                ].map(({ i, note }) => (
                  <Group key={i} gap={8} wrap="nowrap" align="center">
                    <div style={{ width: 18, height: 18, borderRadius: 4, flexShrink: 0, background: BRAND_RAMP[i],
                      border: i === 0 ? '1px solid var(--mantine-color-gray-3)' : 'none' }} />
                    <Box>
                      <Text size="xs" fw={700} style={{ fontFamily: 'ui-monospace, monospace', lineHeight: 1.2 }}>brand[{i}]</Text>
                      <Text style={{ fontSize: 10, color: 'var(--mantine-color-gray-5)', lineHeight: 1.2 }}>{note}</Text>
                    </Box>
                  </Group>
                ))}
              </div>
            </Stack>

            {/* Semantic tokens */}
            <Stack gap={10}>
              <DocLabel>Semantic tokens</DocLabel>
              <Stack gap={4}>
                {SEMANTIC_TOKENS.map(({ name, hex, usage }) => (
                  <Group key={name} gap={10} wrap="nowrap"
                    style={{ padding: '7px 10px', borderRadius: 8, background: 'var(--mantine-color-gray-0)', border: '1px solid var(--mantine-color-gray-1)' }}>
                    <div style={{ width: 22, height: 22, borderRadius: 5, flexShrink: 0, background: hex,
                      border: '1px solid var(--mantine-color-gray-2)' }} />
                    <Box style={{ flex: 1, minWidth: 0 }}>
                      <Group gap={8} wrap="nowrap">
                        <Text size="xs" fw={600}>{name}</Text>
                        <Text size="xs" style={{ fontFamily: 'ui-monospace, monospace', color: 'var(--mantine-color-gray-5)' }}>{hex}</Text>
                      </Group>
                      <Text style={{ fontSize: 10, color: 'var(--mantine-color-gray-5)' }} truncate>{usage}</Text>
                    </Box>
                  </Group>
                ))}
              </Stack>
            </Stack>

            {/* Type scale */}
            <Stack gap={10}>
              <DocLabel>Type scale — Inter</DocLabel>
              <Stack gap={6}>
                {TYPE_SCALE.map(({ label, size, weight, tracking, sample, upper }) => (
                  <Box key={label} style={{ padding: '10px 14px', borderRadius: 8, border: '1px solid var(--mantine-color-gray-2)', background: '#fafaf7' }}>
                    <div style={{ fontSize: Math.min(size, mobile ? 20 : 36), fontWeight: weight,
                      letterSpacing: tracking, textTransform: upper ? 'uppercase' : 'none',
                      lineHeight: 1.15, marginBottom: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {sample}
                    </div>
                    <Text style={{ fontSize: 10, fontFamily: 'ui-monospace, monospace', color: 'var(--mantine-color-gray-5)' }}>
                      {label} &nbsp;·&nbsp; {size}px &nbsp;·&nbsp; w{weight} &nbsp;·&nbsp; ls {tracking}px{upper ? ' · uppercase' : ''}
                    </Text>
                  </Box>
                ))}
              </Stack>
            </Stack>

          </Stack>

          {/* RIGHT: code block */}
          <Stack gap={8} style={{ position: mobile ? 'static' : 'sticky', top: 80 }}>
            <Group justify="space-between" align="center">
              <DocLabel>theme.ts</DocLabel>
              <button onClick={handleCopy} style={{
                fontSize: 12, fontWeight: 600, cursor: 'pointer',
                border: '1px solid var(--mantine-color-gray-3)', borderRadius: 6,
                padding: '4px 12px', background: copied ? '#E6EFFB' : '#fff',
                color: copied ? '#0064B1' : 'var(--mantine-color-gray-7)',
                transition: 'all 140ms'
              }}>
                {copied ? '✓ Copied' : 'Copy'}
              </button>
            </Group>
            <pre style={{
              margin: 0, padding: mobile ? '16px 14px' : '22px 24px',
              background: '#0f1117', color: '#cbd5e1',
              borderRadius: 12, fontSize: 11.5, lineHeight: 1.75,
              overflowX: 'auto', fontFamily: 'ui-monospace, Menlo, Monaco, monospace',
              whiteSpace: 'pre', border: '1px solid rgba(255,255,255,0.06)',
            }}>{THEME_CODE}</pre>
          </Stack>

        </div>
      </div>
    </Box>
  );
}

function DocLabel({ children }) {
  return (
    <Text size="xs" fw={700} tt="uppercase" style={{ letterSpacing: 0.8, color: 'var(--mantine-color-gray-5)' }}>
      {children}
    </Text>
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

// ─── Atom doc components ────────────────────────────────────────────────────

function AtomsDoc({ mobile }) {
  const I = window.SearchIcons || {};

  const ATOMS = [
    {
      name: 'Place / Typeahead',
      desc: 'Mantine Combobox with grouped results: cities, airports, hotels, landmarks, neighborhoods. Each group labelled separately.',
      preview: <FieldPreview icon={I.pin} label="WHERE" value="Paris, France" />,
      compactPreview: <FieldPreview icon={I.pin} label="WHERE" value="Paris, France" compact />,
      rows: [
        ['component',         'Combobox + useCombobox hook'],
        ['dropdown width',    '380px fixed (not target-width)'],
        ['max results/group', '5'],
        ['group header',      '10px · 700 · uppercase · gray[5]'],
        ['option row height', '48px'],
        ['option icon bg',    'gray[1] · 30×30px · radius 8px'],
        ['option icon',       '14px · gray[6]'],
        ['option name',       '14px · 600 · gray[9]'],
        ['option sub-text',   '12px · gray[5]'],
        ['option type badge', '10px · 600 · uppercase · gray[5]'],
      ],
    },
    {
      name: 'Date range picker',
      desc: 'Two-month inline calendar inside a Popover. Click start date → click end date. Hover shows range preview in real time.',
      preview: <FieldPreview icon={I.cal} label="WHEN" value="Dec 10 — Dec 17" />,
      compactPreview: <FieldPreview icon={I.cal} label="WHEN" value="Dec 10 — Dec 17" compact />,
      rows: [
        ['component',          'Custom RangeCalendar in Popover'],
        ['dropdown width',     '540px'],
        ['months shown',       '2 side-by-side'],
        ['day cell size',      '36×36px'],
        ['selected range bg',  'brand[0] = #E6EFFB'],
        ['start / end dot',    'brand[7] filled circle, 36px'],
        ['hover preview',      'brand[0] bg on hovered range'],
        ['month nav buttons',  'ActionIcon subtle, gray[6]'],
        ['weekday label',      '11px · 600 · uppercase · gray[5]'],
      ],
    },
    {
      name: 'Car pickup — date & time',
      desc: 'Calendar for date + separate time select with 15-minute increments. Two independent fields: pickup and drop-off.',
      preview: <FieldPreview icon={I.cal} label="PICKUP" value="Dec 10 · 10:00 AM" />,
      compactPreview: <FieldPreview icon={I.cal} label="PICKUP" value="Dec 10 · 10:00 AM" compact />,
      rows: [
        ['component',        'CarDateTimeField (custom)'],
        ['dropdown width',   '560px'],
        ['time increments',  '15 min (96 options / day)'],
        ['time select h',    '48px · Mantine Select'],
        ['section divider',  '1px solid gray[2]'],
        ['section label',    '11px · 700 · uppercase · gray[5]'],
      ],
    },
    {
      name: 'Travelers / Passengers',
      desc: 'FieldShell trigger opens a Popover with ± steppers per category. Trigger shows a formatted summary string.',
      preview: <FieldPreview icon={I.user} label="TRAVELERS" value="2 adults · 0 children · 1 room" />,
      compactPreview: <FieldPreview icon={I.user} label="TRAVELERS" value="2 adults · 1 room" compact />,
      rows: [
        ['component',              'Custom popover with steppers'],
        ['stepper size',           '32×32px · radius md'],
        ['stepper variant',        'outline · brand[5] border + icon'],
        ['stepper icon size',      '14px'],
        ['count value',            '14px · 700 · gray[9]'],
        ['category label',         '13px · 500 · gray[8]'],
        ['category sub-label',     '11px · gray[5]  e.g. "Age 0–12"'],
        ['separator line',         '1px solid gray[1]'],
      ],
    },
    {
      name: 'Trip type — button select',
      desc: 'Mutually-exclusive option toggle. Compact-only: never 62px. Renders as Mantine Select or ButtonGroup depending on options count.',
      preview: <FieldPreview icon={I.swap} label="TRIP TYPE" value="Round trip" />,
      compactPreview: <FieldPreview icon={I.swap} label="TRIP TYPE" value="Round trip" compact />,
      rows: [
        ['component',    'Mantine Select (compact, always 48px)'],
        ['height',       'rem(48) — compact only, no hero variant'],
        ['icon',         'SearchIcons.swap · 18px · gray[6]'],
        ['value size',   'rem(13)'],
        ['value weight', '600'],
      ],
    },
    {
      name: 'Search CTA',
      desc: 'Primary submit action. Always the rightmost element. Matches surrounding field height. Never icon-only.',
      preview: (
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, height: 62, padding: '0 28px',
          background: '#1B3A8A', borderRadius: 12, color: '#fff', cursor: 'pointer' }}>
          <span style={{ display: 'inline-flex', width: 16, height: 16 }}>{I.search}</span>
          <span style={{ fontSize: 15, fontWeight: 700 }}>Search</span>
        </div>
      ),
      compactPreview: (
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, height: 48, padding: '0 22px',
          background: '#1B3A8A', borderRadius: 10, color: '#fff', cursor: 'pointer' }}>
          <span style={{ display: 'inline-flex', width: 14, height: 14 }}>{I.search}</span>
          <span style={{ fontSize: 13, fontWeight: 700 }}>Search</span>
        </div>
      ),
      rows: [
        ['component',     'Mantine Button, variant filled'],
        ['bg',            'brand[7] = #1B3A8A'],
        ['hover bg',      'brand[8] = #152E74'],
        ['height',        'rem(62) hero / rem(48) compact'],
        ['border-radius', 'rem(12) hero / rem(10) compact'],
        ['padding',       '0 rem(28) hero / 0 rem(22) compact'],
        ['icon',          'SearchIcons.search · 16px · #fff · left'],
        ['label',         '"Search" · rem(15) · 700 · #fff'],
      ],
    },
    {
      name: 'Stepper ± button',
      desc: 'Icon-only increment / decrement. Used inside Travelers and Benefits popovers. Disables at min/max bounds.',
      preview: (
        <Group gap={16} align="center" style={{ padding: '6px 0' }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, border: '1px solid #0064B1', display: 'flex',
            alignItems: 'center', justifyContent: 'center', color: '#0064B1', fontSize: 18, fontWeight: 300, cursor: 'pointer' }}>−</div>
          <Text fw={700} style={{ fontSize: 16, minWidth: 24, textAlign: 'center' }}>2</Text>
          <div style={{ width: 32, height: 32, borderRadius: 8, border: '1px solid #0064B1', display: 'flex',
            alignItems: 'center', justifyContent: 'center', color: '#0064B1', fontSize: 18, fontWeight: 300, cursor: 'pointer' }}>+</div>
        </Group>
      ),
      rows: [
        ['component',        'Mantine ActionIcon, variant outline'],
        ['size',             '32×32px'],
        ['border-radius',    'radius md = rem(8)'],
        ['border-color',     'brand[5] = #0064B1'],
        ['icon color',       'brand[5]'],
        ['icon size',        'rem(14)'],
        ['disabled opacity', '0.35'],
        ['count font',       'rem(14–16) · 700 · gray[9]'],
      ],
    },
    {
      name: 'Sort / filter pill',
      desc: 'Small toggle button for sort order and filter presets. Default = ghost (gray border). Active = filled brand.',
      preview: (
        <Group gap={8} style={{ padding: '4px 0' }}>
          {[['Recommended', true], ['Price: Low', false], ['Rating', false]].map(([label, active]) => (
            <div key={label} style={{ height: 28, padding: '0 12px', borderRadius: 8, display: 'flex', alignItems: 'center',
              background: active ? '#1B3A8A' : '#fff', border: active ? 'none' : '1px solid var(--mantine-color-gray-3)',
              color: active ? '#fff' : 'var(--mantine-color-gray-7)', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
              {label}
            </div>
          ))}
        </Group>
      ),
      rows: [
        ['component',     'Mantine Button, size xs'],
        ['height',        'rem(28)'],
        ['padding',       '0 rem(12)'],
        ['border-radius', 'radius md = rem(8)'],
        ['inactive',      '#fff · 1px solid gray[3] · gray[7] text'],
        ['active',        'brand[7] filled · #fff text'],
        ['font-size',     'rem(12)'],
        ['font-weight',   '600'],
      ],
    },
  ];

  return (
    <Box style={{ background: '#fafaf7', borderTop: '1px solid var(--mantine-color-gray-2)' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: mobile ? '32px 16px' : '56px 24px' }}>

        <Stack gap={6} mb={mobile ? 28 : 44}>
          <Text size="xs" fw={700} tt="uppercase" c="dimmed" style={{ letterSpacing: 1 }}>Atomic design</Text>
          <Text fw={800} style={{ fontSize: mobile ? 22 : 30, letterSpacing: -0.5 }}>Atoms — inputs &amp; controls</Text>
          <Text size="sm" c="dimmed" style={{ maxWidth: 560, lineHeight: 1.65 }}>
            Every search input is built from one shared shell. The token tables below specify exactly how each atom variant looks — map them to any Mantine component.
          </Text>
        </Stack>

        {/* Field shell anatomy — applies to all inputs */}
        <Box mb={mobile ? 36 : 48}>
          <DocLabel>Field shell — shared anatomy</DocLabel>
          <Box mt={12} style={{ display: 'grid', gridTemplateColumns: mobile ? '1fr' : '1fr 1fr', gap: 12, marginBottom: 16 }}>
            <Stack gap={6}>
              <Text size="xs" fw={600} c="dimmed">Hero — 62px (landing search bar)</Text>
              <FieldPreview icon={I.pin} label="WHERE" value="Paris, France" />
            </Stack>
            <Stack gap={6}>
              <Text size="xs" fw={600} c="dimmed">Compact — 48px (results strip)</Text>
              <FieldPreview icon={I.pin} label="WHERE" value="Paris, France" compact />
            </Stack>
          </Box>
          <div style={{ display: 'grid', gridTemplateColumns: mobile ? '1fr 1fr' : 'repeat(4,1fr)', gap: 10 }}>
            <ShellTokenCard title="Shell" rows={[
              ['height',        '62px  /  48px'],
              ['border-radius', 'rem(12)  /  rem(10)'],
              ['padding',       '0 rem(16)  /  rem(8) rem(14)'],
              ['background',    '#fff'],
              ['border',        '1px solid gray[3]'],
              ['border (compact inactive)', 'transparent'],
            ]} />
            <ShellTokenCard title="Focus state" rows={[
              ['border-color', 'brand[5] = #0064B1'],
              ['box-shadow',   'brand[5] at 22% opacity, spread 3px'],
              ['transition',   'border-color 120ms, box-shadow 120ms'],
            ]} />
            <ShellTokenCard title="Label (top)" rows={[
              ['font-size',       'rem(10)  /  rem(9)'],
              ['font-weight',     '600'],
              ['text-transform',  'uppercase'],
              ['letter-spacing',  '0.04em'],
              ['color',           'gray[6]'],
              ['line-height',     '1'],
            ]} />
            <ShellTokenCard title="Icon + value text" rows={[
              ['icon size',        '18×18px  /  16×16px'],
              ['icon color',       'gray[6]'],
              ['value font-size',  'rem(14)  /  rem(12)'],
              ['value weight',     '600'],
              ['value color',      'gray[9] (filled)'],
              ['placeholder',      'gray[5]'],
            ]} />
          </div>
        </Box>

        {/* Per-atom catalog */}
        <Box>
          <DocLabel>Input &amp; control catalog</DocLabel>
          <div style={{ display: 'grid', gridTemplateColumns: mobile ? '1fr' : '1fr 1fr', gap: 14, marginTop: 12 }}>
            {ATOMS.map((a) => (
              <AtomCard key={a.name} atom={a} mobile={mobile} />
            ))}
          </div>
        </Box>

      </div>
    </Box>
  );
}

function FieldPreview({ icon, label, value, compact = false }) {
  const h = compact ? 48 : 62;
  const r = compact ? 10 : 12;
  const p = compact ? '8px 14px' : '0 16px';
  const gap = compact ? 10 : 12;
  const is = compact ? 16 : 18;
  const lfs = compact ? 9 : 10;
  const vfs = compact ? 12 : 14;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap, padding: p, height: h, background: '#fff',
      border: compact ? '1px solid transparent' : '1px solid var(--mantine-color-gray-3)', borderRadius: r }}>
      {icon && <span style={{ display: 'inline-flex', color: 'var(--mantine-color-gray-6)', width: is, height: is, flexShrink: 0 }}>{icon}</span>}
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0 }}>
        <span style={{ fontSize: lfs, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em',
          color: 'var(--mantine-color-gray-6)', lineHeight: 1 }}>{label}</span>
        <span style={{ fontSize: vfs, fontWeight: 600, color: 'var(--mantine-color-gray-9)', marginTop: 2,
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{value}</span>
      </div>
    </div>
  );
}

function AtomCard({ atom, mobile }) {
  const { name, desc, preview, compactPreview, rows } = atom;
  return (
    <Box style={{ background: '#fff', border: '1px solid var(--mantine-color-gray-2)', borderRadius: 12, overflow: 'hidden' }}>
      {/* Preview row: hero + compact */}
      <Box style={{ padding: '14px 16px', borderBottom: '1px solid var(--mantine-color-gray-1)', background: '#fafaf7' }}>
        <div style={{ display: 'grid', gridTemplateColumns: compactPreview ? '1fr 1fr' : '1fr', gap: 10 }}>
          <Stack gap={4}>
            {compactPreview && <Text style={{ fontSize: 9, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5, color: 'var(--mantine-color-gray-4)' }}>Hero</Text>}
            {preview}
          </Stack>
          {compactPreview && (
            <Stack gap={4}>
              <Text style={{ fontSize: 9, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5, color: 'var(--mantine-color-gray-4)' }}>Compact</Text>
              {compactPreview}
            </Stack>
          )}
        </div>
      </Box>
      {/* Spec */}
      <Box style={{ padding: '12px 16px' }}>
        <Text fw={700} size="sm" mb={3}>{name}</Text>
        <Text size="xs" c="dimmed" mb={10} style={{ lineHeight: 1.5 }}>{desc}</Text>
        <div style={{ borderTop: '1px solid var(--mantine-color-gray-1)', paddingTop: 8 }}>
          {rows.map(([prop, val]) => (
            <div key={prop} style={{ display: 'flex', justifyContent: 'space-between', gap: 8, padding: '2px 0' }}>
              <span style={{ fontSize: 11, color: 'var(--mantine-color-gray-5)', flexShrink: 0 }}>{prop}</span>
              <span style={{ fontSize: 11, fontFamily: 'ui-monospace, monospace', color: 'var(--mantine-color-gray-8)', textAlign: 'right' }}>{val}</span>
            </div>
          ))}
        </div>
      </Box>
    </Box>
  );
}

function ShellTokenCard({ title, rows }) {
  return (
    <Box style={{ background: '#fff', border: '1px solid var(--mantine-color-gray-2)', borderRadius: 8, padding: '10px 12px' }}>
      <Text size="xs" fw={700} mb={8} style={{ color: 'var(--mantine-color-gray-7)' }}>{title}</Text>
      <Stack gap={5}>
        {rows.map(([prop, val]) => (
          <Box key={prop}>
            <Text style={{ fontSize: 9, textTransform: 'uppercase', letterSpacing: 0.3, color: 'var(--mantine-color-gray-4)', fontWeight: 600, lineHeight: 1 }}>{prop}</Text>
            <Text style={{ fontSize: 11, fontFamily: 'ui-monospace, monospace', color: 'var(--mantine-color-gray-8)', lineHeight: 1.4 }}>{val}</Text>
          </Box>
        ))}
      </Stack>
    </Box>
  );
}

window.ResultsPage = ResultsPage;
})();
