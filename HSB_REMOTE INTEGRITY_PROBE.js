// HSB Integrity Probe v2.1 (Anti-Fault Edition)
export default {
  manifest: {
    identity: { 
      id: 'ext.stress.probe', 
      name: 'Integrity Stress Probe', 
      version: '2.1.0', 
      description: 'Audit node for bus stability testing.', 
      author: 'HSB_LABS' 
    },
    permissions: ['event:emit', 'event:subscribe'],
    uiAreas: ['dashboard'],
    initOrder: 999,
    dependencies: [],
    isCritical: false,
    safeToDisable: true,
    pages: [{
      id: 'main',
      label: 'Stress Monitor',
      component: ({ sdk }) => {
        // Usar o React global injetado
        const [latency, setLatency] = window.React.useState(0);
        
        window.React.useEffect(() => {
          const unsub = sdk.subscribe('kernel:heartbeat', () => {
             sdk.emit('probe:ping', { ts: performance.now() });
          });
          const unsubPong = sdk.subscribe('probe:pong', (p) => setLatency(performance.now() - p.ts));
          return () => { unsub(); unsubPong(); };
        }, [sdk]);

        return window.React.createElement('div', { className: "p-4 font-mono text-[10px]" },
          window.React.createElement('div', { className: "flex justify-between" },
            window.React.createElement('span', { className: "text-slate-500 uppercase" }, "Bus Latency"),
            window.React.createElement('span', { className: "text-emerald-500 font-black" }, `${latency.toFixed(3)}ms`)
          )
        );
      },
      audit: { purpose: 'Stress Test', systemImpact: 'HIGH', securityLevel: 'SANDBOXED', requiredPermissions: [] }
    }]
  },
  init: (sdk) => {
    sdk.log('Integrity Probe Initialized.');
    sdk.subscribe('probe:ping', (p) => sdk.emit('probe:pong', p));
  }
};
