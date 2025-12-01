import React, { useState } from 'react';
import { Menu, X, HeartHandshake, CalendarCheck } from 'lucide-react';
import './App.css';

const navLinks = [
  { name: 'Quem Sou', href: '#quem-sou' },
  { name: 'Atendimento', href: '#atendimento' },
  { name: 'Contato', href: '#contato' },
];

const App = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('quem-sou');

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleNavLinkClick = (href) => {
    setActiveSection(href.substring(1));
    setIsMenuOpen(false);
  };

  const Navbar = () => (
    <nav className="navbar">
      <div className="navbar-container">
        <a href="#" className="logo">
          <HeartHandshake size={32} />
          <div>
            <span className="logo-title">Seu Espaço para o Bem-Estar</span>
            <p className="logo-subtitle">Psicologia Humanizada & Online</p>
          </div>
        </a>

        {/* Desktop */}
        <div className="nav-desktop">
          <div className="nav-links">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => handleNavLinkClick(link.href)}
                className={`nav-link ${
                  activeSection === link.href.substring(1) ? 'active' : ''
                }`}
              >
                {link.name}
              </a>
            ))}
          </div>

          <a href="#agendar" className="btn-primary">
            <CalendarCheck size={18} />
            Agendar Consulta
          </a>
        </div>

        {/* Mobile button */}
        <button className="menu-btn" onClick={toggleMenu}>
          {isMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="menu-mobile">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={() => handleNavLinkClick(link.href)}
              className="menu-link"
            >
              {link.name}
            </a>
          ))}
          <a href="#agendar" className="btn-primary mobile">
            Agendar Consulta
          </a>
        </div>
      )}
    </nav>
  );

  const ContentSection = ({ id, title, children }) => (
    <section id={id} className="section">
      <h2 className="section-title">{title}</h2>
      {children}
    </section>
  );

  return (
    <div className="app-container">
      <Navbar />

      <main className="main-content">
        <ContentSection id="quem-sou" title="Quem Eu Sou e Minha Abordagem">
          <p>
            Olá! Eu sou o(a) Dr(a). [Seu Nome], e minha missão é oferecer um
            espaço seguro e acolhedor para que você possa explorar seus
            sentimentos e desafios.
          </p>
        </ContentSection>

        <ContentSection id="atendimento" title="Como Funciona a Terapia Online">
          <div className="info-card">
            <CalendarCheck />
            <div>
              <h3>Duração da Sessão</h3>
              <p>Sessões individuais de 50 minutos.</p>
            </div>
          </div>

          <div className="info-card">
            <CalendarCheck />
            <div>
              <h3>Modalidade Online</h3>
              <p>Atendimento por plataformas seguras.</p>
            </div>
          </div>
        </ContentSection>

        <ContentSection id="contato" title="Entre em Contato">
          <p>Entre em contato para iniciar sua jornada.</p>
          <div className="contact-box">
            <p>Email: seuemail@dominio.com</p>
            <p>WhatsApp: (XX) XXXX-XXXX</p>
          </div>
        </ContentSection>

        <section id="agendar" className="cta">
          <h3>Inicie Sua Jornada de Bem-Estar</h3>
          <a href="#" className="cta-btn">
            <CalendarCheck />
            Agendar Agora
          </a>
        </section>
      </main>

      <footer className="footer">
        © 2025 Seu Espaço para o Bem-Estar — CRP: XXXXX
      </footer>
    </div>
  );
};

export default App;
