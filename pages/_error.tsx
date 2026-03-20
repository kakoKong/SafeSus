import type { NextPageContext } from 'next';

type ErrorProps = {
  statusCode: number;
};

function ErrorPage({ statusCode }: ErrorProps) {
  const title = statusCode === 404 ? 'Page not found' : 'Something went wrong';

  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        padding: '2rem',
        fontFamily:
          'Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif',
        background: '#fdf8fd',
        color: '#1c1b1f',
      }}
    >
      <section style={{ textAlign: 'center', maxWidth: 420 }}>
        <p style={{ fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#00327d' }}>
          Error {statusCode}
        </p>
        <h1 style={{ marginTop: 8, marginBottom: 12, fontSize: '2rem', lineHeight: 1.1 }}>SafeSus</h1>
        <p style={{ margin: 0, color: '#4b5563' }}>{title}. Please refresh or try again later.</p>
      </section>
    </main>
  );
}

ErrorPage.getInitialProps = ({ res, err }: NextPageContext): ErrorProps => {
  const statusCode = res?.statusCode ?? err?.statusCode ?? 500;
  return { statusCode };
};

export default ErrorPage;
