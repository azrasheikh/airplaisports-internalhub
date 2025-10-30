import { useEffect, useState } from 'react';
import { createClient } from '../lib/supabase/client';

export default function DbTest() {
  const [status, setStatus] = useState('Initializing...');
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const testDatabase = async () => {
      try {
        console.log('[DB-Test] Starting database test...');
        setStatus('Creating Supabase client...');
        const supabase = createClient();

        console.log('[DB-Test] Client created:', supabase ? 'SUCCESS' : 'NULL');

        if (!supabase) {
          setError('Failed to create Supabase client - check environment variables');
          setStatus('ERROR: No client');
          return;
        }

        setStatus('Client created! Testing connection...');

        // Test with timeout using Promise.race
        setStatus('Querying pages table...');
        console.log('[DB-Test] Starting query...');

        const queryPromise = supabase
          .from('pages')
          .select('id, title')
          .limit(3);

        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Query timeout after 10 seconds')), 10000)
        );

        try {
          const { data, error: queryError } = await Promise.race([queryPromise, timeoutPromise]);

          console.log('[DB-Test] Query completed');

          if (queryError) {
            console.error('[DB-Test] Query error:', queryError);
            setError(queryError.message);
            setStatus('ERROR: Query failed');
          } else {
            console.log('[DB-Test] Query success, data:', data);
            setResults(data || []);
            setStatus(`SUCCESS! Loaded ${data?.length || 0} pages`);
          }
        } catch (e) {
          console.error('[DB-Test] Query timeout or error:', e);
          setError(e.message);
          setStatus('ERROR: Query timeout or failed');
        }
      } catch (e) {
        console.error('[DB-Test] Test error:', e);
        setError(e.message);
        setStatus('ERROR: ' + e.message);
      }
    };

    testDatabase();
  }, []);

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace', backgroundColor: '#000', color: '#fff', minHeight: '100vh' }}>
      <h1>Database Connection Test</h1>

      <div style={{ marginTop: '20px', padding: '20px', backgroundColor: '#222', borderRadius: '8px' }}>
        <h2>Status:</h2>
        <p style={{ fontSize: '18px', color: status.includes('ERROR') ? '#f00' : status.includes('SUCCESS') ? '#0f0' : '#ff0' }}>
          {status}
        </p>
      </div>

      {error && (
        <div style={{ marginTop: '20px', padding: '20px', backgroundColor: '#400', borderRadius: '8px' }}>
          <h2>Error:</h2>
          <pre style={{ color: '#f00', whiteSpace: 'pre-wrap' }}>{error}</pre>
        </div>
      )}

      {results.length > 0 && (
        <div style={{ marginTop: '20px', padding: '20px', backgroundColor: '#042', borderRadius: '8px' }}>
          <h2>Results ({results.length} pages):</h2>
          {results.map(page => (
            <div key={page.id} style={{ marginTop: '10px', padding: '10px', backgroundColor: '#063', borderRadius: '4px' }}>
              <strong>ID:</strong> {page.id}<br />
              <strong>Title:</strong> {page.title}
            </div>
          ))}
        </div>
      )}

      <div style={{ marginTop: '30px', padding: '15px', backgroundColor: '#333', borderRadius: '4px', fontSize: '12px' }}>
        <p>This is a direct database test without authentication.</p>
        <p>If this works, the issue is with the authenticated queries.</p>
        <p>If this fails, the issue is with the Supabase SDK setup.</p>
      </div>
    </div>
  );
}
