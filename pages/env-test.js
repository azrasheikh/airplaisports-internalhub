export default function EnvTest() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const hasAnonKey = !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace', backgroundColor: '#000', color: '#fff', minHeight: '100vh' }}>
      <h1>Environment Variables Test</h1>
      <div style={{ marginTop: '20px', padding: '20px', backgroundColor: '#222', borderRadius: '8px' }}>
        <p><strong>NEXT_PUBLIC_SUPABASE_URL:</strong></p>
        <p style={{ color: supabaseUrl ? '#0f0' : '#f00' }}>
          {supabaseUrl || '❌ MISSING'}
        </p>

        <p style={{ marginTop: '20px' }}><strong>NEXT_PUBLIC_SUPABASE_ANON_KEY:</strong></p>
        <p style={{ color: hasAnonKey ? '#0f0' : '#f00' }}>
          {hasAnonKey ? '✅ Present (hidden for security)' : '❌ MISSING'}
        </p>

        <div style={{ marginTop: '30px', padding: '15px', backgroundColor: '#333', borderRadius: '4px' }}>
          {supabaseUrl && hasAnonKey ? (
            <p style={{ color: '#0f0' }}>✅ Both environment variables are loaded!</p>
          ) : (
            <p style={{ color: '#f00' }}>❌ Environment variables are missing. Check Vercel settings.</p>
          )}
        </div>
      </div>
    </div>
  );
}
