import React, { useState } from 'react';
import { RetroContainer } from './RetroContainer';
import { RetroDivider } from './RetroControls';

export const RetroEmergencyControlPanel: React.FC<{
  onTriggerSiren?: () => void;
  onDeployFloodWalls?: () => void;
  onEvacuationBroadcast?: () => void;
}> = ({ onTriggerSiren, onDeployFloodWalls, onEvacuationBroadcast }) => {
  const [sirenActive, setSirenActive] = useState(false);
  const [floodWallsDeployed, setFloodWallsDeployed] = useState(false);
  const [evacArmed, setEvacArmed] = useState(false);
  const [reservoirBypass, setReservoirBypass] = useState(65); // percentage

  return (
    <RetroContainer
      title="SYS-ACTUATORS"
      hashCount={14}
      statusText="INTERLOCK READY"
      statusColor="amber"
      className="h-full flex flex-col justify-between"
    >
      {/* Actuator 1: Acoustic Early Warning Siren */}
      <div className="space-y-1.5 p-2 bg-[#080c09] border border-[#1e2f21]">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-white text-[11px] uppercase tracking-wider">ACOUSTIC SIREN NET</span>
          <span
            className={`text-[9px] font-bold px-1.5 py-0.5 ${
              sirenActive ? 'bg-[#ef4444] text-white animate-pulse' : 'bg-[#1b2b1e] text-[#6d846b]'
            }`}
          >
            {sirenActive ? 'WAILING 120dB' : 'STANDBY'}
          </span>
        </div>
        <p className="text-[9px] text-[#6e876d] leading-snug">
          Transmits audio alarm across low-elevation residential sectors 1–6.
        </p>
        <button
          onClick={() => {
            setSirenActive(!sirenActive);
            onTriggerSiren?.();
          }}
          className={`w-full py-1 text-[10px] font-black uppercase tracking-wider border cursor-pointer transition-colors ${
            sirenActive
              ? 'border-[#ef4444] bg-[#ef4444] text-black shadow-[0_0_12px_#ef4444]'
              : 'border-[#2d4231] bg-[#0c120e] text-[#fca5a5] hover:border-[#ef4444] hover:bg-[#ef4444]/20'
          }`}
        >
          [ {sirenActive ? 'DEACTIVATE SIREN' : 'TRIGGER EVAC SIREN'} ]
        </button>
      </div>

      {/* Actuator 2: Hydraulic Barrier Floodwalls */}
      <div className="space-y-1.5 p-2 bg-[#080c09] border border-[#1e2f21]">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-white text-[11px] uppercase tracking-wider">PNEUMATIC FLOOD WALLS</span>
          <span
            className={`text-[9px] font-bold px-1.5 py-0.5 ${
              floodWallsDeployed ? 'bg-[#bef264] text-black' : 'bg-[#1b2b1e] text-[#6d846b]'
            }`}
          >
            {floodWallsDeployed ? 'RAISED +2.4M' : 'STOWED'}
          </span>
        </div>
        <p className="text-[9px] text-[#6e876d] leading-snug">
          Pressurizes steel crest barriers along riverbank promenade to prevent overtopping.
        </p>
        <button
          onClick={() => {
            setFloodWallsDeployed(!floodWallsDeployed);
            onDeployFloodWalls?.();
          }}
          className={`w-full py-1 text-[10px] font-black uppercase tracking-wider border cursor-pointer transition-colors ${
            floodWallsDeployed
              ? 'border-[#bef264] bg-[#bef264] text-black shadow-[0_0_10px_#bef264]'
              : 'border-[#2d4231] bg-[#0c120e] text-[#bef264] hover:border-[#bef264] hover:bg-[#bef264]/20'
          }`}
        >
          [ {floodWallsDeployed ? 'RETRACT BARRIERS' : 'DEPLOY FLOOD WALLS'} ]
        </button>
      </div>

      {/* Actuator 3: Retention Basin Reservoir Bypass */}
      <div className="space-y-1 p-2 bg-[#080c09] border border-[#1e2f21]">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-white text-[11px] uppercase tracking-wider">RESERVOIR BYPASS</span>
          <span className="text-xs font-bold text-[#f59e0b] tabular-nums">
            {reservoirBypass}% FLOW
          </span>
        </div>
        <div className="flex items-center gap-2 pt-0.5">
          <input
            type="range"
            min="0"
            max="100"
            value={reservoirBypass}
            onChange={(e) => setReservoirBypass(Number(e.target.value))}
            className="w-full accent-[#bef264] cursor-pointer h-1.5"
          />
        </div>
        <div className="flex justify-between text-[8.5px] text-[#657d64]">
          <span>0% CLOSED</span>
          <span>50% NOMINAL</span>
          <span>100% MAXIMUM</span>
        </div>
      </div>

      <RetroDivider className="my-0.5" />

      {/* Actuator 4: Emergency Broadcast System */}
      <div className="p-2 bg-[#170a0a] border border-[#ef4444]/60">
        <div className="flex items-center justify-between text-xs mb-1">
          <span className="font-black text-[#ef4444] text-[10.5px] tracking-wider uppercase">
            CELL BROADCAST SATELLITE
          </span>
          <span className="text-[8.5px] bg-[#ef4444] text-black font-bold px-1">CAP-v1.2</span>
        </div>
        <p className="text-[9px] text-[#fca5a5] leading-snug mb-1.5">
          Dispatches automated cell-broadcast alert to 184,000 citizens in the inundation zone.
        </p>
        <button
          onClick={() => {
            setEvacArmed(true);
            onEvacuationBroadcast?.();
          }}
          disabled={evacArmed}
          className="w-full py-1 text-[10px] font-black uppercase tracking-wider bg-[#ef4444] text-black border border-[#ef4444] hover:bg-[#f87171] disabled:opacity-40 cursor-pointer shadow-[0_0_12px_rgba(239,68,68,0.4)]"
        >
          {evacArmed ? '[ BROADCAST DISPATCHED ]' : '[ TRANSMIT EVAC ALERT (SMS/CAP) ]'}
        </button>
      </div>
    </RetroContainer>
  );
};
