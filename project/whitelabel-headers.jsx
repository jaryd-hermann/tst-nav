// Whitelabel customer headers — render uploaded screenshots verbatim above the product nav.
(function() {
const { Box } = window.mantine;

function HeaderImg({ src, alt }) {
  return (
    <Box style={{ width: '100%', display: 'block', background: '#fff' }}>
      <img
        src={src}
        alt={alt}
        style={{ display: 'block', width: '100%', height: 'auto' }}
      />
    </Box>
  );
}

function H1() { return <HeaderImg src="headers/h1.png" alt="Customer header 1" />; }
function H2() { return <HeaderImg src="headers/h2.png" alt="Customer header 2" />; }
function H3() { return <HeaderImg src="headers/h3.png" alt="Customer header 3" />; }
function H4() { return <HeaderImg src="headers/h4.png" alt="Customer header 4" />; }

window.WhitelabelHeaders = {
  none: null,
  h1: H1,
  h2: H2,
  h3: H3,
  h4: H4,
};
})();
