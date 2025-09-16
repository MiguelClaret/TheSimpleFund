// // src/pages/HomePage.tsx
// import React, { useEffect } from "react";
export default function HomePage() {
  return <div>HOME FUNCIONANDO</div>;
}
// const rawHTML = `
//   <!-- ====== INÍCIO DO CONTEÚDO HTML + CSS (sem <html>, <head>, <body>) ====== -->
//   <style>
//       * {
//           margin: 0;
//           padding: 0;
//           box-sizing: border-box;
//       }
      
//       body {
//           font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
//           background: linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4c1d95 100%);
//           color: #ffffff;
//           line-height: 1.6;
//           overflow-x: hidden;
//       }

//       .container {
//           max-width: 1200px;
//           margin: 0 auto;
//           padding: 0 20px;
//       }

//       /* Header */
//       header {
//           padding: 20px 0;
//           position: relative;
//           z-index: 100;
//           background: rgba(30, 27, 75, 0.9);
//           backdrop-filter: blur(10px);
//           border-bottom: 1px solid rgba(255, 255, 255, 0.1);
//       }

//       nav {
//           display: flex;
//           justify-content: space-between;
//           align-items: center;
//       }

//       .logo {
//           font-size: 1.8rem;
//           font-weight: 900;
//           letter-spacing: -0.5px;
//       }

//       .logo .simple {
//           color: #ffffff;
//       }

//       .logo .fund {
//           color: #a855f7;
//       }

//       .nav-links {
//           display: flex;
//           list-style: none;
//           gap: 40px;
//       }

//       .nav-links a {
//           color: #e5e7eb;
//           text-decoration: none;
//           font-weight: 500;
//           transition: all 0.3s ease;
//       }

//       .nav-links a:hover {
//           color: #a855f7;
//       }

//       .header-cta {
//           display: flex;
//           gap: 15px;
//           align-items: center;
//       }

//       .support-link {
//           color: #d1d5db;
//           text-decoration: none;
//           font-size: 0.9rem;
//       }

//       .sign-in-btn {
//           background: #6366f1;
//           color: white;
//           padding: 10px 20px;
//           border: none;
//           border-radius: 8px;
//           font-weight: 600;
//           cursor: pointer;
//           transition: all 0.3s ease;
//           text-decoration: none;
//       }

//       .sign-in-btn:hover {
//           background: #4f46e5;
//           transform: translateY(-1px);
//       }

//       /* Hero Section */
//       .hero {
//           padding: 80px 0 120px;
//           display: grid;
//           grid-template-columns: 1fr 1fr;
//           gap: 60px;
//           align-items: center;
//       }

//       .hero-content h1 {
//           font-size: 3.5rem;
//           font-weight: 900;
//           line-height: 1.1;
//           margin-bottom: 25px;
//       }

//       .hero-tagline {
//           color: #a855f7;
//           font-size: 1.1rem;
//           font-weight: 600;
//           margin-bottom: 15px;
//           text-transform: uppercase;
//           letter-spacing: 1px;
//       }

//       .hero-description {
//           font-size: 1.2rem;
//           color: #d1d5db;
//           margin-bottom: 40px;
//           line-height: 1.6;
//       }

//       .hero-buttons {
//           display: flex;
//           gap: 20px;
//           margin-bottom: 50px;
//       }

//       .btn-primary {
//           background: linear-gradient(135deg, #8b5cf6, #7c3aed);
//           color: white;
//           padding: 15px 30px;
//           border: none;
//           border-radius: 12px;
//           font-weight: 600;
//           font-size: 1.1rem;
//           cursor: pointer;
//           transition: all 0.3s ease;
//           text-decoration: none;
//           display: inline-flex;
//           align-items: center;
//           gap: 8px;
//       }

//       .btn-primary:hover {
//           transform: translateY(-2px);
//           box-shadow: 0 10px 30px rgba(139, 92, 246, 0.4);
//       }

//       .btn-secondary {
//           background: transparent;
//           color: #ffffff;
//           padding: 15px 30px;
//           border: 2px solid rgba(255, 255, 255, 0.2);
//           border-radius: 12px;
//           font-weight: 600;
//           font-size: 1.1rem;
//           cursor: pointer;
//           transition: all 0.3s ease;
//           text-decoration: none;
//           display: inline-flex;
//           align-items: center;
//           gap: 8px;
//       }

//       .btn-secondary:hover {
//           border-color: #8b5cf6;
//           background: rgba(139, 92, 246, 0.1);
//       }

//       .hero-visual {
//           position: relative;
//           display: flex;
//           justify-content: center;
//           align-items: center;
//       }

//       .card-stack {
//           position: relative;
//           transform: perspective(1000px) rotateY(-15deg) rotateX(10deg);
//       }

//       .floating-card {
//           width: 320px;
//           height: 200px;
//           background: linear-gradient(135deg, #1f2937, #374151);
//           border-radius: 20px;
//           position: relative;
//           box-shadow: 0 25px 50px rgba(0, 0, 0, 0.3);
//           border: 1px solid rgba(255, 255, 255, 0.1);
//           padding: 30px;
//           animation: float 6s ease-in-out infinite;
//       }

//       .floating-card::before {
//           content: '';
//           position: absolute;
//           top: 20px;
//           right: 20px;
//           width: 40px;
//           height: 25px;
//           background: linear-gradient(135deg, #8b5cf6, #7c3aed);
//           border-radius: 6px;
//       }

//       .card-logo {
//           position: absolute;
//           bottom: 20px;
//           left: 30px;
//           font-weight: 900;
//           font-size: 1.2rem;
//           color: #ffffff;
//       }

//       .card-number {
//           position: absolute;
//           bottom: 60px;
//           left: 30px;
//           color: #d1d5db;
//           font-family: 'Courier New', monospace;
//           font-size: 1.1rem;
//           letter-spacing: 2px;
//       }

//       @keyframes float {
//           0%, 100% { transform: perspective(1000px) rotateY(-15deg) rotateX(10deg) translateY(0px); }
//           50% { transform: perspective(1000px) rotateY(-15deg) rotateX(10deg) translateY(-20px); }
//       }

//       /* Stats Section */
//       .stats-section {
//           margin-top: 60px;
//       }

//       .stats-grid {
//           display: grid;
//           grid-template-columns: repeat(3, 1fr);
//           gap: 40px;
//       }

//       .stat-item {
//           background: rgba(255, 255, 255, 0.05);
//           padding: 30px;
//           border-radius: 16px;
//           text-align: center;
//           backdrop-filter: blur(10px);
//           border: 1px solid rgba(255, 255, 255, 0.1);
//           transition: all 0.3s ease;
//       }

//       .stat-item:hover {
//           transform: translateY(-5px);
//           border-color: rgba(139, 92, 246, 0.3);
//       }

//       .stat-value {
//           font-size: 2.5rem;
//           font-weight: 900;
//           color: #8b5cf6;
//           display: block;
//           margin-bottom: 8px;
//       }

//       .stat-label {
//           color: #d1d5db;
//           font-weight: 500;
//           text-transform: uppercase;
//           font-size: 0.9rem;
//           letter-spacing: 1px;
//       }

//       .stat-description {
//           color: #9ca3af;
//           font-size: 0.8rem;
//           margin-top: 8px;
//       }

//       /* Section Styling */
//       .section {
//           padding: 120px 0;
//       }

//       .section-header {
//           text-align: center;
//           margin-bottom: 80px;
//       }

//       .section-title {
//           font-size: 3rem;
//           font-weight: 900;
//           margin-bottom: 20px;
//           background: linear-gradient(135deg, #ffffff, #8b5cf6);
//           -webkit-background-clip: text;
//           -webkit-text-fill-color: transparent;
//       }

//       .section-subtitle {
//           font-size: 1.3rem;
//           color: #d1d5db;
//           max-width: 600px;
//           margin: 0 auto;
//       }

//       /* Features Grid */
//       .features-grid {
//           display: grid;
//           grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
//           gap: 30px;
//       }

//       .feature-card {
//           background: rgba(255, 255, 255, 0.05);
//           padding: 40px;
//           border-radius: 20px;
//           border: 1px solid rgba(255, 255, 255, 0.1);
//           backdrop-filter: blur(15px);
//           transition: all 0.4s ease;
//           position: relative;
//           overflow: hidden;
//       }

//       .feature-card::before {
//           content: '';
//           position: absolute;
//           top: 0;
//           left: 0;
//           width: 100%;
//           height: 100%;
//           background: linear-gradient(135deg, rgba(139, 92, 246, 0.1), transparent);
//           opacity: 0;
//           transition: opacity 0.4s ease;
//       }

//       .feature-card:hover::before {
//           opacity: 1;
//       }

//       .feature-card:hover {
//           transform: translateY(-10px);
//           border-color: rgba(139, 92, 246, 0.3);
//           box-shadow: 0 20px 40px rgba(139, 92, 246, 0.2);
//       }

//       .feature-icon {
//           width: 60px;
//           height: 60px;
//           background: linear-gradient(135deg, #8b5cf6, #7c3aed);
//           border-radius: 16px;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           margin-bottom: 24px;
//           font-size: 24px;
//           position: relative;
//           z-index: 2;
//       }

//       .feature-card h3 {
//           font-size: 1.5rem;
//           font-weight: 700;
//           margin-bottom: 16px;
//           position: relative;
//           z-index: 2;
//       }

//       .feature-card p {
//           color: #d1d5db;
//           line-height: 1.7;
//           position: relative;
//           z-index: 2;
//       }

//       /* How It Works */
//       .steps-container {
//           position: relative;
//       }

//       .steps-grid {
//           display: grid;
//           grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
//           gap: 40px;
//       }

//       .step-card {
//           background: rgba(255, 255, 255, 0.05);
//           padding: 40px 30px;
//           border-radius: 20px;
//           text-align: center;
//           border: 1px solid rgba(255, 255, 255, 0.1);
//           backdrop-filter: blur(15px);
//           position: relative;
//           transition: all 0.3s ease;
//       }

//       .step-card:hover {
//           transform: translateY(-5px);
//           border-color: rgba(139, 92, 246, 0.3);
//       }

//       .step-number {
//           width: 60px;
//           height: 60px;
//           background: linear-gradient(135deg, #8b5cf6, #7c3aed);
//           border-radius: 50%;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           font-size: 1.5rem;
//           font-weight: bold;
//           margin: 0 auto 24px;
//           position: relative;
//       }

//       .step-number::after {
//           content: '';
//           position: absolute;
//           top: -8px;
//           left: -8px;
//           right: -8px;
//           bottom: -8px;
//           border: 2px solid rgba(139, 92, 246, 0.3);
//           border-radius: 50%;
//           animation: pulse-ring 2s infinite;
//       }

//       @keyframes pulse-ring {
//           0% { transform: scale(1); opacity: 1; }
//           100% { transform: scale(1.3); opacity: 0; }
//       }

//       .step-card h3 {
//           font-size: 1.3rem;
//           font-weight: 600;
//           margin-bottom: 16px;
//       }

//       .step-card p {
//           color: #d1d5db;
//           line-height: 1.6;
//       }

//       /* Technology Cards */
//       .tech-grid {
//           display: grid;
//           grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
//           gap: 30px;
//       }

//       .tech-card {
//           background: rgba(255, 255, 255, 0.05);
//           padding: 40px;
//           border-radius: 20px;
//           text-align: center;
//           border: 1px solid rgba(255, 255, 255, 0.1);
//           backdrop-filter: blur(15px);
//           transition: all 0.3s ease;
//       }

//       .tech-card:hover {
//           transform: translateY(-5px);
//           border-color: rgba(139, 92, 246, 0.3);
//       }

//       .tech-icon {
//           width: 80px;
//           height: 80px;
//           background: linear-gradient(135deg, #8b5cf6, #7c3aed);
//           border-radius: 20px;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           font-size: 2rem;
//           margin: 0 auto 24px;
//       }

//       .tech-card h3 {
//           font-size: 1.4rem;
//           font-weight: 600;
//           margin-bottom: 16px;
//       }

//       .tech-card p {
//           color: #d1d5db;
//           line-height: 1.6;
//       }

//       /* CTA Section */
//       .cta-section {
//           background: linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(124, 58, 237, 0.1));
//           border-radius: 30px;
//           padding: 80px 40px;
//           text-align: center;
//           margin: 80px 0;
//           border: 1px solid rgba(139, 92, 246, 0.2);
//       }

//       .cta-section h2 {
//           font-size: 2.8rem;
//           font-weight: 900;
//           margin-bottom: 24px;
//       }

//       .cta-section p {
//           font-size: 1.3rem;
//           color: #d1d5db;
//           margin-bottom: 40px;
//           max-width: 600px;
//           margin-left: auto;
//           margin-right: auto;
//       }

//       .cta-buttons {
//           display: flex;
//           gap: 20px;
//           justify-content: center;
//           flex-wrap: wrap;
//       }

//       /* Footer */
//       footer {
//           padding: 80px 0 40px;
//           border-top: 1px solid rgba(255, 255, 255, 0.1);
//           background: rgba(30, 27, 75, 0.5);
//       }

//       .footer-grid {
//           display: grid;
//           grid-template-columns: 2fr repeat(3, 1fr);
//           gap: 60px;
//           margin-bottom: 40px;
//       }

//       .footer-brand h3 {
//           font-size: 1.5rem;
//           font-weight: 900;
//           margin-bottom: 16px;
//       }

//       .footer-brand p {
//           color: #d1d5db;
//           line-height: 1.7;
//           margin-bottom: 24px;
//       }

//       .footer-column h4 {
//           font-weight: 600;
//           margin-bottom: 20px;
//           font-size: 1.1rem;
//       }

//       .footer-column a {
//           display: block;
//           color: #d1d5db;
//           text-decoration: none;
//           margin-bottom: 12px;
//           transition: color 0.3s ease;
//       }

//       .footer-column a:hover {
//           color: #8b5cf6;
//       }

//       .footer-bottom {
//           text-align: center;
//           padding-top: 40px;
//           border-top: 1px solid rgba(255, 255, 255, 0.1);
//           color: #9ca3af;
//       }

//       /* Mobile Responsive */
//       @media (max-width: 768px) {
//           .hero {
//               grid-template-columns: 1fr;
//               gap: 40px;
//               text-align: center;
//           }

//           .hero-content h1 {
//               font-size: 2.5rem;
//           }

//           .hero-buttons {
//               justify-content: center;
//           }

//           .stats-grid {
//               grid-template-columns: 1fr;
//           }

//           .features-grid {
//               grid-template-columns: 1fr;
//           }

//           .nav-links {
//               display: none;
//           }

//           .section-title {
//               font-size: 2.2rem;
//           }

//           .footer-grid {
//               grid-template-columns: 1fr;
//               gap: 40px;
//           }

//           .cta-buttons {
//               flex-direction: column;
//               align-items: center;
//           }
//       }
//   </style>

//   <header>
//       <nav class="container">
//           <div class="logo">
//               <span class="simple">THE SIMPLE</span> <span class="fund">FUND.</span>
//           </div>
//           <ul class="nav-links">
//               <li><a href="#about">About</a></li>
//               <li><a href="#features">Features</a></li>
//               <li><a href="#support">Support</a></li>
//           </ul>
//           <div class="header-cta">
//               <a href="#support" class="support-link">Need Help? Support Us</a>
//               <a href="/login" class="sign-in-btn">Sign In</a>
//           </div>
//       </nav>
//   </header>

//   <main>
//       <section class="hero" id="about">
//           <div class="container">
//               <div class="hero-content">
//                   <div class="hero-tagline">Security | Convenience | Tokenization</div>
//                   <h1>
//                       THE SIMPLE<br>
//                       FUND.
//                   </h1>
//                   <p class="hero-description">
//                       Transform receivables into tokenized investments. 
//                       Experience transparent, efficient fund management on Stellar blockchain.
//                   </p>
                  
//                   <div class="hero-buttons">
//                       <a href="#explore" class="btn-primary">
//                           Explore Platform
//                           <span>→</span>
//                       </a>
//                       <a href="#video" class="btn-secondary">
//                           🎥 Watch Video
//                       </a>
//                   </div>
//               </div>

//               <div class="hero-visual">
//                   <div class="card-stack">
//                       <div class="floating-card">
//                           <div class="card-number">•••• •••• •••• 1234</div>
//                           <div class="card-logo">TSF</div>
//                       </div>
//                   </div>
//               </div>
//           </div>
//       </section>

//       <section class="stats-section" id="explore">
//           <div class="container">
//               <div class="stats-grid">
//                   <div class="stat-item">
//                       <span class="stat-value">100%</span>
//                       <span class="stat-label">Transparent</span>
//                       <p class="stat-description">Complete blockchain transparency</p>
//                   </div>
//                   <div class="stat-item">
//                       <span class="stat-value">&lt; $0.01</span>
//                       <span class="stat-label">Transaction Fees</span>
//                       <p class="stat-description">Ultra-low cost operations</p>
//                   </div>
//                   <div class="stat-item">
//                       <span class="stat-value">3-5s</span>
//                       <span class="stat-label">Settlement Time</span>
//                       <p class="stat-description">Near-instant transactions</p>
//                   </div>
//               </div>
//           </div>
//       </section>

//       <section class="section" id="features">
//           <div class="container">
//               <div class="section-header">
//                   <h2 class="section-title">Revolutionary Features</h2>
//                   <p class="section-subtitle">Transform traditional fund management with cutting-edge blockchain technology</p>
//               </div>
              
//               <div class="features-grid">
//                   <div class="feature-card">
//                       <div class="feature-icon">🏦</div>
//                       <h3>Tokenized Fund Shares</h3>
//                       <p>Convert fund shares into fungible digital tokens on Stellar blockchain, enabling transparent ownership and instant transferability.</p>
//                   </div>
                  
//                   <div class="feature-card">
//                       <div class="feature-icon">🔍</div>
//                       <h3>Complete Transparency</h3>
//                       <p>All receivables, payments, and distributions are recorded on-chain, providing real-time visibility and audit trails.</p>
//                   </div>
                  
//                   <div class="feature-card">
//                       <div class="feature-icon">⚡</div>
//                       <h3>Instant Distribution</h3>
//                       <p>Automated smart contract execution eliminates manual processes, enabling instant distribution of returns to investors.</p>
//                   </div>
                  
//                   <div class="feature-card">
//                       <div class="feature-icon">💱</div>
//                       <h3>Secondary Market</h3>
//                       <p>Trade fund shares on Stellar DEX, creating liquidity for traditionally illiquid investments and early exit opportunities.</p>
//                   </div>
                  
//                   <div class="feature-card">
//                       <div class="feature-icon">🛡️</div>
//                       <h3>Enhanced Security</h3>
//                       <p>Leverage Stellar's proven security model and smart contracts to ensure safe, tamper-proof fund operations.</p>
//                   </div>
                  
//                   <div class="feature-card">
//                       <div class="feature-icon">💰</div>
//                       <h3>Cost Efficiency</h3>
//                       <p>Drastically reduce operational costs by eliminating intermediaries and automating fund management processes.</p>
//                   </div>
//               </div>
//           </div>
//       </section>

//       <section class="section" id="how-it-works">
//           <div class="container">
//               <div class="section-header">
//                   <h2 class="section-title">How It Works</h2>
//                   <p class="section-subtitle">Simple, secure, and transparent fund management in four easy steps</p>
//               </div>
              
//               <div class="steps-container">
//                   <div class="steps-grid">
//                       <div class="step-card">
//                           <div class="step-number">1</div>
//                           <h3>Fund Registration</h3>
//                           <p>Consultants register originators and payers, creating comprehensive fund structures with all necessary documentation.</p>
//                       </div>
                      
//                       <div class="step-card">
//                           <div class="step-number">2</div>
//                           <h3>Tokenization</h3>
//                           <p>Fund managers approve registrations and issue tokenized shares on Stellar blockchain, creating digital ownership certificates.</p>
//                       </div>
                      
//                       <div class="step-card">
//                           <div class="step-number">3</div>
//                           <h3>Investment & Trading</h3>
//                           <p>Investors purchase tokenized shares and can trade them on secondary markets, providing unprecedented liquidity.</p>
//                       </div>
                      
//                       <div class="step-card">
//                           <div class="step-number">4</div>
//                           <h3>Automated Distribution</h3>
//                           <p>Smart contracts automatically distribute returns to all shareholders proportionally, ensuring transparency and efficiency.</p>
//                       </div>
//                   </div>
//               </div>
//           </div>
//       </section>

//       <section class="section" id="technology">
//           <div class="container">
//               <div class="section-header">
//                   <h2 class="section-title">Built on Stellar Blockchain</h2>
//                   <p class="section-subtitle">Leveraging enterprise-grade blockchain technology for maximum reliability and performance</p>
//               </div>
              
//               <div class="tech-grid">
//                   <div class="tech-card">
//                       <div class="tech-icon">⭐</div>
//                       <h3>Stellar Network</h3>
//                       <p>Fast, low-cost, and environmentally friendly blockchain platform designed for financial applications.</p>
//                   </div>
                  
//                   <div class="tech-card">
//                       <div class="tech-icon">📜</div>
//                       <h3>Soroban Smart Contracts</h3>
//                       <p>Advanced smart contract platform enabling complex financial logic and automated fund operations.</p>
//                   </div>
                  
//                   <div class="tech-card">
//                       <div class="tech-icon">🔄</div>
//                       <h3>Stellar Consensus Protocol</h3>
//                       <p>Proven consensus mechanism ensuring security, reliability, and consistent network performance.</p>
//                   </div>
//               </div>
//           </div>
//       </section>

//       <section class="container">
//           <div class="cta-section">
//               <h2>Don't rely on luck.<br>Invest with strategy.</h2>
//               <p>Join the future of tokenized investments and experience transparent, efficient, and accessible fund management on blockchain.</p>
              
//               <div class="cta-buttons">
//                   <a href="#start" class="btn-primary">Start Your Journey</a>
//                   <a href="#demo" class="btn-secondary">Book a Demo</a>
//               </div>
//           </div>
//       </section>
//   </main>

//   <footer id="support">
//       <div class="container">
//           <div class="footer-grid">
//               <div class="footer-brand">
//                   <h3>The Simple Fund</h3>
//                   <p>Revolutionizing fund management through blockchain technology, making investments transparent, efficient, and accessible to everyone.</p>
//               </div>
              
//               <div class="footer-column">
//                   <h4>Platform</h4>
//                   <a href="#consultants">For Consultants</a>
//                   <a href="#managers">For Fund Managers</a>
//                   <a href="#investors">For Investors</a>
//                   <a href="#api">API Documentation</a>
//               </div>
              
//               <div class="footer-column">
//                   <h4>Resources</h4>
//                   <a href="#whitepaper">Whitepaper</a>
//                   <a href="#docs">Documentation</a>
//                   <a href="#blog">Blog</a>
//                   <a href="#support">Support</a>
//               </div>
              
//               <div class="footer-column">
//                   <h4>Company</h4>
//                   <a href="#about">About Us</a>
//                   <a href="#careers">Careers</a>
//                   <a href="#contact">Contact</a>
//                   <a href="#legal">Legal</a>
//               </div>
//           </div>
          
//           <div class="footer-bottom">
//               <p>&copy; 2025 The Simple Fund. All rights reserved. | Powered by Stellar Blockchain</p>
//           </div>
//       </div>
//   </footer>
//   <!-- ====== FIM DO CONTEÚDO HTML + CSS ====== -->
// `;

// export default function HomePage() {
//   useEffect(() => {
//     // === Scripts do seu HTML, adaptados para React ===

//     // Intersection Observer (anima cards quando entram na viewport)
//     const observerOptions = {
//       threshold: 0.1,
//       rootMargin: "0px 0px -50px 0px",
//     };

//     const observer = new IntersectionObserver((entries) => {
//       entries.forEach((entry) => {
//         if (entry.isIntersecting) {
//           const el = entry.target as HTMLElement;
//           el.style.opacity = "1";
//           el.style.transform = "translateY(0)";
//         }
//       });
//     }, observerOptions);

//     const animated = document.querySelectorAll(
//       ".feature-card, .step-card, .tech-card, .stat-item"
//     );
//     animated.forEach((card) => {
//       const el = card as HTMLElement;
//       el.style.opacity = "0";
//       el.style.transform = "translateY(30px)";
//       el.style.transition = "all 0.6s ease";
//       observer.observe(el);
//     });

//     // Smooth scrolling para âncoras internas
//     const anchors = Array.from(
//       document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]')
//     );
//     const handleAnchorClick = (e: Event) => {
//       e.preventDefault();
//       const href = (e.currentTarget as HTMLAnchorElement).getAttribute("href");
//       if (!href) return;
//       const target = document.querySelector(href);
//       if (target) {
//         target.scrollIntoView({ behavior: "smooth", block: "start" });
//       }
//     };
//     anchors.forEach((a) => a.addEventListener("click", handleAnchorClick));

//     // Parallax do cartão no hero
//     const handleScroll = () => {
//       const scrolled = window.pageYOffset;
//       const card = document.querySelector(".floating-card") as HTMLElement | null;
//       if (card) {
//         const speed = scrolled * 0.5;
//         card.style.transform =
//           `perspective(1000px) rotateY(-15deg) rotateX(10deg) translateY(${speed}px)`;
//       }
//     };
//     window.addEventListener("scroll", handleScroll);

//     // cleanup
//     return () => {
//       observer.disconnect();
//       anchors.forEach((a) => a.removeEventListener("click", handleAnchorClick));
//       window.removeEventListener("scroll", handleScroll);
//     };
//   }, []);

//   return <div dangerouslySetInnerHTML={{ __html: rawHTML }} />;
// }
