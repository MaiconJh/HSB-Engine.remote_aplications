import React from 'react';
import * as Lucide from 'lucide-react';

const e = React.createElement;

const CyberNetScannerView = ({ sdk }) => {
  const [packets, setPackets] = React.useState([]);
  const [jitter, setJitter] = React.useState(0);
  const [isScanning, setIsScanning] = React.useState(true);

  React.useEffect(() => {
    const unsub = sdk.subscribe('bazaar:update', (data) => {
      if (!isScanning) return;
      const newPacket = {
        id: Math.random().toString(36).substring(7).toUpperCase(),
        size: Math.floor(Math.random() * 1024) + 128,
        origin: data.productId || 'GATEWAY_NODE',
        timestamp: Date.now()
      };
      setPackets(prev => [newPacket, ...prev].slice(0, 5));
      setJitter(Math.random() * 5);
    });
    return unsub;
  }, [sdk, isScanning]);

  return e('div', { className: "p-6 bg-slate-950 border border-slate-800 rounded-[2rem] font-sans text-slate-400 shadow-2xl" },
    e('div', { className: "flex justify-between items-center mb-6 border-b border-slate-900 pb-4" },
      e('div', { className: "flex items-center gap-3" },
        e('div', { className: `p-2 rounded-xl transition-all ${isScanning ? 'bg-emerald-500/10 text-emerald-500' : 'bg-slate-900 text-slate-700'}` },
          e(Lucide.Radar, { size: 20, className: isScanning ? 'animate-spin' : '', style: { animationDuration: '3s' } })
        ),
        e('div', {},
          e('h3', { className: "text-xs font-black text-white uppercase tracking-widest" }, "Cyber-Net Scanner"),
          e('div', { className: "flex items-center gap-2 mt-0.5" },
            e('div', { className: `w-1.5 h-1.5 rounded-full ${isScanning ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' : 'bg-slate-700'}` }),
            e('span', { className: "text-[8px] font-mono text-slate-600 uppercase tracking-tighter" }, `Mode: ${isScanning ? 'PROMISCUOUS_ACTIVE' : 'IDLE'}`)
          )
        )
      ),
      e('button', { 
        onClick: () => setIsScanning(!isScanning),
        className: `px-4 py-1.5 text-[9px] font-black uppercase tracking-widest border transition-all ${isScanning ? 'border-rose-900/50 text-rose-500 hover:bg-rose-500/10' : 'border-emerald-900/50 text-emerald-500 hover:bg-emerald-500/10'}`
      }, isScanning ? 'Abort_Scan' : 'Resume_Probe')
    ),
    e('div', { className: "grid grid-cols-2 gap-4 mb-6" },
      e('div', { className: "p-3 bg-black/40 border border-slate-900 rounded-xl" },
        e('div', { className: "text-[8px] font-black text-slate-600 uppercase tracking-widest mb-1 flex items-center gap-1" }, e(Lucide.Activity, { size: 10 }), " Latency_Jitter"),
        e('div', { className: "text-lg font-mono font-black text-blue-500" }, jitter.toFixed(3), e('span', { className: "text-[10px]" }, "ms"))
      ),
      e('div', { className: "p-3 bg-black/40 border border-slate-800 rounded-xl" },
        e('div', { className: "text-[8px] font-black text-slate-600 uppercase tracking-widest mb-1 flex items-center gap-1" }, e(Lucide.Lock, { size: 10 }), " Encryption"),
        e('div', { className: "text-lg font-mono font-black text-emerald-500 uppercase" }, "AES_256")
      )
    ),
    e('div', { className: "space-y-2" },
      e('div', { className: "text-[8px] font-black text-slate-700 uppercase tracking-widest mb-2" }, "Live_Packet_Flux"),
      packets.map(p => e('div', { key: p.id, className: "flex items-center justify-between p-2 bg-slate-900/30 border border-white/5 rounded-lg group hover:border-blue-500/30 transition-all" },
        e('div', { className: "flex items-center gap-3" },
          e(Lucide.ArrowUpRight, { size: 12, className: "text-blue-500" }),
          e('div', { className: "flex flex-col" },
            e('span', { className: "text-[9px] font-black text-slate-200 uppercase tracking-tighter" }, `PKT_${p.id}`),
            e('span', { className: "text-[7px] font-mono text-slate-600 uppercase truncate w-32" }, p.origin)
          )
        ),
        e('div', { className: "text-right" },
          e('div', { className: "text-[9px] font-mono text-slate-400" }, `${p.size}b`),
          e('div', { className: "text-[7px] font-mono text-slate-700" }, new Date(p.timestamp).toLocaleTimeString())
        )
      ))
    )
  );
};

const definition = {
  manifest: {
    identity: {
      id: 'ext.net.scanner',
      name: 'Cyber-Net Scanner',
      version: '1.2.6',
      description: 'Advanced network packet introspection node.',
      author: 'HSB Security Group'
    },
    permissions: ['event:subscribe', 'event:emit', 'telemetry:read'],
    uiAreas: ['dashboard'],
    displayArea: 'System Core',
    pages: [{
      id: 'main',
      label: 'Network Monitor',
      component: CyberNetScannerView,
      audit: { purpose: 'Real-time analysis.', systemImpact: 'LOW', securityLevel: 'INTERNAL', requiredPermissions: ['event:subscribe'] }
    }],
    initOrder: 50,
    dependencies: [],
    isCritical: false,
    safeToDisable: true
  },
  component: CyberNetScannerView,
  init: (sdk) => {
    sdk.log('Cyber-Net Scanner node attached via Pure JS Bridge.');
  }
};

export default definition;
