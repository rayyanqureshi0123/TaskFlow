import { Link } from 'react-router-dom';
import { AlertOctagon, ArrowLeft, Home } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="auth-page" id="not-found-page">
      <div className="auth-card" style={{ textAlign: 'center' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          marginBottom: 'var(--space-6)'
        }}>
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            backgroundColor: 'rgba(248, 113, 113, 0.08)',
            border: '1px solid rgba(248, 113, 113, 0.2)',
            color: 'var(--color-red)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 20px rgba(248, 113, 113, 0.1)',
            animation: 'spin 12s linear infinite'
          }}>
            <AlertOctagon size={40} />
          </div>
        </div>

        <h1 style={{
          fontFamily: 'var(--font-family-roboto)',
          fontSize: 'var(--font-size-4xl)',
          fontWeight: 'var(--font-extrabold)',
          color: 'var(--color-text-primary)',
          marginBottom: 'var(--space-2)',
          background: 'linear-gradient(135deg, #f8fafc 30%, var(--color-indigo) 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          404
        </h1>
        
        <h2 style={{
          fontSize: 'var(--font-size-lg)',
          fontWeight: 'var(--font-bold)',
          color: 'var(--color-text-primary)',
          marginBottom: 'var(--space-3)'
        }}>
          Page Not Found
        </h2>
        
        <p style={{
          fontSize: 'var(--font-size-sm)',
          color: 'var(--color-text-secondary)',
          lineHeight: '1.6',
          marginBottom: 'var(--space-8)'
        }}>
          The page you are looking for doesn't exist, has been removed, or is temporarily unavailable.
        </p>

        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-3)'
        }}>
          <Link
            to="/"
            className="btn btn-primary btn-full"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 'var(--space-2)'
            }}
            id="not-found-home-btn"
          >
            <Home size={18} />
            Back to Dashboard
          </Link>
          
          <button
            onClick={() => window.history.back()}
            className="btn"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 'var(--space-2)',
              backgroundColor: 'transparent',
              border: '1px solid var(--color-border)',
              color: 'var(--color-text-secondary)',
              transition: 'all var(--transition-fast)'
            }}
            id="not-found-back-btn"
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--color-card-hover)';
              e.currentTarget.style.color = 'var(--color-text-primary)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = 'var(--color-text-secondary)';
            }}
          >
            <ArrowLeft size={18} />
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
