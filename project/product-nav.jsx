// Top product nav: logo + product tabs + cart/trip on right.
// Mobile: hamburger drawer + active product label inline.
(function() {
const { Group, UnstyledButton, Text, Indicator, Drawer, Stack, ActionIcon, Box } = window.mantine;
const NI = window.SearchIcons;

const PRODUCTS = [
  { id: 'hotels',     label: 'Hotels',     icon: NI.home },
  { id: 'flights',    label: 'Flights',    icon: NI.plane },
  { id: 'cars',       label: 'Cars',       icon: NI.car },
  { id: 'cruises',    label: 'Cruises',    icon: NI.ship },
  { id: 'tours',      label: 'Tours',      icon: NI.pkg },
  { id: 'activities', label: 'Activities', icon: NI.bolt },
  { id: 'packages',   label: 'Packages',   icon: NI.pkg },
  { id: 'rentals',    label: 'Rentals',    icon: NI.home },
];
window.PRODUCTS = PRODUCTS;

function NavTab({ product, active, onClick }) {
  return (
    <UnstyledButton
      onClick={onClick}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 7,
        padding: '9px 12px',
        borderRadius: 999,
        position: 'relative',
        color: active ? '#0064B1' : 'var(--mantine-color-gray-7)',
        background: active ? '#E6EFFB' : 'transparent',
        fontWeight: active ? 700 : 500,
        fontSize: 14,
        whiteSpace: 'nowrap',
        flexShrink: 0,
        transition: 'background 120ms, color 120ms',
      }}
      onMouseEnter={(e) => { if (!active) e.currentTarget.style.background = 'var(--mantine-color-gray-1)'; }}
      onMouseLeave={(e) => { if (!active) e.currentTarget.style.background = 'transparent'; }}
    >
      <span style={{ width: 17, height: 17, display: 'inline-flex' }}>{product.icon}</span>
      {product.label}
    </UnstyledButton>
  );
}

const cartIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width={20} height={20}>
    <path d="M3 4h2l2.5 12.5a2 2 0 0 0 2 1.5h7.5a2 2 0 0 0 2-1.5L21 8H6"/>
    <circle cx="10" cy="21" r="1.4"/><circle cx="17" cy="21" r="1.4"/>
  </svg>
);
const tripIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width={20} height={20}>
    <path d="M4 7h16v13H4z"/><path d="M9 7V4h6v3"/><path d="M4 12h16"/>
  </svg>
);
const menuIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" width={22} height={22}><path d="M4 7h16M4 12h16M4 17h16"/></svg>
);

function Logo() {
  return (
    <Group gap={8} wrap="nowrap">
      <div style={{
        width: 30, height: 30, borderRadius: 8,
        background: 'linear-gradient(135deg, var(--mantine-color-teal-7), var(--mantine-color-teal-9))',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: '#fff', fontWeight: 800, fontSize: 14, fontFamily: 'Inter, sans-serif',
      }}>w.</div>
    </Group>
  );
}

function ProductNav({ active, onSelect, isMobile, cartCount = 2, tripCount = 1, compact = false, compactSearch = null }) {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const activeProduct = PRODUCTS.find((p) => p.id === active) || PRODUCTS[0];
  const scrollerRef = React.useRef(null);

  return (
    <Box
      style={{
        background: '#fff',
        borderBottom: '1px solid var(--mantine-color-gray-2)',
        position: 'sticky',
        top: 0,
        zIndex: 50,
      }}
    >
      <div
        style={{
          maxWidth: 1280,
          margin: '0 auto',
          padding: isMobile ? '12px 16px' : '14px 24px',
          display: 'flex',
          alignItems: 'center',
          gap: 16,
        }}
      >
        {isMobile && (
          <ActionIcon variant="subtle" size="lg" onClick={() => setMobileOpen(true)} aria-label="Menu">
            {menuIcon}
          </ActionIcon>
        )}

        {!isMobile && (
          <div
            ref={scrollerRef}
            style={{
              flex: 1,
              display: 'flex',
              gap: 2,
              overflowX: 'auto',
              scrollbarWidth: 'none',
              padding: '0 8px',
              minWidth: 0,
            }}
          >
            {PRODUCTS.map((p) => (
              <NavTab key={p.id} product={p} active={p.id === active} onClick={() => onSelect(p.id)} />
            ))}
          </div>
        )}

        {isMobile && (
          <UnstyledButton
            onClick={() => setMobileOpen(true)}
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              padding: '8px 14px',
              borderRadius: 999,
              background: '#E6EFFB',
              color: '#0064B1',
              fontWeight: 700,
              fontSize: 14,
            }}
          >
            <span style={{ width: 18, height: 18, display: 'inline-flex' }}>{activeProduct.icon}</span>
            {activeProduct.label}
            <span style={{ opacity: 0.6, marginLeft: 4 }}>▾</span>
          </UnstyledButton>
        )}

        <Group gap={4} wrap="nowrap">
          <Indicator label={tripCount} color="teal" size={16} disabled={!tripCount} offset={4}>
            <ActionIcon variant="subtle" size="lg" aria-label="My trips" color="gray">
              <span style={{ color: 'var(--mantine-color-gray-7)' }}>{tripIcon}</span>
            </ActionIcon>
          </Indicator>
          <Indicator label={cartCount} color="teal" size={16} disabled={!cartCount} offset={4}>
            <ActionIcon variant="subtle" size="lg" aria-label="Cart" color="gray">
              <span style={{ color: 'var(--mantine-color-gray-7)' }}>{cartIcon}</span>
            </ActionIcon>
          </Indicator>
        </Group>
      </div>

      {/* Compact inline search — shown on results pages */}
      {compact && compactSearch && (
        <div
          style={{
            background: '#344570',
            borderTop: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          <div style={{
            maxWidth: 1280,
            margin: '0 auto',
            padding: isMobile ? '10px 12px' : '12px 24px',
          }}>
            {compactSearch}
          </div>
        </div>
      )}

      <Drawer
        opened={mobileOpen}
        onClose={() => setMobileOpen(false)}
        position="left"
        size="80%"
        title="Shop"
        withinPortal={false}
      >
        <Stack gap={4} mt="md">
          <Text size="xs" c="dimmed" fw={600} tt="uppercase" mb={4}>Shop</Text>
          {PRODUCTS.map((p) => (
            <UnstyledButton
              key={p.id}
              onClick={() => { onSelect(p.id); setMobileOpen(false); }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '14px 12px',
                borderRadius: 10,
                background: p.id === active ? '#E6EFFB' : 'transparent',
                color: p.id === active ? '#0064B1' : 'var(--mantine-color-gray-9)',
                fontWeight: p.id === active ? 700 : 500,
                fontSize: 16,
              }}
            >
              <span style={{ width: 22, height: 22, display: 'inline-flex' }}>{p.icon}</span>
              {p.label}
            </UnstyledButton>
          ))}
        </Stack>
      </Drawer>
    </Box>
  );
}

window.ProductNav = ProductNav;
})();
