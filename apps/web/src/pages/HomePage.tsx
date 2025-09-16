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

const HomePage: React.FC = () => {
  return (
    <MainLayout>
      {/* HERO SECTION */}
      <section style={{ minHeight: '90vh', width: '100vw', left: 0, top: 0, position: 'relative', display: 'flex', alignItems: 'center', background: 'radial-gradient(ellipse at 50% 50%, #764ba2 0%, #18181b 90%)', color: '#fff', padding: '0 0 4rem 0', margin: 0, overflow: 'hidden' }}>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100%',
          background: 'radial-gradient(ellipse at 50% 50%, #764ba2 0%, #18181b 90%)',
          zIndex: 0,
        }} />
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100vw',
          maxWidth: '100vw',
          minHeight: '90vh',
          margin: 0,
          position: 'relative',
          zIndex: 1,
        }}>
          {/* Brand Name Vertical */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'center',
            minWidth: 320,
            marginRight: 64,
            height: '100%',
          }}>
            <span style={{ fontSize: 48, fontWeight: 900, letterSpacing: '-2px', lineHeight: 1, textAlign: 'left', textTransform: 'uppercase' }}>
              THE<br />SIMPLE<br />FUND<span style={{ color: '#f0b90b' }}>.</span>
            </span>
            <span style={{ marginTop: 24, color: '#b3b3b3', fontWeight: 500, fontSize: 18, letterSpacing: 0.5 }}>Security | Convenience | Transitions</span>
            <span style={{ marginTop: 8, color: '#b3b3b3', fontWeight: 400, fontSize: 15 }}>Tokenize the future of receivables funds</span>
            <div style={{ display: 'flex', gap: 16, marginTop: 40 }}>
              <a href="/register" style={{ textDecoration: 'none' }}>
                <Button variant="primary" size="lg">
                  Explore Platform
                </Button>
              </a>
              <a href="#how-it-works" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8, color: '#fff', fontWeight: 500 }}>
                <svg width="22" height="22" fill="none" viewBox="0 0 22 22"><circle cx="11" cy="11" r="10" stroke="#fff" strokeWidth="2"/><polygon points="9,7 15,11 9,15" fill="#fff"/></svg>
                Watch Video
              </a>
            </div>
          </div>
          {/* No illustration */}
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section id="how-it-works" style={{ background: 'none', padding: '5rem 0 4rem 0' }}>
        <h2 style={{ textAlign: 'center', fontSize: '2.2rem', fontWeight: 700, marginBottom: 48, color: '#fff', letterSpacing: '-1px' }}>How does it work?</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 32, maxWidth: 1100, margin: '0 auto' }}>
          {features.map((f, i) => (
            <Card key={i} title={f.title} icon={f.icon}>
              <p style={{ color: '#ccc', fontSize: '1.08rem', marginTop: 8 }}>{f.description}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* MVP FLOW SECTION */}
      <section style={{ background: 'none', padding: '5rem 0 4rem 0' }}>
        <h2 style={{ textAlign: 'center', fontSize: '2rem', fontWeight: 700, marginBottom: 40, color: '#fff' }}>MVP Flow</h2>
        <ol style={{ maxWidth: 800, margin: '0 auto', fontSize: '1.1rem', color: '#ccc', lineHeight: 1.7 }}>
          <li style={{ marginBottom: 12 }}><strong>1.</strong> Consultant registers Originator and Debtor (mock KYC)</li>
          <li style={{ marginBottom: 12 }}><strong>2.</strong> Manager approves registration and issues Fund (token)</li>
          <li style={{ marginBottom: 12 }}><strong>3.</strong> Investor buys Fund shares</li>
          <li><strong>4.</strong> Debtor pays (simulated) and the Fund redistributes to the Investor</li>
        </ol>
      </section>

      {/* AUDIENCE SECTION */}
      <section style={{ background: 'none', padding: '5rem 0 6rem 0' }}>
        <h2 style={{ textAlign: 'center', fontSize: '2rem', fontWeight: 700, marginBottom: 48, color: '#fff' }}>Who is it for?</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 32, maxWidth: 1100, margin: '0 auto' }}>
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

      {/* CALL TO ACTION SECTION */}
      <section style={{ background: 'linear-gradient(120deg, #764ba2 0%, #f0b90b 100%)', color: '#fff', padding: '4rem 0', textAlign: 'center' }}>
        <h2 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: 24 }}>Ready to transform fund management?</h2>
        <p style={{ fontSize: '1.2rem', marginBottom: 36, color: 'rgba(255,255,255,0.92)' }}>
          Sign up now and experience the most innovative tokenized fund platform on the market.
        </p>
        <a href="/register" style={{ textDecoration: 'none' }}>
          <Button variant="primary" size="lg">
            Create my account
          </Button>
        </a>
      </section>
    </MainLayout>
  );
};

export default HomePage;
