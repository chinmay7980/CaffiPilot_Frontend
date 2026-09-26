import { useState, useEffect } from 'react';
import {
  Nav,
  Hero,
  EngineeringLoop,
  AgentWorkflowPreview,
  ContextStory,
  RecoveryStory,
  VerificationStory,
  FinalCTA,
} from './components';
import { WorkspaceShell } from './workspace/WorkspaceShell';

interface RouteInfo {
  isApp: boolean;
  subRoute: string;
}

function parseRoute(pathname: string, hash: string): RouteInfo {
  let path = pathname;
  if (hash && hash.startsWith('#/')) {
    path = hash.slice(1);
  }

  if (path === '/app' || path === '/app/') {
    return { isApp: true, subRoute: 'overview' };
  }
  if (path.startsWith('/app/')) {
    const sub = path.slice(5).replace(/\/$/, '');
    return { isApp: true, subRoute: sub || 'overview' };
  }

  const directAliases: Record<string, string> = {
    '/task': 'new-task',
    '/new-task': 'new-task',
    '/analysis': 'analysis',
    '/plan': 'plan',
    '/run': 'active-run',
    '/active-run': 'active-run',
    '/repositories': 'repositories',
    '/history': 'history',
    '/settings': 'settings',
  };

  if (directAliases[path]) {
    return { isApp: true, subRoute: directAliases[path] };
  }

  return { isApp: false, subRoute: '' };
}

export function App() {
  const [routeInfo, setRouteInfo] = useState<RouteInfo>(() => {
    if (typeof window !== 'undefined') {
      return parseRoute(window.location.pathname, window.location.hash);
    }
    return { isApp: false, subRoute: '' };
  });

  useEffect(() => {
    const handlePopState = () => {
      setRouteInfo(parseRoute(window.location.pathname, window.location.hash));
    };

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('hashchange', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('hashchange', handlePopState);
    };
  }, []);

  const navigateTo = (route: string) => {
    if (typeof window !== 'undefined') {
      window.history.pushState(null, '', route);
    }
    setRouteInfo(parseRoute(route, ''));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (routeInfo.isApp) {
    return (
      <WorkspaceShell
        onNavigateLanding={() => navigateTo('/')}
        initialSubRoute={routeInfo.subRoute}
      />
    );
  }

  return (
    <>
      <Nav onGetStarted={() => navigateTo('/app')} />
      <main>
        {/* Section 1: Hero + Hero Preview */}
        <Hero onGetStarted={() => navigateTo('/app')} />

        {/* Section 2: The Core Loop (Find -> Fix -> Verify) */}
        <EngineeringLoop />

        {/* Section 3: Watch the Agent Work (Interactive Full Workflow) */}
        <AgentWorkflowPreview />

        {/* Section 4: Context Intelligence */}
        <ContextStory />

        {/* Section 5: Failure Recovery (Fail -> Analyze -> Adapt -> Retry -> Pass) */}
        <RecoveryStory />

        {/* Section 6: Proof Before Done (Execution Evidence Bundle) */}
        <VerificationStory />

        {/* Section 7: Final Closing CTA */}
        <FinalCTA onGetStarted={() => navigateTo('/app')} />
      </main>

      {/* Production minimal footer */}
      <footer
        style={{
          borderTop: '1px solid var(--color-border)',
          padding: 'var(--space-2xl) var(--space-xl)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          maxWidth: 'var(--max-width-wide)',
          margin: '0 auto',
          fontSize: 'var(--text-code-sm)',
          color: 'var(--color-text-muted)',
          fontFamily: 'var(--font-mono)',
        }}
      >
        <div>
          Caffi<span style={{ color: 'var(--color-accent)' }}>Pilot</span> ☕
          &nbsp;— Find. Fix. Verify.
        </div>
        <div>Autonomous Software Engineering Agent</div>
      </footer>
    </>
  );
}
