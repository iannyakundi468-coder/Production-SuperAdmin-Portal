export default function SomoBloomLogo({ size = 40, showText = true, fontSize = '18px' }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', userSelect: 'none' }}>
      <img 
        src="/logo.png" 
        alt="SomoBloom Logo"
        style={{ 
          width: size, 
          height: size, 
          objectFit: 'contain',
          transition: 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
          filter: 'drop-shadow(0 4px 12px rgba(16, 185, 129, 0.15))'
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1) rotate(4deg)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1) rotate(0deg)'}
      />
      {showText && (
        <span style={{
          fontSize: fontSize,
          fontWeight: '800',
          letterSpacing: '-0.03em',
          color: 'inherit',
          fontFamily: "'Outfit', 'Inter', sans-serif"
        }}>
          Somo<span style={{ color: '#4f46e5' }}>Bloom</span>
        </span>
      )}
    </div>
  );
}
