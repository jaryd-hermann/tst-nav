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

const BRAND_RAMP = ['#E8EEFF','#D0DBFF','#B3C2FF','#8EA3F5','#6080F0','#4263EB','#2E50D4','#1B3A8A','#152E74','#0F2460'];

const SEMANTIC_TOKENS = [
  { name: 'Page bg',        hex: '#fafaf7', usage: 'body — warm off-white' },
  { name: 'Hero light',     hex: '#E8EEFF', usage: 'brand[0] — search hero, selected tab' },
  { name: 'Search CTA',     hex: '#4263EB', usage: 'brand[5] — search button, primary action' },
  { name: 'Hero dark',      hex: '#1B3A8A', usage: 'brand[7] — dark search bar mode' },
  { name: 'Active / link',  hex: '#2E50D4', usage: 'brand[6] — nav active state, text links' },
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
import { createTheme, rem, Button, TextInput, Card, Badge } from '@mantine/core';

// ── Named semantic constants — use these in your components ──────────────
const _heroDark = '#1B3A8A';

export const colors = {
  pageBg:  '#fafaf7', // body warm off-white
  surface: '#ffffff', // cards, inputs, popovers
  border:  '#dee2e6', // gray[3] — input & card borders

  brand: {
    heroLight: '#E8EEFF', // [0] search hero bg, selected tab
    tint1:     '#D0DBFF', // [1]
    tint2:     '#B3C2FF', // [2]
    tint3:     '#8EA3F5', // [3]
    mid:       '#6080F0', // [4]
    cta:       '#4263EB', // [5] search CTA / primary button ← key shade
    link:      '#2E50D4', // [6] nav active state, text links
    heroDark:  _heroDark, // [7] dark search bar mode
    darker:    '#152E74', // [8]
    darkest:   '#0F2460', // [9]
  },
} as const;

// ── Mantine palette array (required by createTheme) ───────────────────────
const brandPalette = [
  colors.brand.heroLight, colors.brand.tint1,
  colors.brand.tint2,     colors.brand.tint3,
  colors.brand.mid,       colors.brand.cta,
  colors.brand.link,      colors.brand.heroDark,
  colors.brand.darker,    colors.brand.darkest,
] as const;

export const theme = createTheme({
  primaryColor: 'brand',
  primaryShade: { light: 5, dark: 4 }, // → colors.brand.cta (#4263EB)

  colors: { brand: brandPalette },

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
    Button: Button.extend({
      defaultProps: { radius: 'md' },
      styles: { root: { fontWeight: '600' } },
    }),
    TextInput: TextInput.extend({
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
    }),
    Card: Card.extend({
      defaultProps: { radius: 'md', withBorder: true },
    }),
    Badge: Badge.extend({
      defaultProps: { radius: 'sm', variant: 'default' },
    }),
  },
});`;

function ResultsPage({ product, mobile, uiMode }) {
  const isVanilla = uiMode === 'vanilla';
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

      {/* Design system docs — switch between custom and vanilla */}
      {isVanilla ? (
        <VanillaMantineDoc mobile={mobile} />
      ) : (
        <>
          <ThemeDoc mobile={mobile} />
          <AtomsDoc mobile={mobile} />
        </>
      )}

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

              {/* Ramp strip */}
              <div style={{ position: 'relative' }}>
                <div style={{ display: 'flex', borderRadius: 10, overflow: 'hidden', border: '1px solid var(--mantine-color-gray-2)', height: 48 }}>
                  {BRAND_RAMP.map((hex, i) => (
                    <div key={i} title={`brand[${i}]  ${hex}`}
                      style={{ flex: 1, background: hex, position: 'relative', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', paddingBottom: 4,
                        outline: i === 5 ? '2.5px solid #fff' : 'none', outlineOffset: -2.5 }}>
                      <span style={{ fontSize: 8, fontWeight: 700, fontFamily: 'ui-monospace, monospace',
                        color: i < 4 ? 'rgba(0,0,0,0.4)' : 'rgba(255,255,255,0.7)' }}>[{i}]</span>
                    </div>
                  ))}
                </div>
                {/* CTA pointer */}
                <div style={{ position: 'absolute', top: '100%', left: `${5 * 10 + 5}%`, transform: 'translateX(-50%)', marginTop: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1, pointerEvents: 'none' }}>
                  <div style={{ width: 0, height: 0, borderLeft: '5px solid transparent', borderRight: '5px solid transparent', borderBottom: '5px solid #4263EB' }} />
                  <span style={{ fontSize: 9, fontWeight: 700, fontFamily: 'ui-monospace, monospace', color: '#4263EB', letterSpacing: 0.3, whiteSpace: 'nowrap' }}>CTA</span>
                </div>
              </div>

              {/* CTA featured swatch */}
              <Box style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', borderRadius: 8,
                background: '#4263EB', marginTop: 18 }}>
                <div style={{ width: 36, height: 36, borderRadius: 8, background: '#fff', flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ width: 22, height: 22, borderRadius: 5, background: '#4263EB' }} />
                </div>
                <Box>
                  <Text size="xs" fw={800} style={{ color: '#fff', fontFamily: 'ui-monospace, monospace', letterSpacing: 0.2 }}>colors.brand.cta · #4263EB</Text>
                  <Text style={{ fontSize: 10, color: 'rgba(255,255,255,0.75)', lineHeight: 1.4 }}>Search CTA · primary button · brand[5] · primaryShade light:5</Text>
                </Box>
              </Box>

              {/* Other callout swatches */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px 16px' }}>
                {[
                  { i: 0, note: 'Hero light / tab bg' },
                  { i: 6, note: 'Active nav / links' },
                  { i: 7, note: 'Dark hero bg' },
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
      desc: 'Mantine Combobox with grouped results: cities, airports, hotels, landmarks, neighborhoods. Width fixed at 380px regardless of trigger width.',
      preview: <FieldPreview icon={I.pin} label="WHERE" value="Paris, France" />,
      rows: [
        ['component',         'Combobox + useCombobox hook'],
        ['dropdown width',    '380px fixed (Combobox width prop)'],
        ['max results/group', '5'],
        ['group header',      '10px · 700 · uppercase · gray[5]'],
        ['option height',     '~48px (8px padding × 2 + content)'],
        ['option icon box',   '30×30px · radius 8px · gray[1]'],
        ['option icon',       '14×14px · gray[6]'],
        ['option name',       'size sm · fw 600 · gray[9] · truncate'],
        ['option sub-text',   'size xs · dimmed · truncate'],
        ['type badge',        '10px · fw 600 · uppercase · ls 0.5 · gray[5]'],
      ],
    },
    {
      name: 'Date range picker',
      desc: 'Two-month inline calendar inside Popover. Click start → click end. Hover previews the range. Trigger uses the same CompactField shell.',
      preview: <FieldPreview icon={I.cal} label="WHEN" value="Dec 10 — Dec 17" />,
      rows: [
        ['component',       'Custom RangeCalendar in Popover'],
        ['dropdown width',  '540px'],
        ['dropdown p',      'p="md" = 16px'],
        ['months shown',    '2 × RangeCalendar (width 244px each)'],
        ['day cell h',      '32px'],
        ['day dot',         '28×28px · radius xl (circle)'],
        ['dot — selected',  'teal[7] bg · #fff text · fw 600'],
        ['dot — in-range',  'teal[0] bg fill · #1a1a1a text'],
        ['range fill h',    'inset: 4px 0 (24px strip)'],
        ['dot — default',   'transparent · #1a1a1a text'],
        ['dot — disabled',  'transparent · #cbcfd4 text'],
        ['weekday label',   '11px · 600 · #9aa1a8'],
        ['month nav',       'ActionIcon variant subtle · color gray · size sm'],
        ['footer Clear',    'Button size xs · variant subtle'],
        ['footer Done',     'Button size xs · color teal'],
      ],
    },
    {
      name: 'Car pickup — date & time',
      desc: 'Calendar date + time select (15-min increments). Two independent triggers: pickup and drop-off.',
      preview: <FieldPreview icon={I.cal} label="PICKUP" value="Dec 10 · 10:00 AM" />,
      rows: [
        ['component',       'CarDateTimeField (custom)'],
        ['dropdown width',  '560px'],
        ['dropdown p',      'p="md" = 16px'],
        ['time increments', '15 min (96 options / day)'],
        ['time select h',   '48px compact field'],
        ['section label',   '11px · 700 · uppercase · gray[5]'],
        ['section divider', '1px solid gray[2]'],
        ['footer Done',     'Button size xs · color teal'],
      ],
    },
    {
      name: 'Travelers / Passengers',
      desc: 'CompactField trigger opens a 260px Popover with ± steppers per category. Trigger value is a formatted summary string.',
      preview: <FieldPreview icon={I.user} label="TRAVELERS" value="2 adults · 0 children · 1 room" />,
      rows: [
        ['component',          'Custom Popover with ActionIcon steppers'],
        ['dropdown width',     '260px'],
        ['dropdown p',         'p="md" = 16px'],
        ['row layout',         'Group justify="space-between"'],
        ['category label',     'size sm · fw 600'],
        ['stepper',            'ActionIcon · variant default · size md · radius xl'],
        ['count',              'Text size sm · fw 600 · w={20} · centered'],
        ['footer Done',        'Button size xs · color teal · justify flex-end'],
      ],
    },
    {
      name: 'Trip type select',
      desc: 'Compact-only field. Mutually exclusive options (Round trip / One way / Multi-city). Always 48px.',
      preview: <FieldPreview icon={I.swap} label="TRIP TYPE" value="Round trip" />,
      rows: [
        ['component',    'Mantine Select (compact, always 48px)'],
        ['height',       'rem(48) — no hero variant'],
        ['icon',         'SearchIcons.swap · 18px · gray[6]'],
        ['value size',   'rem(13) · fw 600'],
      ],
    },
    {
      name: 'Standard select field',
      desc: 'Generic list-selection trigger using the same CompactField shell. Used for Trip type, Cabin class, Car type, sort order, and any single-choice list.',
      preview: <FieldPreview icon={I.swap} label="CABIN CLASS" value="Economy" />,
      rows: [
        ['component',     'CompactField (same shell as all inputs)'],
        ['icon',          'context-specific icon from SearchIcons'],
        ['value display', 'selected option label · fw 600'],
        ['placeholder',   '"Select" · gray[5]'],
        ['opened border', 'teal[7] + 22% glow (shared focus tokens)'],
        ['dropdown',      'Popover.Dropdown · see molecule below'],
      ],
    },
    {
      name: 'Search CTA',
      desc: 'Primary submit. Rightmost element in every form. color="teal" resolves to brand via CSS var alias. Never icon-only.',
      preview: (
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, height: 48,
          padding: '0 18px', background: 'var(--mantine-color-teal-7)',
          borderRadius: 10, color: '#fff', cursor: 'pointer' }}>
          <span style={{ display: 'inline-flex', width: 16, height: 16 }}>{I.search}</span>
          <span style={{ fontSize: 14, fontWeight: 600 }}>Search</span>
        </div>
      ),
      rows: [
        ['component',      'Mantine Button · variant filled'],
        ['color',          'teal (→ brand via CSS var alias)'],
        ['hero h',         '62px · borderRadius rem(12) · px rem(22)'],
        ['compact h',      '48px · borderRadius rem(10) · px rem(18)'],
        ['hero minWidth',  '130px'],
        ['compact minWidth','110px'],
        ['icon',           'SearchIcons.search · 18px hero / 16px compact · #fff'],
        ['label',          '"Search" · fw 600 · #fff'],
      ],
    },
    {
      name: 'Stepper ± button',
      desc: 'Used inside Travelers and Benefits popovers. Fully round — ActionIcon with radius xl. Disables at min/max.',
      preview: (
        <Group gap={16} align="center" style={{ padding: '4px 0' }}>
          <ActionIcon variant="default" size="md" radius="xl" style={{ pointerEvents: 'none' }}>−</ActionIcon>
          <Text fw={600} size="sm" style={{ width: 20, textAlign: 'center' }}>2</Text>
          <ActionIcon variant="default" size="md" radius="xl" style={{ pointerEvents: 'none' }}>+</ActionIcon>
        </Group>
      ),
      rows: [
        ['component',        'Mantine ActionIcon'],
        ['variant',          'default (gray bg + gray border)'],
        ['size',             'md = 36×36px'],
        ['radius',           'xl = fully round (circle)'],
        ['icon',             '− or + text, inherits text color'],
        ['disabled opacity', '0.35 (at min / max)'],
        ['count display',    'Text · size sm · fw 600 · w={20} · centered'],
      ],
    },
    {
      name: 'Mobile search summary pill',
      desc: 'On mobile, the compact search strip collapses to a single full-width tappable card showing the current search state.',
      preview: (
        <div style={{ width: '100%', background: '#fff', borderRadius: 12, padding: '14px 16px',
          display: 'flex', alignItems: 'center', gap: 14,
          boxShadow: '0 4px 16px rgba(0,0,0,0.18)' }}>
          <span style={{ display: 'inline-flex', width: 22, height: 22,
            color: 'var(--mantine-color-gray-7)', flexShrink: 0 }}>{I.search}</span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: 700, fontSize: 15, color: '#1a1a17',
              lineHeight: 1.2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              Paris, France
            </div>
            <div style={{ fontSize: 13, color: 'var(--mantine-color-gray-6)',
              marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              May 12 – May 19 · 1 room, 2 adults
            </div>
          </div>
        </div>
      ),
      rows: [
        ['component',   'UnstyledButton (full-width tappable)'],
        ['width',       '100%'],
        ['background',  '#fff'],
        ['padding',     'rem(14) rem(16)'],
        ['border-radius','rem(12)'],
        ['box-shadow',  '0 4px 16px rgba(0,0,0,0.18)'],
        ['icon',        'SearchIcons.search · 22×22px · gray[7] · flex-shrink 0'],
        ['main text',   'fw 700 · size md (~16px) · #1a1a17 · lineHeight 1.2'],
        ['sub text',    'size sm (~14px) · dimmed · marginTop 2px'],
        ['tap action',  'opens full search sheet / expands fields'],
      ],
    },
  ];

  const MOLECULES = [
    {
      name: 'Date picker — 2-month (desktop)',
      desc: 'Two RangeCalendar grids side-by-side in a 540px Popover. Standard layout for desktop hero and compact forms.',
      wide: true,
      preview: <DualCalendarMoleculePreview />,
      rows: [
        ['dropdown',      'Popover.Dropdown · shadow md · width 540 · p="md"'],
        ['layout',        '2 × RangeCalendar in a flex row · gap 16px'],
        ['each grid',     '244px wide · 7-col grid · cell height 32px'],
        ['day dot',       '28×28px · radius xl · centered'],
        ['range fill',    'absolute · teal[0] · inset 4px 0'],
        ['fill — start',  'right half only (left: 50%)'],
        ['fill — end',    'left half only (right: 50%)'],
        ['selected dot',  'teal[7] bg · #fff · fw 600'],
        ['in-range dot',  'transparent · #1a1a1a'],
        ['disabled',      'transparent · #cbcfd4'],
        ['weekday',       '11px · 600 · #9aa1a8'],
        ['month header',  'size sm · fw 600'],
        ['nav arrows',    'ActionIcon · variant subtle · gray · size sm'],
        ['Clear / Done',  'Button size xs · subtle / teal'],
      ],
    },
    {
      name: 'Date picker — 1-month (mobile/narrow)',
      desc: 'Single RangeCalendar in a ~280px Popover. Used when viewport is too narrow for the 2-month layout.',
      preview: <SingleCalendarMoleculePreview />,
      rows: [
        ['dropdown',      'Popover.Dropdown · shadow md · width ~280 · p="md"'],
        ['layout',        '1 × RangeCalendar'],
        ['grid',          '244px wide · same day states as 2-month'],
        ['nav arrows',    'prev/next month — user navigates to see second month'],
        ['day dot',       '28×28px · radius xl · same states'],
        ['Clear / Done',  'Button size xs · subtle / teal'],
      ],
    },
    {
      name: 'Standard select — dropdown',
      desc: 'Flat option list in a Popover. Selected item uses teal[0] bg + teal[8] text. Hover uses gray[1]. No icons.',
      preview: <SelectDropdownMoleculePreview />,
      rows: [
        ['container',      'Popover.Dropdown · p={6} · minWidth 200 · shadow md'],
        ['option stack',   'Stack gap={2}'],
        ['option',         'UnstyledButton · padding 8px 10px · borderRadius 8px'],
        ['default',        'transparent bg · inherit color · fw 500'],
        ['selected bg',    'teal[0]'],
        ['selected text',  'teal[8] · fw 700'],
        ['hover bg',       'gray[1]'],
        ['font size',      '14px'],
      ],
    },
    {
      name: 'Travelers — popover',
      desc: 'Category rows stacked in a 260px popover. Each row: label left, stepper group right.',
      preview: <TravelersMoleculePreview />,
      rows: [
        ['container',      'Popover.Dropdown · width 260 · p="md"'],
        ['row',            'Group justify="space-between" wrap="nowrap"'],
        ['stack gap',      'Stack gap="sm" = 12px between rows'],
        ['label',          'Text · size sm · fw 600'],
        ['stepper group',  'Group gap={6} wrap="nowrap"'],
        ['− / + buttons',  'ActionIcon · variant default · size md · radius xl'],
        ['count',          'Text · size sm · fw 600 · w={20} · ta="center"'],
        ['Done footer',    'Group justify="flex-end" · Button size xs · color teal'],
      ],
    },
    {
      name: 'Place typeahead — results dropdown',
      desc: 'Combobox dropdown with Combobox.Group sections. Each option: icon box + name + sub-text + type badge.',
      preview: <TypeaheadMoleculePreview />,
      rows: [
        ['container',    'Combobox.Dropdown · width 380 fixed · via Combobox width prop'],
        ['scroll',       'Combobox.Options mah={320} overflowY auto'],
        ['group header', 'Combobox.Group label — Mantine default style'],
        ['option pad',   '8px 10px'],
        ['icon box',     '30×30px · radius 8px · gray[1] bg · flex-shrink 0'],
        ['icon',         '14×14px · gray[6]'],
        ['name',         'size sm · fw 600 · truncate'],
        ['sub-text',     'size xs · dimmed · truncate'],
        ['type badge',   '10px · fw 600 · uppercase · ls 0.5 · gray[5]'],
        ['empty state',  'Combobox.Empty — "No results for …"'],
        ['blur guard',   'Combobox.Dropdown onMouseDown preventDefault (prevents blur race)'],
      ],
    },
  ];

  return (
    <Box style={{ background: '#fafaf7', borderTop: '1px solid var(--mantine-color-gray-2)' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: mobile ? '32px 16px' : '56px 24px' }}>

        <Stack gap={6} mb={mobile ? 28 : 44}>
          <Text size="xs" fw={700} tt="uppercase" c="dimmed" style={{ letterSpacing: 1 }}>Atomic design</Text>
          <Text fw={800} style={{ fontSize: mobile ? 22 : 30, letterSpacing: -0.5 }}>Atoms &amp; molecules</Text>
          <Text size="sm" c="dimmed" style={{ maxWidth: 560, lineHeight: 1.65 }}>
            Every input shares a common compact shell. Below: the shared shell tokens, each input atom (compact only — all forms use this size), then the molecule specs for each dropdown/popover.
          </Text>
        </Stack>

        {/* Field shell anatomy — hero vs compact */}
        <Box mb={mobile ? 36 : 48}>
          <DocLabel>Field shell — shared anatomy</DocLabel>
          <Box mt={12} mb={16}>
            <FieldPreview icon={I.pin} label="WHERE" value="Paris, France" />
          </Box>
          <div style={{ display: 'grid', gridTemplateColumns: mobile ? '1fr 1fr' : 'repeat(4,1fr)', gap: 10 }}>
            <ShellTokenCard title="Shell" rows={[
              ['height',        '62px hero / 48px compact'],
              ['border-radius', 'rem(12) hero / rem(10) compact'],
              ['padding',       '0 rem(16) / rem(8) rem(14)'],
              ['background',    '#fff'],
              ['border',        '1px solid gray[3]'],
              ['border compact', 'transparent (inactive)'],
            ]} />
            <ShellTokenCard title="Focus state" rows={[
              ['border-color', 'teal[7] → brand via alias'],
              ['box-shadow',   'teal[7] @ 22% · spread 3px'],
              ['transition',   'border + shadow 120ms'],
            ]} />
            <ShellTokenCard title="Label (top)" rows={[
              ['font-size',       'rem(10) hero / rem(9) compact'],
              ['font-weight',     '600'],
              ['text-transform',  'uppercase'],
              ['letter-spacing',  '0.04em'],
              ['color',           'gray[6]'],
            ]} />
            <ShellTokenCard title="Icon + value" rows={[
              ['icon size',    '18×18px hero / 16×16px compact'],
              ['icon color',   'gray[6]'],
              ['value size',   'rem(14) / rem(12)'],
              ['value weight', '600'],
              ['filled color', 'gray[9]'],
              ['placeholder',  'gray[5]'],
            ]} />
          </div>
        </Box>

        {/* Atoms */}
        <Box mb={mobile ? 36 : 52}>
          <DocLabel>Input &amp; control atoms — compact</DocLabel>
          <div style={{ display: 'grid', gridTemplateColumns: mobile ? '1fr' : '1fr 1fr', gap: 14, marginTop: 12 }}>
            {ATOMS.map((a) => <AtomCard key={a.name} atom={a} />)}
          </div>
        </Box>

        {/* Molecules */}
        <Box>
          <DocLabel>Molecules — dropdown &amp; popover contents</DocLabel>
          <div style={{ display: 'grid', gridTemplateColumns: mobile ? '1fr' : '1fr 1fr', gap: 14, marginTop: 12 }}>
            {MOLECULES.map((m) => (
              <div key={m.name} style={m.wide && !mobile ? { gridColumn: '1 / -1' } : undefined}>
                <AtomCard atom={m} />
              </div>
            ))}
          </div>
        </Box>

      </div>
    </Box>
  );
}

// ── Field preview (renders exact shell HTML) ──────────────────────────────
function FieldPreview({ icon, label, value, hero = false }) {
  const h  = hero ? 62 : 48;
  const r  = hero ? 12 : 10;
  const p  = hero ? '0 16px' : '8px 14px';
  const g  = hero ? 12 : 10;
  const is = hero ? 18 : 16;
  const lfs = hero ? 10 : 9;
  const vfs = hero ? 14 : 12;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: g, padding: p, height: h,
      background: '#fff', border: hero ? '1px solid var(--mantine-color-gray-3)' : '1px solid transparent',
      borderRadius: r }}>
      {icon && <span style={{ display: 'inline-flex', color: 'var(--mantine-color-gray-6)',
        width: is, height: is, flexShrink: 0 }}>{icon}</span>}
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0 }}>
        <span style={{ fontSize: lfs, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em',
          color: 'var(--mantine-color-gray-6)', lineHeight: 1 }}>{label}</span>
        <span style={{ fontSize: vfs, fontWeight: 600, color: 'var(--mantine-color-gray-9)',
          marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{value}</span>
      </div>
    </div>
  );
}

// ── Molecule previews ─────────────────────────────────────────────────────

// May 2026 starts Friday (offset 5), June 2026 starts Monday (offset 1)
const MAY_CELLS = [null,null,null,null,null, ...Array.from({length:31},(_,i)=>i+1)];
const JUN_CELLS = [null, ...Array.from({length:30},(_,i)=>i+1)];

function CalendarMonthGrid({ cells, monthLabel, start = null, end = null }) {
  return (
    <Box style={{ flex: '0 0 auto' }}>
      <Group justify="space-between" mb={6} gap={4}>
        <ActionIcon variant="subtle" color="gray" size="sm" style={{ pointerEvents: 'none' }}>‹</ActionIcon>
        <Text size="xs" fw={600}>{monthLabel}</Text>
        <ActionIcon variant="subtle" color="gray" size="sm" style={{ pointerEvents: 'none' }}>›</ActionIcon>
      </Group>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 1 }}>
        {['Su','Mo','Tu','We','Th','Fr','Sa'].map((d,i) => (
          <div key={i} style={{ textAlign:'center', color:'#9aa1a8', fontSize:9, fontWeight:600, padding:'1px 0' }}>{d}</div>
        ))}
        {cells.slice(0,35).map((d,i) => {
          const isSt = start && d === start;
          const isEn = end && d === end;
          const inR  = start && end && d !== null && d > start && d < end;
          const isEP = isSt || isEn;
          return (
            <div key={i} style={{ position:'relative', height:26, display:'flex', alignItems:'center', justifyContent:'center' }}>
              {inR  && <span style={{ position:'absolute', inset:'2px 0', background:'var(--mantine-color-teal-0)', zIndex:0 }} />}
              {isSt && <span style={{ position:'absolute', top:2, bottom:2, right:0, left:'50%', background:'var(--mantine-color-teal-0)', zIndex:0 }} />}
              {isEn && <span style={{ position:'absolute', top:2, bottom:2, left:0, right:'50%', background:'var(--mantine-color-teal-0)', zIndex:0 }} />}
              {d !== null && (
                <span style={{ position:'relative', zIndex:1, width:22, height:22, borderRadius:'50%',
                  display:'flex', alignItems:'center', justifyContent:'center', fontSize:10,
                  background: isEP ? 'var(--mantine-color-teal-7)' : 'transparent',
                  color: isEP ? '#fff' : '#1a1a1a', fontWeight: isEP ? 600 : 400 }}>{d}</span>
              )}
            </div>
          );
        })}
      </div>
    </Box>
  );
}

function DualCalendarMoleculePreview() {
  return (
    <Box style={{ background:'#fff', borderRadius:10, border:'1px solid var(--mantine-color-gray-2)', padding:'14px 20px' }}>
      <div style={{ display:'flex', gap:32, justifyContent:'center', flexWrap:'nowrap', overflowX:'auto' }}>
        <CalendarMonthGrid cells={MAY_CELLS} monthLabel="May 2026" start={10} end={17} />
        <div style={{ width:1, background:'var(--mantine-color-gray-2)', flexShrink:0, alignSelf:'stretch' }} />
        <CalendarMonthGrid cells={JUN_CELLS} monthLabel="Jun 2026" />
      </div>
      <Group justify="flex-end" mt={10} gap={6}>
        <Button size="xs" variant="subtle" style={{ pointerEvents:'none' }}>Clear</Button>
        <Button size="xs" color="teal" style={{ pointerEvents:'none' }}>Done</Button>
      </Group>
    </Box>
  );
}

function SingleCalendarMoleculePreview() {
  return (
    <Box style={{ background:'#fff', borderRadius:10, border:'1px solid var(--mantine-color-gray-2)', padding:'10px 12px', maxWidth: 220 }}>
      <CalendarMonthGrid cells={MAY_CELLS} monthLabel="May 2026" start={10} end={17} />
      <Group justify="flex-end" mt={8} gap={6}>
        <Button size="xs" variant="subtle" style={{ pointerEvents:'none' }}>Clear</Button>
        <Button size="xs" color="teal" style={{ pointerEvents:'none' }}>Done</Button>
      </Group>
    </Box>
  );
}

function SelectDropdownMoleculePreview() {
  const OPTIONS = ['Round trip', 'One way', 'Multi-city'];
  const selected = 'Round trip';
  return (
    <Box style={{ background:'#fff', borderRadius:10, border:'1px solid var(--mantine-color-gray-2)', padding:6, minWidth:180 }}>
      <Stack gap={2}>
        {OPTIONS.map((opt) => {
          const isSel = opt === selected;
          return (
            <div key={opt} style={{ padding:'8px 10px', borderRadius:8, fontSize:13,
              fontWeight: isSel ? 700 : 500,
              color: isSel ? 'var(--mantine-color-teal-8)' : 'inherit',
              background: isSel ? 'var(--mantine-color-teal-0)' : 'transparent' }}>
              {opt}
            </div>
          );
        })}
      </Stack>
    </Box>
  );
}

function TravelersMoleculePreview() {
  return (
    <Box style={{ width: '100%', maxWidth: 260, background: '#fff', borderRadius: 10,
      border: '1px solid var(--mantine-color-gray-2)', padding: 16 }}>
      <Stack gap="sm">
        {[['Adults', 2, true], ['Children', 0, false], ['Rooms', 1, true]].map(([label, count, atMin]) => (
          <Group key={label} justify="space-between" wrap="nowrap">
            <Text size="sm" fw={600}>{label}</Text>
            <Group gap={6} wrap="nowrap">
              <ActionIcon variant="default" size="md" radius="xl"
                style={{ opacity: atMin ? 0.35 : 1, pointerEvents: 'none' }}>−</ActionIcon>
              <Text size="sm" fw={600} w={20} ta="center">{count}</Text>
              <ActionIcon variant="default" size="md" radius="xl"
                style={{ pointerEvents: 'none' }}>+</ActionIcon>
            </Group>
          </Group>
        ))}
        <Group justify="flex-end">
          <Button size="xs" color="teal" style={{ pointerEvents: 'none' }}>Done</Button>
        </Group>
      </Stack>
    </Box>
  );
}

function TypeaheadMoleculePreview() {
  const I = window.SearchIcons || {};
  const TM = window.TYPE_META || {};
  const groups = [
    { label: 'Airports', items: [
      { type: 'airport', name: 'CDG — Paris Charles de Gaulle', sub: 'Paris, France' },
      { type: 'airport', name: 'ORY — Paris Orly', sub: 'Paris, France' },
    ]},
    { label: 'Cities & neighborhoods', items: [
      { type: 'city', name: 'Paris', sub: 'France' },
    ]},
  ];
  return (
    <Box style={{ width: '100%', background: '#fff', borderRadius: 10,
      border: '1px solid var(--mantine-color-gray-2)', maxHeight: 280, overflowY: 'auto' }}>
      {groups.map((g) => (
        <Box key={g.label}>
          <Text style={{ padding: '8px 10px 4px', fontSize: 10, fontWeight: 700, textTransform: 'uppercase',
            letterSpacing: 0.4, color: 'var(--mantine-color-gray-5)' }}>{g.label}</Text>
          {g.items.map((item) => {
            const meta = TM[item.type] || {};
            return (
              <div key={item.name} style={{ padding: '8px 10px', display: 'flex', alignItems: 'center', gap: 10 }}>
                <Box style={{ width: 30, height: 30, borderRadius: 8, background: 'var(--mantine-color-gray-1)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <span style={{ width: 14, height: 14, display: 'inline-flex', color: 'var(--mantine-color-gray-6)' }}>
                    {meta.icon || I.pin}
                  </span>
                </Box>
                <Box style={{ flex: 1, minWidth: 0 }}>
                  <Text size="sm" fw={600} truncate>{item.name}</Text>
                  <Text size="xs" c="dimmed" truncate>{item.sub}</Text>
                </Box>
                <Text style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5,
                  color: 'var(--mantine-color-gray-5)', flexShrink: 0 }}>
                  {item.type}
                </Text>
              </div>
            );
          })}
        </Box>
      ))}
    </Box>
  );
}

// ── Shared card + token table ─────────────────────────────────────────────
function AtomCard({ atom }) {
  const { name, desc, preview, rows } = atom;
  return (
    <Box style={{ background: '#fff', border: '1px solid var(--mantine-color-gray-2)', borderRadius: 12, overflow: 'hidden', height: '100%' }}>
      <Box style={{ padding: '14px 16px 12px', background: '#fafaf7',
        borderBottom: '1px solid var(--mantine-color-gray-1)' }}>
        {preview}
      </Box>
      <Box style={{ padding: '12px 16px' }}>
        <Text fw={700} size="sm" mb={3}>{name}</Text>
        <Text size="xs" c="dimmed" mb={10} style={{ lineHeight: 1.5 }}>{desc}</Text>
        <div style={{ borderTop: '1px solid var(--mantine-color-gray-1)', paddingTop: 8 }}>
          {rows.map(([prop, val]) => (
            <div key={prop} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 8, padding: '2px 0' }}>
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
            <Text style={{ fontSize: 9, textTransform: 'uppercase', letterSpacing: 0.3,
              color: 'var(--mantine-color-gray-4)', fontWeight: 600, lineHeight: 1 }}>{prop}</Text>
            <Text style={{ fontSize: 11, fontFamily: 'ui-monospace, monospace',
              color: 'var(--mantine-color-gray-8)', lineHeight: 1.4 }}>{val}</Text>
          </Box>
        ))}
      </Stack>
    </Box>
  );
}

// ── Vanilla Mantine component reference ──────────────────────────────────
function VanillaMantineDoc({ mobile }) {
  const { TextInput, Select, Autocomplete, NumberInput, SegmentedControl, Button, Paper, Group, Stack, Badge: MBadge } = window.mantine;

  // Small icon helper for previews
  const I = window.SearchIcons || {};
  const Ic = ({ icon, size = 14 }) => (
    <span style={{ width: size, height: size, display: 'inline-flex', flexShrink: 0,
      color: 'var(--mantine-color-gray-5)' }}>{icon}</span>
  );

  const COMPONENTS = [
    {
      name: 'Autocomplete',
      pkg: '@mantine/core',
      docs: 'https://mantine.dev/core/autocomplete/',
      usedFor: 'Location & place fields across all products',
      props: [
        ['data', 'string[] — suggestion list'],
        ['leftSection', 'ReactNode — icon'],
        ['label', 'string — field label above input'],
        ['placeholder', 'string'],
        ['size', '"sm" compact / default hero'],
      ],
      preview: (
        <Autocomplete
          label="Where to"
          placeholder="City, hotel, or landmark"
          data={['Paris, France', 'London, UK', 'Tokyo, Japan']}
          leftSection={<Ic icon={I.pin} />}
        />
      ),
    },
    {
      name: 'TextInput',
      pkg: '@mantine/core',
      docs: 'https://mantine.dev/core/text-input/',
      usedFor: 'Date fields (type="date"), time fields (type="time")',
      props: [
        ['type', '"date" | "time" | "text"'],
        ['leftSection', 'ReactNode — icon'],
        ['label', 'string — field label'],
        ['size', '"sm" compact / default hero'],
      ],
      preview: (
        <TextInput
          type="date"
          label="Check-in"
          defaultValue="2026-05-12"
          leftSection={<Ic icon={I.cal} />}
        />
      ),
    },
    {
      name: 'Select',
      pkg: '@mantine/core',
      docs: 'https://mantine.dev/core/select/',
      usedFor: 'Trip type, cabin class, duration, drop-off, bundle type',
      props: [
        ['data', '{ value, label }[] | string[]'],
        ['leftSection', 'ReactNode — icon'],
        ['label', 'string'],
        ['size', '"sm" compact / default hero'],
      ],
      preview: (
        <Select
          label="Cabin class"
          defaultValue="economy"
          leftSection={<Ic icon={I.plane} />}
          data={[
            { value: 'economy', label: 'Economy' },
            { value: 'premium', label: 'Premium economy' },
            { value: 'business', label: 'Business' },
            { value: 'first', label: 'First class' },
          ]}
        />
      ),
    },
    {
      name: 'NumberInput',
      pkg: '@mantine/core',
      docs: 'https://mantine.dev/core/number-input/',
      usedFor: 'Adults, children, rooms, guests, bedroom counts',
      props: [
        ['min', 'number — minimum (typically 1)'],
        ['max', 'number — maximum'],
        ['leftSection', 'ReactNode — icon'],
        ['label', 'string'],
      ],
      preview: (
        <NumberInput
          label="Adults"
          defaultValue={2}
          min={1}
          max={10}
          leftSection={<Ic icon={I.user} />}
          style={{ maxWidth: 180 }}
        />
      ),
    },
    {
      name: 'SegmentedControl',
      pkg: '@mantine/core',
      docs: 'https://mantine.dev/core/segmented-control/',
      usedFor: 'Trip type selector in Flights (Round trip / One way / Multi-city)',
      props: [
        ['data', '{ value, label }[]'],
        ['color', '"brand" — accent for active segment'],
        ['value / onChange', 'controlled'],
      ],
      preview: (
        <SegmentedControl
          color="brand"
          defaultValue="roundtrip"
          data={[
            { value: 'roundtrip', label: 'Round trip' },
            { value: 'oneway', label: 'One way' },
            { value: 'multi', label: 'Multi-city' },
          ]}
        />
      ),
    },
    {
      name: 'Button',
      pkg: '@mantine/core',
      docs: 'https://mantine.dev/core/button/',
      usedFor: 'Search CTA on every product form',
      props: [
        ['color', '"brand" — only customisation'],
        ['size', '"lg" hero / "sm" compact strip'],
        ['variant', '"filled" (default)'],
      ],
      preview: (
        <Group gap="sm">
          <Button color="brand" size="lg">Search hotels</Button>
          <Button color="brand" size="sm">Search</Button>
        </Group>
      ),
    },
    {
      name: 'Paper',
      pkg: '@mantine/core',
      docs: 'https://mantine.dev/core/paper/',
      usedFor: 'Hero search form container — wraps the input row',
      props: [
        ['shadow', '"md"'],
        ['withBorder', 'true'],
        ['radius', '"md"'],
        ['p', '"lg"'],
      ],
      preview: (
        <Paper shadow="md" withBorder radius="md" p="md">
          <Text size="sm" c="dimmed" ta="center">Search form lives here</Text>
        </Paper>
      ),
    },
    {
      name: 'Group',
      pkg: '@mantine/core',
      docs: 'https://mantine.dev/core/group/',
      usedFor: 'Horizontal row that holds all inputs + CTA button',
      props: [
        ['align', '"flex-end" — baseline-aligns labels + inputs'],
        ['gap', '"md" hero / "xs" compact'],
        ['wrap', '"wrap" hero (responsive) / "nowrap" compact'],
      ],
      preview: (
        <Group gap="xs" align="center">
          <MBadge variant="outline">Autocomplete</MBadge>
          <MBadge variant="outline">TextInput</MBadge>
          <MBadge variant="outline">Button</MBadge>
        </Group>
      ),
    },
  ];

  return (
    <Box style={{ background: '#fff', borderTop: '1px solid var(--mantine-color-gray-2)' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: mobile ? '32px 16px' : '56px 24px' }}>

        {/* Header */}
        <Stack gap={6} mb={mobile ? 28 : 44}>
          <Group gap={8} align="center">
            <Text size="xs" fw={700} tt="uppercase" c="dimmed" style={{ letterSpacing: 1 }}>Design system</Text>
            <MBadge color="brand" variant="light" radius="sm" size="sm">Vanilla Mantine</MBadge>
          </Group>
          <Text fw={800} style={{ fontSize: mobile ? 22 : 30, letterSpacing: -0.5 }}>Mantine components — no customisation beyond color</Text>
          <Text size="sm" c="dimmed" style={{ maxWidth: 620, lineHeight: 1.65 }}>
            Every input in this version uses a stock{' '}
            <code style={{ fontFamily: 'ui-monospace, monospace', fontSize: 12, background: 'var(--mantine-color-gray-1)', padding: '1px 5px', borderRadius: 4 }}>@mantine/core</code>{' '}
            component. The only customisation is <code style={{ fontFamily: 'ui-monospace, monospace', fontSize: 12, background: 'var(--mantine-color-gray-1)', padding: '1px 5px', borderRadius: 4 }}>color="brand"</code> on{' '}
            <code style={{ fontFamily: 'ui-monospace, monospace', fontSize: 12, background: 'var(--mantine-color-gray-1)', padding: '1px 5px', borderRadius: 4 }}>Button</code> and{' '}
            <code style={{ fontFamily: 'ui-monospace, monospace', fontSize: 12, background: 'var(--mantine-color-gray-1)', padding: '1px 5px', borderRadius: 4 }}>SegmentedControl</code>.
            No custom heights, shadows, or border overrides.
          </Text>
        </Stack>

        {/* Structure overview */}
        <Box mb={mobile ? 32 : 48} style={{ background: 'var(--mantine-color-gray-0)', border: '1px solid var(--mantine-color-gray-2)', borderRadius: 12, padding: mobile ? '16px' : '22px 28px' }}>
          <DocLabel>Form structure — applies to all products</DocLabel>
          <div style={{ display: 'grid', gridTemplateColumns: mobile ? '1fr' : '1fr 1fr 1fr', gap: 16, marginTop: 14 }}>
            {[
              { component: 'Paper', role: 'Hero container', props: 'shadow="md" withBorder radius="md" p="lg"' },
              { component: 'Group', role: 'Input row', props: 'align="flex-end" gap="md" wrap="wrap"' },
              { component: 'Stack', role: 'Flights wrapper', props: 'gap="md" (SegmentedControl above Group)' },
            ].map(({ component, role, props }) => (
              <Box key={component} style={{ background: '#fff', border: '1px solid var(--mantine-color-gray-2)', borderRadius: 8, padding: '12px 14px' }}>
                <Group gap={8} mb={4}>
                  <Text fw={700} size="sm" style={{ fontFamily: 'ui-monospace, monospace' }}>{component}</Text>
                  <MBadge variant="light" color="brand" size="xs" radius="sm">{role}</MBadge>
                </Group>
                <Text size="xs" style={{ fontFamily: 'ui-monospace, monospace', color: 'var(--mantine-color-gray-6)', lineHeight: 1.5 }}>{props}</Text>
              </Box>
            ))}
          </div>
        </Box>

        {/* Component cards */}
        <DocLabel>Input &amp; control components</DocLabel>
        <div style={{ display: 'grid', gridTemplateColumns: mobile ? '1fr' : '1fr 1fr', gap: 16, marginTop: 14 }}>
          {COMPONENTS.map((c) => (
            <Box key={c.name} style={{ background: '#fafaf7', border: '1px solid var(--mantine-color-gray-2)', borderRadius: 12, overflow: 'hidden' }}>
              {/* Preview */}
              <Box style={{ padding: '18px 20px', background: '#fff', borderBottom: '1px solid var(--mantine-color-gray-1)' }}>
                {c.preview}
              </Box>
              {/* Info */}
              <Box style={{ padding: '14px 16px' }}>
                <Group gap={8} mb={4} wrap="nowrap" align="baseline">
                  <Text fw={800} size="sm" style={{ fontFamily: 'ui-monospace, monospace' }}>{c.name}</Text>
                  <Text size="xs" c="dimmed" style={{ fontFamily: 'ui-monospace, monospace' }}>from {c.pkg}</Text>
                  <a href={c.docs} target="_blank" rel="noopener" style={{ marginLeft: 'auto', fontSize: 10, fontWeight: 600, color: 'var(--mantine-color-brand-5, #4263EB)', textDecoration: 'none', whiteSpace: 'nowrap' }}>docs ↗</a>
                </Group>
                <Text size="xs" c="dimmed" mb={10} style={{ lineHeight: 1.5 }}>{c.usedFor}</Text>
                <div style={{ borderTop: '1px solid var(--mantine-color-gray-1)', paddingTop: 8 }}>
                  {c.props.map(([prop, val]) => (
                    <div key={prop} style={{ display: 'flex', justifyContent: 'space-between', gap: 8, padding: '2px 0', alignItems: 'baseline' }}>
                      <span style={{ fontSize: 11, fontFamily: 'ui-monospace, monospace', color: 'var(--mantine-color-gray-7)', flexShrink: 0 }}>{prop}</span>
                      <span style={{ fontSize: 11, color: 'var(--mantine-color-gray-5)', textAlign: 'right' }}>{val}</span>
                    </div>
                  ))}
                </div>
              </Box>
            </Box>
          ))}
        </div>

        {/* Note about @mantine/dates */}
        <Box mt={mobile ? 28 : 40} style={{ background: 'var(--mantine-color-blue-0)', border: '1px solid var(--mantine-color-blue-2)', borderRadius: 10, padding: '14px 18px' }}>
          <Group gap={8} mb={4}>
            <Text size="xs" fw={700} style={{ color: 'var(--mantine-color-blue-7)' }}>Note — @mantine/dates</Text>
          </Group>
          <Text size="xs" style={{ color: 'var(--mantine-color-blue-8)', lineHeight: 1.6 }}>
            Production apps should replace the <code style={{ fontFamily: 'ui-monospace, monospace', fontSize: 11 }}>TextInput type="date"</code> fields with{' '}
            <code style={{ fontFamily: 'ui-monospace, monospace', fontSize: 11 }}>DatePickerInput</code> or{' '}
            <code style={{ fontFamily: 'ui-monospace, monospace', fontSize: 11 }}>DateRangePicker</code> from{' '}
            <strong>@mantine/dates</strong> for a fully branded calendar popover. This demo uses{' '}
            <code style={{ fontFamily: 'ui-monospace, monospace', fontSize: 11 }}>TextInput type="date"</code> since the dates package isn't loaded here.
          </Text>
        </Box>

      </div>
    </Box>
  );
}

window.ResultsPage = ResultsPage;
})();
