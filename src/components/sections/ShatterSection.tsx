"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform, MotionValue } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { FileText, Search, ShieldCheck, Globe, MousePointer, Download, ArrowRight, Terminal, Code, Folder, Compass } from "lucide-react";

// Generate seamless geometric polygon shards across a grid (6x7 grid with jittered nodes)
interface ShardDef {
  id: number;
  clipPath: string;
  cx: number; // center x %
  cy: number; // center y %
  dist: number; // distance from center (50, 50)
  angle: number; // angle from center in radians
  delay: number; // normalized delay based on distance
}

function createShards(): ShardDef[] {
  const rows = 6;
  const cols = 7;
  const grid: [number, number][][] = [];

  for (let r = 0; r <= rows; r++) {
    const rowPoints: [number, number][] = [];
    for (let c = 0; c <= cols; c++) {
      let x = (c / cols) * 100;
      let y = (r / rows) * 100;

      if (c > 0 && c < cols && r > 0 && r < rows) {
        const seed = (r * 13 + c * 37) % 100;
        const jitterX = ((seed % 7) - 3) * 2.5;
        const jitterY = (((seed * 3) % 7) - 3) * 2.5;
        x = Math.max(1, Math.min(99, x + jitterX));
        y = Math.max(1, Math.min(99, y + jitterY));
      }
      rowPoints.push([x, y]);
    }
    grid.push(rowPoints);
  }

  const shards: ShardDef[] = [];
  let id = 0;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const p1 = grid[r][c];
      const p2 = grid[r][c + 1];
      const p3 = grid[r + 1][c + 1];
      const p4 = grid[r + 1][c];

      // Triangle 1: p1, p2, p3
      const t1Points = [p1, p2, p3];
      const cx1 = (p1[0] + p2[0] + p3[0]) / 3;
      const cy1 = (p1[1] + p2[1] + p3[1]) / 3;
      const dist1 = Math.hypot(cx1 - 50, cy1 - 50);
      const angle1 = Math.atan2(cy1 - 50, cx1 - 50);

      shards.push({
        id: id++,
        clipPath: `polygon(${t1Points.map(([x, y]) => `${x.toFixed(2)}% ${y.toFixed(2)}%`).join(", ")})`,
        cx: cx1,
        cy: cy1,
        dist: dist1,
        angle: angle1,
        delay: Math.max(0, 1 - dist1 / 60),
      });

      // Triangle 2: p1, p3, p4
      const t2Points = [p1, p3, p4];
      const cx2 = (p1[0] + p3[0] + p4[0]) / 3;
      const cy2 = (p1[1] + p3[1] + p4[1]) / 3;
      const dist2 = Math.hypot(cx2 - 50, cy2 - 50);
      const angle2 = Math.atan2(cy2 - 50, cx2 - 50);

      shards.push({
        id: id++,
        clipPath: `polygon(${t2Points.map(([x, y]) => `${x.toFixed(2)}% ${y.toFixed(2)}%`).join(", ")})`,
        cx: cx2,
        cy: cy2,
        dist: dist2,
        angle: angle2,
        delay: Math.max(0, 1 - dist2 / 60),
      });
    }
  }

  return shards;
}

const SHARDS = createShards();

function DocumentWindow() {
  return (
    <div className="w-full max-w-xl bg-[#0f172a]/95 border border-[#334155] rounded-xl shadow-2xl overflow-hidden backdrop-blur-md text-[#f8fafc] font-sans">
      {/* Window Header */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#1e293b]/90 border-b border-[#334155]">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#ef4444]" />
          <div className="w-3 h-3 rounded-full bg-[#f59e0b]" />
          <div className="w-3 h-3 rounded-full bg-[#10b981]" />
        </div>
        <div className="flex items-center gap-2 text-xs font-mono text-[#94a3b8] bg-[#0f172a] px-3 py-1 rounded-md border border-[#334155]/60">
          <FileText className="w-3.5 h-3.5 text-[#38bdf8]" />
          <span>about-nova-2.0.pdf</span>
          <span className="text-[9px] bg-[#065f46] text-[#34d399] px-1.5 py-0.5 rounded font-bold uppercase">
            SECURE
          </span>
        </div>
        <div className="flex items-center gap-3 text-[#94a3b8]">
          <Search className="w-4 h-4" />
          <span className="text-xs font-mono">1 / 1</span>
        </div>
      </div>

      {/* Document Content */}
      <div className="p-6 space-y-5">
        <div className="p-5 rounded-lg bg-gradient-to-r from-[#1e1b4b]/90 via-[#312e81]/70 to-[#1e1b4b]/90 border border-[#4338ca]/50 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-3 opacity-20 text-[#818cf8]">
            <Globe className="w-20 h-20" />
          </div>

          <div className="relative z-10 space-y-1.5">
            <span className="text-[9px] font-mono font-bold tracking-[0.2em] text-[#818cf8] uppercase bg-[#312e81]/90 px-2.5 py-0.5 rounded border border-[#4945ff]/40">
              OFFICIAL BRIEFING
            </span>
            <h2 className="text-xl sm:text-3xl font-extrabold tracking-tight text-white font-cinzel pt-1">
              Project Nova <span className="text-[#38bdf8]">2.0</span>
            </h2>
            <p className="text-[11px] font-mono text-[#93c5fd] tracking-widest uppercase">
              INTER-UNIVERSITY INNOVATION CHAMPIONSHIP
            </p>
          </div>
        </div>

        <div className="p-4 rounded-lg bg-[#1e293b]/70 border border-[#334155]/70 space-y-2">
          <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase text-[#38bdf8] tracking-wider">
            <ShieldCheck className="w-4 h-4 text-[#38bdf8]" />
            <span>01 INTRODUCTION</span>
          </div>
          <p className="text-xs text-[#cbd5e1] leading-relaxed font-sans">
            Project Nova 2.0 is Sri Lanka&apos;s premier student-led inter-university innovation
            championship, returning for its second edition. This initiative brings together the
            brightest minds from universities across the island to solve critical real-world
            problems using cloud tech and visionary strategies.
          </p>
        </div>
      </div>
    </div>
  );
}

function DesktopOverlay() {
  return (
    <div className="w-full h-full relative bg-[#030712] overflow-hidden flex flex-col justify-between p-3 sm:p-5 font-sans select-none">
      {/* Desktop Background Constellation Grid */}
      <div className="absolute inset-0 bg-[#030712] bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:28px_28px] opacity-80 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.12)_0%,transparent_70%)] pointer-events-none" />

      {/* Top macOS Status Bar (Matching Screenshot 1 & 4) */}
      <div className="relative z-10 w-full flex items-center justify-between px-4 py-1.5 bg-[#0f172a]/90 border-b border-[#1e293b] text-xs font-mono text-[#cbd5e1] backdrop-blur-md rounded-t-lg">
        <div className="flex items-center gap-4">
          <span className="font-bold text-[#38bdf8]">Activities</span>
          <span className="text-[11px] text-[#64748b] hidden sm:inline">Project Nova OS v2.0</span>
        </div>
        <div className="text-center font-bold text-[#e2e8f0] text-xs">
          Jul 22 00:46
        </div>
        <div className="flex items-center gap-3 text-[#94a3b8] text-xs">
          <span>📶</span>
          <span>🔊</span>
          <span className="text-[10px] bg-[#1e293b] px-1.5 py-0.5 rounded text-[#38bdf8] font-bold">100%</span>
        </div>
      </div>

      {/* Desktop Workspace Area with Icon & Briefing Card */}
      <div className="relative z-10 flex-1 w-full flex items-center justify-center p-4 my-2">
        {/* Top-Left Shortcut Icon */}
        <div className="absolute top-4 left-4 hidden sm:flex flex-col items-center gap-1.5 p-2 rounded-lg hover:bg-[#1e293b]/40 cursor-pointer">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#38bdf8] to-[#1e3a8a] p-0.5 shadow-lg flex items-center justify-center">
            <div className="w-full h-full bg-[#0f172a] rounded-[10px] flex items-center justify-center text-[#38bdf8]">
              <Globe className="w-5 h-5" />
            </div>
          </div>
          <span className="text-[10px] font-mono text-[#e2e8f0] font-medium tracking-tight">
            About Nova 2.0
          </span>
        </div>

        {/* Center Document Viewer Window */}
        <DocumentWindow />
      </div>

      {/* Bottom macOS Floating Dock Bar (Matching Screenshot 1 & 4) */}
      <div className="relative z-10 w-full flex justify-center pb-2">
        <div className="flex items-center gap-3 px-4 py-2 bg-[#0f172a]/95 border border-[#1e293b] rounded-2xl shadow-2xl backdrop-blur-xl">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#3b82f6] to-[#60a5fa] flex items-center justify-center text-white shadow-md">
            <Globe className="w-4 h-4" />
          </div>
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#10b981] to-[#34d399] flex items-center justify-center text-white shadow-md">
            <Folder className="w-4 h-4" />
          </div>
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#f59e0b] to-[#fbbf24] flex items-center justify-center text-white shadow-md">
            <Code className="w-4 h-4" />
          </div>
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#8b5cf6] to-[#a78bfa] flex items-center justify-center text-white shadow-md">
            <Terminal className="w-4 h-4" />
          </div>
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#ec4899] to-[#f472b6] flex items-center justify-center text-white shadow-md">
            <Compass className="w-4 h-4" />
          </div>
        </div>
      </div>
    </div>
  );
}

// Individual Shard Component (Clips full DesktopOverlay so ENTIRE screen shatters together!)
interface SingleShardProps {
  shard: ShardDef;
  scrollYProgress: MotionValue<number>;
}

function SingleShard({ shard, scrollYProgress }: SingleShardProps) {
  const distFactor = Math.max(0.3, shard.dist / 50);

  // Progressive displacement vectors radiating out from center
  const translateX = useTransform(
    scrollYProgress,
    [0.08, 0.25, 0.58, 0.68],
    [0, Math.cos(shard.angle) * 35 * (1 - shard.delay), Math.cos(shard.angle) * 1500 * distFactor, Math.cos(shard.angle) * 2400 * distFactor]
  );

  const translateY = useTransform(
    scrollYProgress,
    [0.08, 0.25, 0.58, 0.68],
    [0, Math.sin(shard.angle) * 35 * (1 - shard.delay), Math.sin(shard.angle) * 1500 * distFactor, Math.sin(shard.angle) * 2400 * distFactor]
  );

  const scale = useTransform(
    scrollYProgress,
    [0.1, 0.35, 0.62],
    [1.0, 1.15, 4.5 * distFactor]
  );

  const rotateX = useTransform(
    scrollYProgress,
    [0.15, 0.62],
    [0, (shard.cx - 50) * 5]
  );

  const rotateY = useTransform(
    scrollYProgress,
    [0.15, 0.62],
    [0, (shard.cy - 50) * 5]
  );

  const rotateZ = useTransform(
    scrollYProgress,
    [0.1, 0.62],
    [0, Math.sin(shard.angle) * 160]
  );

  // Opacity reaches 0 at progress 0.65 so shards completely disappear as requested!
  const opacity = useTransform(
    scrollYProgress,
    [0.0, 0.45, 0.64, 0.65],
    [1.0, 0.95, 0.2, 0.0]
  );

  return (
    <motion.div
      style={{
        clipPath: shard.clipPath,
        x: translateX,
        y: translateY,
        scale,
        rotateX,
        rotateY,
        rotateZ,
        opacity,
      }}
      className="absolute inset-0 w-full h-full pointer-events-none origin-center"
    >
      <DesktopOverlay />
    </motion.div>
  );
}

export default function ShatterSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Background sky parallax Y movement (moves down as you scroll further)
  const bgY = useTransform(scrollYProgress, [0.4, 1.0], ["0%", "30%"]);
  const bgScale = useTransform(scrollYProgress, [0.4, 1.0], [1.0, 1.15]);

  // Falling Man figure pinned scale & position (remains stationary near center)
  const manY = useTransform(scrollYProgress, [0.4, 0.7, 1.0], ["0px", "-10px", "0px"]);
  const manScale = useTransform(scrollYProgress, [0.4, 1.0], [1.0, 1.08]);

  // Initial scroll guide indicator opacity
  const guideOpacity = useTransform(scrollYProgress, [0.0, 0.2], [1.0, 0.0]);

  // Central bursting sky light beam during crack opening
  const centerBeamOpacity = useTransform(scrollYProgress, [0.1, 0.35, 0.6], [0.0, 1.0, 0.0]);
  const centerBeamScale = useTransform(scrollYProgress, [0.1, 0.55], [0.2, 2.5]);

  // Next Page Overlay Content (Fades in over sky & pinned man after shards disappear)
  const missionOpacity = useTransform(scrollYProgress, [0.66, 0.78, 0.95], [0.0, 1.0, 1.0]);
  const missionY = useTransform(scrollYProgress, [0.66, 0.78], [40, 0]);

  return (
    <section ref={containerRef} className="relative h-[480vh] bg-[#030712] select-none">
      {/* Sticky Full-Viewport Container */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">
        
        {/* Parallax Moving Sky Background Layer */}
        <motion.div
          style={{
            y: bgY,
            scale: bgScale,
          }}
          className="absolute inset-0 z-0 origin-center overflow-hidden"
        >
          <Image
            src="/images/falling_man_sky_bg.jpg"
            alt="Sky and Cloud Background"
            fill
            priority
            className="object-cover object-center brightness-90"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#030712]/70 via-transparent to-[#030712]/80 pointer-events-none" />
        </motion.div>

        {/* Pinned Stationary Falling Hero Silhouette */}
        <motion.div
          style={{
            y: manY,
            scale: manScale,
          }}
          className="absolute inset-0 z-5 flex items-center justify-center pointer-events-none"
        >
          <div className="w-80 h-80 rounded-full bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.25)_0%,transparent_70%)] blur-xl" />
        </motion.div>

        {/* Central Bursting Sky Light Beam during Crack Opening */}
        <motion.div
          style={{
            opacity: centerBeamOpacity,
            scale: centerBeamScale,
          }}
          className="absolute z-10 w-96 h-96 rounded-full bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.85)_0%,rgba(147,197,253,0.35)_40%,transparent_70%)] blur-2xl pointer-events-none"
        />

        {/* Shattering Full Desktop Layer (Disappears completely by progress 0.65) */}
        <div className="absolute inset-0 z-20 w-full h-full perspective-[1200px] pointer-events-none">
          {SHARDS.map((shard) => (
            <SingleShard key={shard.id} shard={shard} scrollYProgress={scrollYProgress} />
          ))}
        </div>

        {/* Initial Scroll Guide Badge (Bottom Right) */}
        <motion.div
          style={{ opacity: guideOpacity }}
          className="absolute bottom-8 right-8 z-30 flex items-center gap-3 bg-[#0f172a]/90 border border-[#38bdf8]/40 px-4 py-2 rounded-full shadow-[0_0_20px_rgba(56,189,248,0.2)] backdrop-blur-md font-mono"
        >
          <MousePointer className="w-4 h-4 text-[#38bdf8] animate-bounce" />
          <div className="flex flex-col text-left">
            <span className="text-[9px] uppercase tracking-widest text-[#94a3b8]">GUIDE</span>
            <span className="text-xs font-bold tracking-wider text-[#38bdf8]">SCROLL TO SHATTER</span>
          </div>
        </motion.div>

        {/* Next Section Overlay: Mission Statement & Action Buttons */}
        <motion.div
          style={{
            opacity: missionOpacity,
            y: missionY,
          }}
          className="absolute z-30 max-w-4xl px-6 text-center space-y-8 flex flex-col items-center justify-center font-sans"
        >
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-white leading-tight tracking-tight max-w-3xl drop-shadow-[0_4px_24px_rgba(0,0,0,0.8)] font-cinzel">
            To build Sri Lanka&apos;s next generation of tech-native engineers by bridging academic learning and industry infrastructure.
          </h2>

          <p className="font-mono text-xs sm:text-sm text-[#93c5fd] uppercase tracking-[0.25em] font-semibold bg-[#0f172a]/80 px-4 py-1.5 rounded-full border border-[#38bdf8]/30 backdrop-blur-sm shadow-lg">
            FOUNDED UNDER AIESEC IN UNIVERSITY OF SRI JAYEWARDENEPURA
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 pt-4">
            <Link href="/register">
              <button className="group relative bg-[#FFB81B] hover:brightness-110 text-[#001233] text-xs font-bold uppercase tracking-widest px-7 py-3.5 rounded-full shadow-[0_0_25px_rgba(255,184,27,0.4)] transition-all duration-200 hover:scale-105 active:scale-95 flex items-center gap-2 font-mono">
                <span>CLAIM YOUR PLACE</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>

            <a
              href="/docs/delegate-booklet.pdf"
              download
              className="group relative bg-[#1e293b]/90 hover:bg-[#334155] border border-[#38bdf8]/50 text-[#e2e8f0] text-xs font-bold uppercase tracking-widest px-7 py-3.5 rounded-full shadow-lg backdrop-blur-md transition-all duration-200 hover:scale-105 active:scale-95 flex items-center gap-2 font-mono"
            >
              <Download className="w-4 h-4 text-[#38bdf8] group-hover:translate-y-0.5 transition-transform" />
              <span>DOWNLOAD DELEGATE BOOKLET</span>
            </a>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
