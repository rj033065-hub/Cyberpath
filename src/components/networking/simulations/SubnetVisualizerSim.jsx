import { useState, useMemo } from "react";
import { Hash, Calculator, Check, AlertCircle, Info, Sparkles } from "lucide-react";

/**
 * Pure deterministic IPv4 subnet math helper functions
 */
export function ipToNumber(ip) {
  const parts = ip.split(".").map(Number);
  if (parts.length !== 4 || parts.some((p) => isNaN(p) || p < 0 || p > 255)) {
    return null;
  }
  return ((parts[0] << 24) >>> 0) + ((parts[1] << 16) >>> 0) + ((parts[2] << 8) >>> 0) + (parts[3] >>> 0);
}

export function numberToIp(num) {
  return [
    (num >>> 24) & 255,
    (num >>> 16) & 255,
    (num >>> 8) & 255,
    num & 255
  ].join(".");
}

export function cidrToMask(cidr) {
  if (cidr === 0) return 0;
  return ((0xffffffff << (32 - cidr)) >>> 0);
}

export function calculateSubnet(ipStr, cidr) {
  const ipNum = ipToNumber(ipStr);
  if (ipNum === null || cidr < 1 || cidr > 32) return null;

  const maskNum = cidrToMask(cidr);
  const networkNum = (ipNum & maskNum) >>> 0;
  const broadcastNum = (networkNum | (~maskNum >>> 0)) >>> 0;
  const totalAddresses = Math.pow(2, 32 - cidr);
  const usableHosts = cidr >= 31 ? 0 : Math.max(0, totalAddresses - 2);
  const firstUsableNum = cidr >= 31 ? null : (networkNum + 1) >>> 0;
  const lastUsableNum = cidr >= 31 ? null : (broadcastNum - 1) >>> 0;

  return {
    ip: ipStr,
    cidr,
    mask: numberToIp(maskNum),
    networkAddress: numberToIp(networkNum),
    broadcastAddress: numberToIp(broadcastNum),
    firstUsable: firstUsableNum !== null ? numberToIp(firstUsableNum) : "None (PtP/Host)",
    lastUsable: lastUsableNum !== null ? numberToIp(lastUsableNum) : "None (PtP/Host)",
    totalAddresses,
    usableHosts,
    hostBits: 32 - cidr,
    networkBits: cidr
  };
}

export default function SubnetVisualizerSim() {
  const [inputIp, setInputIp] = useState("192.168.1.0");
  const [selectedCidr, setSelectedCidr] = useState(26);

  const subnetInfo = useMemo(() => {
    return calculateSubnet(inputIp, selectedCidr) || calculateSubnet("192.168.1.0", 26);
  }, [inputIp, selectedCidr]);

  // Generate visual address block breakdown
  const sampleSlots = useMemo(() => {
    if (!subnetInfo) return [];
    const slots = [];
    const maxPreview = Math.min(subnetInfo.totalAddresses, 64);
    const netNum = ipToNumber(subnetInfo.networkAddress);

    for (let i = 0; i < maxPreview; i++) {
      const currentNum = netNum + i;
      const currentIp = numberToIp(currentNum);
      let type = "usable";
      if (i === 0) type = "network";
      else if (i === subnetInfo.totalAddresses - 1) type = "broadcast";

      slots.push({ index: i, ip: currentIp, type });
    }
    return slots;
  }, [subnetInfo]);

  return (
    <div className="space-y-4">
      {/* Visualizer Stage */}
      <div className="relative overflow-hidden rounded-2xl bg-surface p-6 border border-white/12 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-2 pb-4 mb-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <h3 className="text-sm font-semibold text-fg tracking-tight">Interactive IPv4 Subnet Visualizer</h3>
          </div>
          <span className="text-xs font-mono text-emerald-400 bg-emerald-950/40 px-2.5 py-1 rounded-md border border-emerald-800/40">
            CIDR & Binary Boundary Math
          </span>
        </div>

        {/* User Configuration Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 my-4 p-4 rounded-xl bg-page border border-white/10">
          <div>
            <label className="text-xs font-mono text-zinc-400 block mb-1">Base IPv4 Address</label>
            <input
              type="text"
              value={inputIp}
              onChange={(e) => setInputIp(e.target.value)}
              className="w-full bg-raised border border-white/12 px-3 py-1.5 rounded-lg text-xs font-mono text-fg focus:outline-none focus:border-emerald-500/60"
              placeholder="e.g. 192.168.1.0"
            />
          </div>

          <div>
            <label className="text-xs font-mono text-zinc-400 block mb-1">CIDR Prefix Length (/{selectedCidr})</label>
            <select
              value={selectedCidr}
              onChange={(e) => setSelectedCidr(Number(e.target.value))}
              className="w-full bg-raised border border-white/12 px-3 py-1.5 rounded-lg text-xs font-mono text-fg focus:outline-none focus:border-emerald-500/60 cursor-pointer"
            >
              {[16, 20, 22, 24, 25, 26, 27, 28, 29, 30].map((c) => (
                <option key={c} value={c} className="bg-zinc-900 text-fg">
                  /{c} — {calculateSubnet("10.0.0.0", c)?.mask} ({calculateSubnet("10.0.0.0", c)?.usableHosts} hosts)
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col justify-end">
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => { setInputIp("192.168.1.0"); setSelectedCidr(24); }}
                className="px-2.5 py-1.5 rounded-lg bg-raised hover:bg-white/10 border border-white/10 text-xs font-mono text-muted hover:text-fg"
              >
                /24 Preset
              </button>
              <button
                type="button"
                onClick={() => { setInputIp("10.50.0.0"); setSelectedCidr(26); }}
                className="px-2.5 py-1.5 rounded-lg bg-raised hover:bg-white/10 border border-white/10 text-xs font-mono text-muted hover:text-fg"
              >
                /26 Preset
              </button>
              <button
                type="button"
                onClick={() => { setInputIp("172.16.4.0"); setSelectedCidr(28); }}
                className="px-2.5 py-1.5 rounded-lg bg-raised hover:bg-white/10 border border-white/10 text-xs font-mono text-muted hover:text-fg"
              >
                /28 Preset
              </button>
            </div>
          </div>
        </div>

        {/* Subnet Metrics Cards */}
        {subnetInfo && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 my-4 text-xs font-mono">
            <div className="p-3 rounded-xl bg-raised/70 border border-white/5">
              <span className="text-[10px] text-zinc-400 block mb-0.5">Network ID</span>
              <span className="text-cyan-400 font-bold truncate block">{subnetInfo.networkAddress}</span>
              <span className="text-[10px] text-zinc-500">First Address</span>
            </div>

            <div className="p-3 rounded-xl bg-raised/70 border border-white/5">
              <span className="text-[10px] text-zinc-400 block mb-0.5">Subnet Mask</span>
              <span className="text-fg font-bold truncate block">{subnetInfo.mask}</span>
              <span className="text-[10px] text-zinc-500">/{subnetInfo.cidr}</span>
            </div>

            <div className="p-3 rounded-xl bg-raised/70 border border-white/5">
              <span className="text-[10px] text-zinc-400 block mb-0.5">First Usable Host</span>
              <span className="text-emerald-400 font-bold truncate block">{subnetInfo.firstUsable}</span>
              <span className="text-[10px] text-zinc-500">Gateway / Host 1</span>
            </div>

            <div className="p-3 rounded-xl bg-raised/70 border border-white/5">
              <span className="text-[10px] text-zinc-400 block mb-0.5">Last Usable Host</span>
              <span className="text-emerald-400 font-bold truncate block">{subnetInfo.lastUsable}</span>
              <span className="text-[10px] text-zinc-500">Final Host</span>
            </div>

            <div className="p-3 rounded-xl bg-raised/70 border border-white/5">
              <span className="text-[10px] text-zinc-400 block mb-0.5">Broadcast IP</span>
              <span className="text-amber-400 font-bold truncate block">{subnetInfo.broadcastAddress}</span>
              <span className="text-[10px] text-zinc-500">Last Address</span>
            </div>

            <div className="p-3 rounded-xl bg-raised/70 border border-white/5">
              <span className="text-[10px] text-zinc-400 block mb-0.5">Usable Hosts</span>
              <span className="text-purple-400 font-bold text-base block">{subnetInfo.usableHosts}</span>
              <span className="text-[10px] text-zinc-500">2^{subnetInfo.hostBits} - 2</span>
            </div>
          </div>
        )}

        {/* Visual IP Address Allocation Grid */}
        <div className="p-4 rounded-xl bg-page border border-white/12 space-y-3">
          <div className="flex flex-wrap items-center justify-between text-xs gap-2">
            <span className="font-mono text-zinc-400 uppercase tracking-wider text-[11px]">
              Subnet Slot Allocation ({sampleSlots.length} previewed of {subnetInfo?.totalAddresses} total)
            </span>
            <div className="flex items-center gap-3 text-[11px] font-mono">
              <span className="flex items-center gap-1 text-cyan-400"><span className="w-2 h-2 rounded-full bg-cyan-400" /> Network ID</span>
              <span className="flex items-center gap-1 text-emerald-400"><span className="w-2 h-2 rounded-full bg-emerald-400" /> Usable Host</span>
              <span className="flex items-center gap-1 text-amber-400"><span className="w-2 h-2 rounded-full bg-amber-400" /> Broadcast</span>
            </div>
          </div>

          <div className="grid grid-cols-4 sm:grid-cols-8 md:grid-cols-16 gap-1 max-h-48 overflow-y-auto p-1">
            {sampleSlots.map((slot) => (
              <div
                key={slot.index}
                className={`p-1.5 rounded text-center font-mono text-[10px] truncate border transition-all ${
                  slot.type === "network"
                    ? "bg-cyan-500/20 border-cyan-500/50 text-cyan-300 font-bold ring-1 ring-cyan-500/40"
                    : slot.type === "broadcast"
                    ? "bg-amber-500/20 border-amber-500/50 text-amber-300 font-bold ring-1 ring-amber-500/40"
                    : "bg-raised/80 border-white/5 text-zinc-300 hover:border-emerald-500/40 hover:text-emerald-300"
                }`}
                title={`${slot.ip} (${slot.type.toUpperCase()})`}
              >
                .{slot.ip.split(".").pop()}
              </div>
            ))}
          </div>

          <p className="text-xs text-zinc-300 leading-relaxed pt-2 border-t border-white/5 flex items-start gap-2">
            <Info className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>
              For a /{subnetInfo?.cidr} prefix, the first {subnetInfo?.networkBits} bits define the network route. The remaining {subnetInfo?.hostBits} bits provide {subnetInfo?.totalAddresses} total IP addresses (2^{subnetInfo?.hostBits}), of which {subnetInfo?.usableHosts} can be assigned to active network devices.
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
