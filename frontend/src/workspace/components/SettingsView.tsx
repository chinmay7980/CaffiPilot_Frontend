import { useState } from 'react';
import { Badge } from '../../components/Badge/Badge';
import { Button } from '../../components/Button/Button';
import styles from './NewTaskView.module.css';

export function SettingsView() {
  const [gitHubConnected, setGitHubConnected] = useState(true);

  return (
    <div className={styles.container}>
      <div className={styles.headingArea}>
        <h1 className={styles.title}>System Settings</h1>
        <p className={styles.subtitle}>
          Workspace configuration, git repository providers, and developer preferences.
        </p>
      </div>

      <div className={styles.formCard}>
        <div className={styles.fieldGroup}>
          <span className={styles.label}>GitHub Integration</span>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: 'var(--space-md)',
              backgroundColor: 'var(--color-surface-2)',
              borderRadius: 'var(--radius)',
              border: '1px solid var(--color-border)',
            }}
          >
            <div>
              <div style={{ color: 'var(--color-text-primary)', fontWeight: 500 }}>
                GitHub Account
              </div>
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 11,
                  color: 'var(--color-text-muted)',
                }}
              >
                {gitHubConnected ? 'Connected as mock-developer' : 'Not connected'}
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <Badge variant={gitHubConnected ? 'verified' : 'neutral'}>
                {gitHubConnected ? 'Connected' : 'Disconnected'}
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setGitHubConnected(!gitHubConnected)}
              >
                {gitHubConnected ? 'Disconnect' : 'Connect'}
              </Button>
            </div>
          </div>
        </div>

        <div className={styles.fieldGroup}>
          <span className={styles.label}>Sandbox Environment</span>
          <div
            style={{
              padding: 'var(--space-md)',
              backgroundColor: 'var(--color-surface-2)',
              borderRadius: 'var(--radius)',
              border: '1px solid var(--color-border)',
              fontFamily: 'var(--font-mono)',
              fontSize: 11,
              color: 'var(--color-text-secondary)',
              lineHeight: 1.6,
            }}
          >
            Container runtime: sandbox-01 (Isolated virtual filesystem)
            <br />
            Verification engine: Pytest / Jest / Native build tools
          </div>
        </div>
      </div>
    </div>
  );
}
