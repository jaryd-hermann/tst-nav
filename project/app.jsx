// Main app: nav + centered product-specific search + below-fold preview content.
(function() {
const { MantineProvider, createTheme, Container, Text, Box, Stack, Group, Badge } = window.mantine;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "activeProduct": "hotels",
  "viewport": "desktop",
  "accent": "navy",
  "view": "search",
  "customerHeader": "none"
}/*EDITMODE-END*/;

const ACCENT_HUE = {
  teal:    { c: 'teal',    primaryShade: 7 },
  navy:    { c: 'indigo',  primaryShade: 8 },
  forest:  { c: 'green',   primaryShade: 8 },
  sunset:  { c: 'orange',  primaryShade: 7 },
  plum:    { c: 'grape',   primaryShade: 8 },
};

function App() {
  const [tweaks, setTweak] = window.useTweaks(TWEAK_DEFAULTS);
  const accent = ACCENT_HUE[tweaks.accent] || ACCENT_HUE.navy;

  // Fake "isMobile" — true if user is in mobile preview, OR window narrow.
  const [windowMobile, setWindowMobile] = React.useState(false);
  React.useEffect(() => {
    const onResize = () => setWindowMobile(window.innerWidth < 820);
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);
  const mobilePreview = tweaks.viewport === 'mobile';
  const isMobile = mobilePreview || windowMobile;

  const theme = createTheme({
    primaryColor: accent.c,
    primaryShade: accent.primaryShade,
    fontFamily: 'Inter, system-ui, sans-serif',
    headings: { fontFamily: 'Inter, system-ui, sans-serif', fontWeight: '700' },
    defaultRadius: 'md',
  });

  // Re-map "teal" CSS-var references inside our components to whichever accent
  // the user picked. We use a CSS variable proxy.
  const accentVar = `--mantine-color-${accent.c}-7`;
  const accentVar0 = `--mantine-color-${accent.c}-0`;
  const accentVar8 = `--mantine-color-${accent.c}-8`;
  const accentVar9 = `--mantine-color-${accent.c}-9`;

  const ProductForm = window.ProductSearch[tweaks.activeProduct] || window.ProductSearch.hotels;
  const ProductCompactForm = window.ProductCompactSearch[tweaks.activeProduct] || window.ProductCompactSearch.hotels;
  const activeProduct = window.PRODUCTS.find((p) => p.id === tweaks.activeProduct) || window.PRODUCTS[0];
  const isResults = tweaks.view === 'results';

  // Inject CSS that aliases teal-* to the chosen accent so all nested
  // components track the accent without rewriting them.
  const accentAlias = `
    :root {
      --mantine-color-teal-0: var(${accentVar0});
      --mantine-color-teal-7: var(${accentVar});
      --mantine-color-teal-8: var(${accentVar8});
      --mantine-color-teal-9: var(${accentVar9});
    }
  `;

  return (
    <MantineProvider theme={theme}>
      <style>{accentAlias}</style>
      <Box style={{ minHeight: '100vh', background: '#fafaf7' }}>
        <PreviewWrapper mobile={mobilePreview}>
          {!isMobile && (() => {
            const Header = window.WhitelabelHeaders?.[tweaks.customerHeader];
            return Header ? <Header /> : null;
          })()}
          <window.ProductNav
            active={tweaks.activeProduct}
            onSelect={(id) => setTweak('activeProduct', id)}
            isMobile={isMobile}
            cartCount={2}
            tripCount={1}
            compact={isResults}
            compactSearch={isResults ? <ProductCompactForm mobile={isMobile} onSearch={() => {}} /> : null}
          />

          {!isResults && (
          <Box
            style={{
              background: '#344570',
              color: '#fff',
              borderBottom: '1px solid var(--mantine-color-gray-2)',
            }}
          >
            <Container size="lg" py={isMobile ? 32 : 56}>
              <Stack align="center" gap={isMobile ? 24 : 36}>
                <Stack align="center" gap={6} style={{ textAlign: 'center', maxWidth: 720 }}>
                  <Text component="h1" style={{ fontSize: isMobile ? 30 : 44, lineHeight: 1.05, fontWeight: 800, letterSpacing: -1, textWrap: 'balance', margin: 0, color: '#fff' }}>
                    {HEADLINES[tweaks.activeProduct]?.title || 'Plan your next trip'}
                  </Text>
                  <Text size={isMobile ? 'sm' : 'md'} mt={4} style={{ color: 'rgba(255,255,255,0.75)' }}>
                    {HEADLINES[tweaks.activeProduct]?.sub || 'Search across the whole world.'}
                  </Text>
                </Stack>

                <Box style={{ width: '100%', maxWidth: 1100 }}>
                  <ProductCompactForm mobile={isMobile} onSearch={() => setTweak('view', 'results')} />
                </Box>
              </Stack>
            </Container>
          </Box>
          )}

          {isResults && (
            <window.ResultsPage product={tweaks.activeProduct} mobile={isMobile} />
          )}
        </PreviewWrapper>
      </Box>

      <window.TweaksPanel title="Tweaks">
        <window.TweakSection title="View">
          <window.TweakRadio
            value={tweaks.view}
            onChange={(v) => setTweak('view', v)}
            options={[
              { value: 'search', label: 'Search' },
              { value: 'results', label: 'Results' },
            ]}
          />
        </window.TweakSection>
        <window.TweakSection title="Active product">
          <window.TweakSelect
            value={tweaks.activeProduct}
            onChange={(v) => setTweak('activeProduct', v)}
            options={window.PRODUCTS.map((p) => ({ value: p.id, label: p.label }))}
          />
        </window.TweakSection>
        <window.TweakSection title="Viewport">
          <window.TweakRadio
            value={tweaks.viewport}
            onChange={(v) => setTweak('viewport', v)}
            options={[
              { value: 'desktop', label: 'Desktop' },
              { value: 'mobile', label: 'Mobile' },
            ]}
          />
        </window.TweakSection>
        <window.TweakSection title="Customer header">
          <window.TweakSelect
            value={tweaks.customerHeader}
            onChange={(v) => setTweak('customerHeader', v)}
            options={[
              { value: 'none', label: 'No header' },
              { value: 'h1', label: 'Header 1 — Compact navy' },
              { value: 'h2', label: 'Header 2 — Promo + breadcrumb' },
              { value: 'h3', label: 'Header 3 — Slim category tabs' },
              { value: 'h4', label: 'Header 4 — Two-row corporate' },
            ]}
          />
        </window.TweakSection>
      </window.TweaksPanel>
    </MantineProvider>
  );
}

function PreviewWrapper({ mobile, children }) {
  if (!mobile) return children;
  return (
    <div style={{ background: '#1a1a1a', padding: '40px 0', minHeight: '100vh' }}>
      <div
        style={{
          margin: '0 auto',
          width: 390,
          maxWidth: '100%',
          minHeight: 780,
          background: '#fff',
          borderRadius: 36,
          overflow: 'hidden',
          boxShadow: '0 30px 60px rgba(0,0,0,0.4)',
          position: 'relative',
          border: '8px solid #1a1a1a',
        }}
      >
        {/* iOS-style status bar */}
        <div style={{ height: 44, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 28px', background: '#fff', fontSize: 14, fontWeight: 600 }}>
          <span>9:41</span>
          <span style={{ display: 'inline-flex', gap: 6, alignItems: 'center' }}>
            <span style={{ display: 'inline-flex', gap: 2 }}>
              <span style={{ width: 4, height: 6, background: '#000', borderRadius: 1 }}></span>
              <span style={{ width: 4, height: 8, background: '#000', borderRadius: 1 }}></span>
              <span style={{ width: 4, height: 10, background: '#000', borderRadius: 1 }}></span>
              <span style={{ width: 4, height: 12, background: '#000', borderRadius: 1 }}></span>
            </span>
            <span style={{ width: 22, height: 11, border: '1px solid #000', borderRadius: 3, position: 'relative', display: 'inline-block' }}>
              <span style={{ position: 'absolute', inset: 1, background: '#000', borderRadius: 1, width: 'calc(100% - 4px)' }}></span>
            </span>
          </span>
        </div>
        <div style={{ overflow: 'auto', maxHeight: 780 - 44 }}>
          {children}
        </div>
      </div>
    </div>
  );
}

const HEADLINES = {
  hotels:     { title: 'Find a place to stay',         sub: 'Hand-picked hotels in 18,000+ destinations.' },
  flights:    { title: 'Fly somewhere new',            sub: 'Compare 700+ airlines for the best fares.' },
  cars:       { title: 'Drive on your own terms',      sub: 'No hidden fees. Free cancellation on most rentals.' },
  cruises:    { title: 'Sail the world',               sub: 'Itineraries from a weekend escape to a world tour.' },
  tours:      { title: 'Guided tours, perfectly planned', sub: 'Small-group and private journeys curated by locals.' },
  activities: { title: 'Things to do, wherever you go',sub: 'Skip-the-line tickets, tastings, day trips, and more.' },
  packages:   { title: 'Bundle and save',              sub: 'Combine flights, hotels, and cars for the best price.' },
  rentals:    { title: 'Stay in a place that\u2019s yours', sub: 'Apartments, villas, and cabins for groups of any size.' },
};

function BelowFold({ accent, product, mobile }) {
  return (
    <Container size="lg" py={mobile ? 28 : 48}>
      <Stack gap={mobile ? 28 : 40}>
        <div>
          <Text size="xs" c="dimmed" fw={700} tt="uppercase" style={{ letterSpacing: 0.6 }}>Trending {product.label.toLowerCase()}</Text>
          <Text component="h2" style={{ fontSize: mobile ? 22 : 28, fontWeight: 700, marginTop: 4, marginBottom: 18, letterSpacing: -0.4 }}>
            Where travelers are going this week
          </Text>
          <div style={{ display: 'grid', gridTemplateColumns: mobile ? '1fr 1fr' : 'repeat(4, 1fr)', gap: 16 }}>
            {['Lisbon', 'Tokyo', 'Reykjavík', 'Mexico City', 'Bangkok', 'Cape Town', 'Cusco', 'Florence'].slice(0, mobile ? 4 : 8).map((city, i) => (
              <DestinationCard key={city} city={city} hue={i * 47} />
            ))}
          </div>
        </div>
      </Stack>
    </Container>
  );
}

function DestinationCard({ city, hue }) {
  return (
    <div style={{
      borderRadius: 14,
      overflow: 'hidden',
      background: '#fff',
      border: '1px solid var(--mantine-color-gray-2)',
      cursor: 'pointer',
      transition: 'transform 160ms, box-shadow 160ms',
    }}
    onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.06)'; }}
    onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}>
      {/* Striped placeholder */}
      <div style={{
        height: 130,
        backgroundImage: `repeating-linear-gradient(135deg, oklch(0.85 0.05 ${hue}) 0 12px, oklch(0.78 0.06 ${hue}) 12px 24px)`,
        position: 'relative',
        display: 'flex', alignItems: 'flex-end', padding: 12,
      }}>
        <span style={{ fontFamily: 'ui-monospace, Menlo, monospace', fontSize: 10, background: 'rgba(255,255,255,0.85)', padding: '2px 6px', borderRadius: 4, color: '#444' }}>
          {city.toLowerCase()}.jpg
        </span>
      </div>
      <div style={{ padding: 12 }}>
        <Text fw={700} size="sm">{city}</Text>
        <Text size="xs" c="dimmed">From $189 / night</Text>
      </div>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
})();
