import React from 'react';
import MainLayout from '../components/layouts/MainLayout/MainLayout';
import Button from '../components/common/Button';
import Card from '../components/common/Card';

const features = [
  {
    title: 'Tokenization of Funds',
    description: 'Transform fund shares into digital tokens on the Stellar blockchain, with on-chain governance and distribution.',
    icon: (
      <svg width="32" height="32" fill="none" viewBox="0 0 32 32"><circle cx="16" cy="16" r="16" fill="#764ba2"/><path d="M10 16h12M16 10v12" stroke="#fff" strokeWidth="2" strokeLinecap="round"/></svg>
    ),
  },
  {
    title: 'Transparent Management',
    description: 'All operations recorded on-chain, with automatic yield distribution and facilitated auditing.',
    icon: (
      <svg width="32" height="32" fill="none" viewBox="0 0 32 32"><circle cx="16" cy="16" r="16" fill="#f0b90b"/><path d="M10 22l6-12 6 12" stroke="#fff" strokeWidth="2" strokeLinecap="round"/></svg>
    ),
  },
  {
    title: 'Democratic Access',
    description: 'Investors track balance in real-time, buy shares, and receive yields directly in their digital wallet.',
    icon: (
      <svg width="32" height="32" fill="none" viewBox="0 0 32 32"><circle cx="16" cy="16" r="16" fill="#764ba2"/><path d="M16 10v12M10 16h12" stroke="#fff" strokeWidth="2" strokeLinecap="round"/></svg>
    ),
  },
];

const containerStyle: React.CSSProperties = {
  width: '100%',
  maxWidth: 1100,
  margin: '0 auto',
  padding: '0 24px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 64,
};

const HomePage: React.FC = () => {
  return (
    <MainLayout>
      {/* HERO SECTION – full-bleed e gradiente cobrindo tudo */}
<section
  style={{
    // full-bleed: ignora gutters do MainLayout
    width: '100vw',
    marginLeft: 'calc(50% - 50vw)',
    marginRight: 'calc(50% - 50vw)',

    // altura e layout
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
    boxSizing: 'border-box',

    // fundo (radial aumentado para não “acabar” antes da borda)
    background:
      'radial-gradient(140% 140% at 20% 20%, #764ba2 0%, #2b2b32 42%, #18181b 100%)',
    color: '#fff',
    padding: '0 0 4rem 0', // sem padding horizontal aqui
  }}
>
  {/* CONTAINER centralizado – controla o conteúdo, não o fundo */}
  <div
    style={{
      width: '100%',
      maxWidth: 1100,
      margin: '0 auto',
      padding: '0 24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 64,
      flexWrap: 'wrap',
    }}
  >
    {/* Coluna de texto */}
    <div style={{ minWidth: 320, flex: '1 1 420px' }}>
      <span
        style={{
          fontSize: 48,
          fontWeight: 900,
          letterSpacing: '-2px',
          lineHeight: 1,
          textTransform: 'uppercase',
          display: 'inline-block',
        }}
      >
        THE<br />SIMPLE<br />FUND
        <span style={{ color: '#f0b90b' }}>.</span>
      </span>

      <span
        style={{
          display: 'block',
          marginTop: 24,
          color: '#b3b3b3',
          fontWeight: 500,
          fontSize: 18,
          letterSpacing: 0.5,
        }}
      >
        Security | Convenience | Transitions
      </span>

      <span
        style={{
          display: 'block',
          marginTop: 8,
          color: '#b3b3b3',
          fontWeight: 400,
          fontSize: 15,
        }}
      >
        Tokenize the future of receivables funds
      </span>

      <div style={{ display: 'flex', gap: 16, marginTop: 40 }}>
        <a href="/register" style={{ textDecoration: 'none' }}>
          <Button variant="primary" size="lg">Explore Platform</Button>
        </a>
        <a
          href="https://drive.google.com/file/d/1f96kb6KkLN-z9O3kdbUULvy0VoJmqPLw/view?usp=sharing"
          style={{
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            color: '#fff',
            fontWeight: 500,
          }}
        >
          <svg width="22" height="22" fill="none" viewBox="0 0 22 22">
            <circle cx="11" cy="11" r="10" stroke="#fff" strokeWidth="2" />
            <polygon points="9,7 15,11 9,15" fill="#fff" />
          </svg>
          Watch Video
        </a>
      </div>
    </div>

    {/* Coluna “vaga” para futura ilustração e para equilibrar o grid */}
    <div style={{ flex: '1 1 380px', minHeight: 200 }} />
  </div>
</section>



      {/* FEATURES SECTION */}
      <section id="how-it-works" style={{ background: 'none', padding: '5rem 0 4rem 0', width: '100%' }}>
        <h2 style={{ textAlign: 'center', fontSize: '2.2rem', fontWeight: 700, marginBottom: 48, color: '#fff', letterSpacing: '-1px' }}>
          How does it work?
        </h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 32, maxWidth: 1100, margin: '0 auto', padding: '0 24px' }}>
          {features.map((f, i) => (
            <Card key={i} title={f.title} icon={f.icon}>
              <p style={{ color: '#ccc', fontSize: '1.08rem', marginTop: 8 }}>{f.description}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* MVP FLOW SECTION */}
<section
  style={{
    width: '100vw',
    marginLeft: 'calc(50% - 50vw)',
    marginRight: 'calc(50% - 50vw)',
    background: 'linear-gradient(135deg, #1a1a1d 0%, #222 100%)',
    padding: '5rem 0 6rem 0',
  }}
>
  <h2
    style={{
      textAlign: 'center',
      fontSize: '2.2rem',
      fontWeight: 800,
      marginBottom: 60,
      color: '#fff',
      letterSpacing: '-0.5px',
    }}
  >
    MVP Flow
  </h2>

  <div
    style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
      gap: 32,
      maxWidth: 1000,
      margin: '0 auto',
      padding: '0 24px',
    }}
  >
    {[
      {
        step: '1',
        title: 'Consultant registers',
        text: 'Originator and Debtor (mock KYC)',
      },
      {
        step: '2',
        title: 'Manager approves',
        text: 'Registration and issues Fund (token)',
      },
      {
        step: '3',
        title: 'Investor buys',
        text: 'Fund shares in the platform',
      },
      {
        step: '4',
        title: 'Debtor pays',
        text: 'Simulated repayment and redistribution to Investors',
      },
    ].map((item, i) => (
      <div
        key={i}
        style={{
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 16,
          padding: '2rem 1.5rem',
          textAlign: 'center',
          color: '#fff',
          transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.transform = 'translateY(-6px)')
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.transform = 'translateY(0)')
        }
      >
        <div
          style={{
            width: 60,
            height: 60,
            borderRadius: '50%',
            margin: '0 auto 20px',
            background:
              i % 2 === 0
                ? 'linear-gradient(135deg, #764ba2, #4b0082)'
                : 'linear-gradient(135deg, #f0b90b, #b38600)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 800,
            fontSize: '1.3rem',
            color: '#fff',
            boxShadow: '0 6px 16px rgba(0,0,0,0.4)',
          }}
        >
          {item.step}
        </div>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: 12 }}>
          {item.title}
        </h3>
        <p style={{ fontSize: '1rem', color: '#ccc', lineHeight: 1.5 }}>
          {item.text}
        </p>
      </div>
    ))}
  </div>
</section>


      {/* AUDIENCE SECTION */}
      <section style={{ background: 'none', padding: '5rem 0 6rem 0', width: '100%' }}>
        <h2 style={{ textAlign: 'center', fontSize: '2rem', fontWeight: 700, marginBottom: 48, color: '#fff' }}>Who is it for?</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 32, maxWidth: 1100, margin: '0 auto', padding: '0 24px' }}>
          <Card title="Consultants">
            <ul style={{ color: '#ccc', fontSize: '1.08rem', marginTop: 8, listStyle: 'disc inside' }}>
              <li>Origination of originators and debtors</li>
              <li>Proposal submission for approval</li>
              <li>Track registration status</li>
            </ul>
          </Card>
          <Card title="Managers">
            <ul style={{ color: '#ccc', fontSize: '1.08rem', marginTop: 8, listStyle: 'disc inside' }}>
              <li>Registration approval</li>
              <li>Creation and issuance of tokenized funds</li>
              <li>Payment management and yield distribution</li>
            </ul>
          </Card>
          <Card title="Investors">
            <ul style={{ color: '#ccc', fontSize: '1.08rem', marginTop: 8, listStyle: 'disc inside' }}>
              <li>Purchase of digital shares</li>
              <li>On-chain balance and statement view</li>
              <li>Automatic yield receipt</li>
            </ul>
          </Card>
        </div>
      </section>

      {/* CALL TO ACTION SECTION – gradiente cobre 100% */}
<section
  style={{
    // full-bleed
    width: '100vw',
    marginLeft: 'calc(50% - 50vw)',
    marginRight: 'calc(50% - 50vw)',

    background: 'linear-gradient(120deg, #764ba2 0%, #f0b90b 100%)',
    color: '#fff',
    padding: '4rem 0',
    textAlign: 'center',
    boxSizing: 'border-box',
  }}
>
  <div
    style={{
      maxWidth: 900,
      margin: '0 auto',
      padding: '0 24px',
    }}
  >
    <h2
      style={{
        fontSize: '2.2rem',
        fontWeight: 800,
        marginBottom: 24,
      }}
    >
      Ready to transform fund management?
    </h2>
    <p
      style={{
        fontSize: '1.2rem',
        marginBottom: 36,
        color: 'rgba(255,255,255,0.92)',
      }}
    >
      Sign up now and experience the most innovative tokenized fund platform on the market.
    </p>
    <a href="/register" style={{ textDecoration: 'none' }}>
      <Button variant="primary" size="lg">Create my account</Button>
    </a>
  </div>
</section>

    </MainLayout>
  );
};

export default HomePage;
