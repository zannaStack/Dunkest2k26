import { useState } from 'react';
import AvversariPanel from './AvversariPanel';
import RegistroAstaPanel from './RegistroAstaPanel';

function CourtSlotCard({ slotKey, roleLabel, player, selected, onClick, onSell }) {
  if (!player) {
    return (
      <div
        className={`slot-card empty ${selected ? 'selected-for-assignment' : ''}`}
        onClick={() => onClick(slotKey)}
        title={`Clicca per selezionare questo slot ed assegnarvi un giocatore`}
      >
        <span className="slot-role-label">{roleLabel}</span>
        <i className="fa-regular fa-user-circle slot-icon-placeholder"></i>
        <span style={{ fontSize: '9px', color: 'var(--text-muted)' }}>Vuoto</span>
      </div>
    );
  }

  return (
    <div className="slot-card filled" onClick={() => onClick(slotKey)}>
      <span className="slot-role-label">{roleLabel}</span>
      <span className="slot-player-name">{player.fullname}</span>
      <span className="slot-player-price">{Math.round(player.purchasePrice)} cr</span>
      <div style={{ fontSize: '10px', color: 'var(--accent-green)', fontWeight: '700', marginTop: '2px' }}>
        PDK: {player.pdk.toFixed(1)}
      </div>
      <button
        className="btn-sell-slot"
        onClick={(e) => { e.stopPropagation(); onSell(slotKey); }}
        title="Vendi giocatore"
      >
        <i className="fa-solid fa-times"></i>
      </button>
    </div>
  );
}

function RosterSquadra({
  roster,
  selectedSlot,
  handleSlotClick,
  sellPlayer,
  rosterStats,
  rosterValidation,
  budgetRemaining,
  startingBudget,
  clearRoster,
  courtSlots,
  benchSlots,
  tribunaSlots,
  opponents = [],
  auctionLog = [],
  revertPurchase,
  editPurchase,
  isAuctionStarted = false,
  startAuction,
  stopAuction
}) {
  const [activeTab, setActiveTab] = useState('mio_roster');

  return (
    <section className="roster-panel">
      <div className="budget-box">
        <div className="budget-header">
          <span style={{ fontSize: '14px', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: '700' }}>Budget Rimanente</span>
          <span className="budget-val">
            <i className="fa-solid fa-coins"></i>
            {Math.round(budgetRemaining)} <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>/ {startingBudget} cr</span>
          </span>
        </div>

        <div className="budget-progress-bar">
          <div
            className={`budget-fill ${
              budgetRemaining < 0 ? 'danger' : 
              budgetRemaining < startingBudget * 0.1 ? 'warning' : ''
            }`}
            style={{ width: `${Math.max(0, Math.min(100, (budgetRemaining / startingBudget) * 100))}%` }}
          ></div>
        </div>

        <div className="budget-settings" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', gap: '8px' }}>
          <span>Slot occupati: <strong>{rosterValidation.count} / 13</strong></span>
          <div style={{ display: 'flex', gap: '6px' }}>
            <button
              className="btn-small"
              onClick={clearRoster}
              disabled={rosterValidation.count === 0}
              style={{ background: 'transparent', color: 'var(--accent-red)', borderColor: 'var(--accent-red)', fontSize: '11px', padding: '4px 8px' }}
            >
              <i className="fa-solid fa-trash-can" style={{ marginRight: '4px' }}></i>Reset Roster
            </button>
            {isAuctionStarted && (
              <button
                className="btn-small"
                onClick={stopAuction}
                style={{ background: 'transparent', color: 'var(--accent-red)', borderColor: 'var(--accent-red)', fontSize: '11px', padding: '4px 8px' }}
                title="Termina l'asta live e cancella gli avversari"
              >
                <i className="fa-solid fa-circle-stop" style={{ marginRight: '4px' }}></i>Termina Asta
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Tab Selector or Start Button */}
      {isAuctionStarted ? (
        <div className="roster-tabs" style={{ display: 'flex', gap: '4px', marginBottom: '16px', background: 'rgba(255,255,255,0.03)', padding: '4px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
          <button
            onClick={() => setActiveTab('mio_roster')}
            className={`tab-btn ${activeTab === 'mio_roster' ? 'active' : ''}`}
            style={{
              flex: 1,
              padding: '8px',
              borderRadius: '6px',
              border: 'none',
              background: activeTab === 'mio_roster' ? 'var(--accent-green)' : 'transparent',
              color: activeTab === 'mio_roster' ? '#fff' : 'var(--text-secondary)',
              fontWeight: '700',
              cursor: 'pointer',
              fontSize: '11px',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            <i className="fa-solid fa-basketball-ball"></i>Squadra
          </button>
          <button
            onClick={() => setActiveTab('avversari')}
            className={`tab-btn ${activeTab === 'avversari' ? 'active' : ''}`}
            style={{
              flex: 1,
              padding: '8px',
              borderRadius: '6px',
              border: 'none',
              background: activeTab === 'avversari' ? 'var(--accent-blue)' : 'transparent',
              color: activeTab === 'avversari' ? '#fff' : 'var(--text-secondary)',
              fontWeight: '700',
              cursor: 'pointer',
              fontSize: '11px',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            <i className="fa-solid fa-users"></i>Avversari
          </button>
          <button
            onClick={() => setActiveTab('registro')}
            className={`tab-btn ${activeTab === 'registro' ? 'active' : ''}`}
            style={{
              flex: 1,
              padding: '8px',
              borderRadius: '6px',
              border: 'none',
              background: activeTab === 'registro' ? 'var(--accent-gold)' : 'transparent',
              color: activeTab === 'registro' ? '#fff' : 'var(--text-secondary)',
              fontWeight: '700',
              cursor: 'pointer',
              fontSize: '11px',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            <i className="fa-solid fa-clock-rotate-left"></i>Registro
          </button>
        </div>
      ) : (
        <button
          onClick={startAuction}
          className="btn-action btn-magic"
          style={{
            width: '100%',
            marginBottom: '16px',
            background: 'linear-gradient(135deg, var(--accent-blue), var(--accent-green))',
            color: '#fff',
            border: 'none',
            fontSize: '13px',
            padding: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            fontWeight: '700',
            boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
            cursor: 'pointer'
          }}
        >
          <i className="fa-solid fa-play"></i>
          Avvia Asta Live (12 squadre)
        </button>
      )}

      {activeTab === 'mio_roster' ? (
        <>
          {/* TITOLARI */}
          <div className="bench-container court-container-replaced">
        <h4 className="bench-title">
          <i className="fa-solid fa-basketball" style={{ color: 'var(--accent-green)' }}></i>
          Titolari
        </h4>
        <div className="bench-slots">
          {courtSlots.map(slot => (
            <div key={slot.slotKey} className="bench-slot-wrapper">
              <CourtSlotCard
                slotKey={slot.slotKey}
                roleLabel={slot.roleLabel}
                player={roster[slot.slotKey]}
                selected={selectedSlot === slot.slotKey}
                onClick={handleSlotClick}
                onSell={sellPlayer}
              />
            </div>
          ))}
        </div>
      </div>

      {/* SESTO UOMO & PANCHINA */}
      <div className="bench-container">
        <h4 className="bench-title">
          <i className="fa-solid fa-users" style={{ color: 'var(--accent-blue)' }}></i>
          Sesto Uomo & Panchina
        </h4>
        <div className="bench-slots">
          {benchSlots.map(slot => (
            <div key={slot.slotKey} className="bench-slot-wrapper">
              <CourtSlotCard
                slotKey={slot.slotKey}
                roleLabel={slot.roleLabel}
                player={roster[slot.slotKey]}
                selected={selectedSlot === slot.slotKey}
                onClick={handleSlotClick}
                onSell={sellPlayer}
              />
            </div>
          ))}
        </div>
      </div>

      {/* SEZIONE TRIBUNA */}
      <div className="bench-container">
        <h4 className="bench-title">
          <i className="fa-solid fa-couch" style={{ color: 'var(--accent-red)' }}></i>
          Tribuna
        </h4>
        <div className="bench-slots tribuna-slots-grid">
          {tribunaSlots && tribunaSlots.map(slot => (
            <div key={slot.slotKey} className="bench-slot-wrapper">
              <CourtSlotCard
                slotKey={slot.slotKey}
                roleLabel={slot.roleLabel}
                player={roster[slot.slotKey]}
                selected={selectedSlot === slot.slotKey}
                onClick={handleSlotClick}
                onSell={sellPlayer}
              />
            </div>
          ))}
        </div>
      </div>

      {/* STATISTICHE ROSTER */}
      <div className="stats-panel">
        <h4 style={{ fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
          <i className="fa-solid fa-chart-simple" style={{ color: 'var(--accent-gold)', marginRight: '6px' }}></i>
          Statistiche Roster
        </h4>

        <div className="stats-grid">
          <div className="stat-item">
            <div className="stat-val">{rosterStats.pdk}</div>
            <div className="stat-label">PDK Tot</div>
          </div>
          <div className="stat-item">
            <div className="stat-val">{rosterStats.pts}</div>
            <div className="stat-label">PTS Med</div>
          </div>
          <div className="stat-item">
            <div className="stat-val">{rosterStats.reb}</div>
            <div className="stat-label">REB Med</div>
          </div>
          <div className="stat-item">
            <div className="stat-val">{rosterStats.ast}</div>
            <div className="stat-label">AST Med</div>
          </div>
        </div>

        <div className="validation-section">
          <div className={`validation-item ${rosterValidation.isFull ? 'valid' : 'invalid'}`}>
            <i className={rosterValidation.isFull ? "fa-solid fa-circle-check" : "fa-solid fa-circle-xmark"}></i>
            <span>Giocatori in squadra: {rosterValidation.count} / 13</span>
          </div>
          <div className={`validation-item ${rosterValidation.isBudgetOk ? 'valid' : 'invalid'}`}>
            <i className={rosterValidation.isBudgetOk ? "fa-solid fa-circle-check" : "fa-solid fa-circle-xmark"}></i>
            <span>Rientra nel Budget (&ge; 0 cr)</span>
          </div>
          <div className={`validation-item ${!rosterValidation.hasDuplicates ? 'valid' : 'invalid'}`}>
            <i className={!rosterValidation.hasDuplicates ? "fa-solid fa-circle-check" : "fa-solid fa-circle-xmark"}></i>
            <span>Nessun giocatore duplicato</span>
          </div>
        </div>


      </div>
      </>
      ) : activeTab === 'avversari' ? (
        <AvversariPanel opponents={opponents} />
      ) : (
        <RegistroAstaPanel
          auctionLog={auctionLog}
          revertPurchase={revertPurchase}
          editPurchase={editPurchase}
          opponents={opponents}
        />
      )}
    </section>
  );
}

export default RosterSquadra;