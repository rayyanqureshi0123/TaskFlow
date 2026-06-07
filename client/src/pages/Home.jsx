import { Link } from 'react-router-dom';
import { CheckCircle2, Clock, BarChart3, Shield, ArrowRight, Zap, ListChecks } from 'lucide-react';

const Home = () => {
  return (
    <div className="home-page" id="home-page">

      <nav className="home-nav">
        <div className="home-nav-brand">
          <div className="home-nav-logo-icon">
            <ListChecks size={22} />
          </div>
          <span className="home-nav-logo-text">Task<span>Flow</span></span>
        </div>
        <div className="home-nav-links">
          <Link to="/login" className="home-nav-link" id="home-login-link">Sign In</Link>
          <Link to="/register" className="btn btn-primary home-nav-cta" id="home-register-link">
            Get Started
            <ArrowRight size={16} />
          </Link>
        </div>
      </nav>

      <section className="home-hero">
        <div className="home-hero-badge">
          <Zap size={14} />
          <span>Built with the MERN Stack</span>
        </div>

        <h1 className="home-hero-title">
          Manage Your Time.<br />
          <span className="home-hero-gradient">Master Your Life.</span>
        </h1>

        <p className="home-hero-subtitle">
          TaskFlow helps you organize, track, and complete your daily tasks with a beautiful interface, 
          real-time productivity insights, and secure cloud-based storage.
        </p>

        <div className="home-hero-actions">
          <Link to="/register" className="btn btn-primary home-hero-btn" id="home-hero-register-btn">
            Create Free Account
            <ArrowRight size={18} />
          </Link>
          <Link to="/login" className="btn btn-secondary home-hero-btn" id="home-hero-login-btn">
            Sign In
          </Link>
        </div>
      </section>

      <section className="home-features">
        <div className="home-features-grid">
          <div className="home-feature-card">
            <div className="home-feature-icon" style={{ background: 'rgba(99, 102, 241, 0.1)', color: '#6366f1' }}>
              <CheckCircle2 size={24} />
            </div>
            <h3>Full Task Control</h3>
            <p>Create, edit, delete, and toggle tasks between pending and completed with a single click.</p>
          </div>

          <div className="home-feature-card">
            <div className="home-feature-icon" style={{ background: 'rgba(52, 211, 153, 0.1)', color: '#34d399' }}>
              <Clock size={24} />
            </div>
            <h3>Smart Scheduling</h3>
            <p>Set precise due dates with AM/PM time selectors. Overdue tasks are flagged automatically in real-time.</p>
          </div>

          <div className="home-feature-card">
            <div className="home-feature-icon" style={{ background: 'rgba(251, 191, 36, 0.1)', color: '#fbbf24' }}>
              <BarChart3 size={24} />
            </div>
            <h3>Productivity Insights</h3>
            <p>Interactive charts visualize your task completion ratio. Track your productivity score over time.</p>
          </div>

          <div className="home-feature-card">
            <div className="home-feature-icon" style={{ background: 'rgba(248, 113, 113, 0.1)', color: '#f87171' }}>
              <Shield size={24} />
            </div>
            <h3>Secure by Design</h3>
            <p>JWT authentication, encrypted passwords, session-based tokens, and protected API routes keep your data safe.</p>
          </div>
        </div>
      </section>

      <footer className="home-footer">
        <p>&copy; {new Date().getFullYear()} TaskFlow. Built with React, Express, and MongoDB.</p>
      </footer>

    </div>
  );
};

export default Home;
