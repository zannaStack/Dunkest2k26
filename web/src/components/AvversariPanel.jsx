import { useState } from 'react';

export default function AvversariPanel({ opponents = [] }) {
  const [expandedOpponentId, setExpandedOpponentId] = useState(null);

  const toggleExpand = (oppId) => {
    setExpandedOpponentId(prev => prev === oppId ? null : oppId);
  };

  if (opponents.length === 0) {
    return (
      <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)' }}>
        <i className="fa-solid fa-users" style={{ fontSize: '32px', marginBottom: '12px', display: 'block' }}></i>
        <p>Nessun avversario configurato. Avvia la configurazione dell'asta.</p>
      </div>
    );
  }

  return (
    <div className="opponents-panel-container" style={{ display: 'flex', flexDirection: 'column', gap: '12px', padding: '4px' }}>
      <div className="panel-info-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
        <h4 style={{ margin: 0, fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          <i className="fa-solid fa-users" style={{ color: 'var(--accent-blue)', marginRight: '6px' }}></i>
          Dashboard Avversari
        </h4>
        <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{opponents.length} avversari</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '60vh', overflowY: 'auto', paddingRight: '4px' }}>
        {opponents.map(opp => {
          const isFull = opp.roster.length === 13;
          const remainingSlots = 13 - opp.roster.length;
          const maxBid = remainingSlots > 0 ? opp.budget - (remainingSlots - 1) * 1.0 : 0;
          const isExpanded = expandedOpponentId === opp.id;

          return (
            <div
              key={opp.id}
              className="opponent-card"
              style={{
                background: 'var(--bg-card)',
                borderRadius: '8px',
                border: isFull ? '1px solid var(--accent-green)' : '1px solid var(--border-color)',
                padding: '12px',
                transition: 'all 0.2s ease',
                boxShadow: 'var(--shadow-premium)'
              }}
            >
              {/* Main row */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ cursor: 'pointer', flex: 1 }} onClick={() => toggleExpand(opp.id)}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <i className={`fa-solid fa-chevron-${isExpanded ? 'down' : 'right'}`} style={{ fontSize: '10px', color: 'var(--text-muted)' }}></i>
                    <strong style={{ fontSize: '14px', color: 'var(--text-primary)' }}>{opp.name}</strong>
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                    Giocatori: <strong style={{ color: isFull ? 'var(--accent-green)' : 'var(--text-secondary)' }}>{opp.roster.length} / 13</strong>
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '15px', fontWeight: '700', color: 'var(--accent-green)' }}>
                    {Math.round(opp.budget)} <span style={{ fontSize: '11px', fontWeight: '400', color: 'var(--text-secondary)' }}>cr</span>
                  </div>
                  <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '2px' }}>
                    Max Bid: <strong style={{ color: 'var(--accent-gold)' }}>{Math.max(0, Math.round(maxBid))} cr</strong>
                  </div>
                </div>
              </div>

              {/* Role counters */}
              <div style={{ display: 'flex', gap: '8px', marginTop: '10px', fontSize: '11px', borderTop: '1px dashed var(--border-color)', paddingTop: '8px' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  <span className="role-badge role-G" style={{ fontSize: '8px', padding: '2px 4px' }}>G</span>
                  <strong>{opp.roleCounts.G}</strong>
                </span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  <span className="role-badge role-F" style={{ fontSize: '8px', padding: '2px 4px' }}>F</span>
                  <strong>{opp.roleCounts.F}</strong>
                </span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  <span className="role-badge role-C" style={{ fontSize: '8px', padding: '2px 4px' }}>C</span>
                  <strong>{opp.roleCounts.C}</strong>
                </span>
              </div>

              {/* Collapsible details (player roster list) */}
              {isExpanded && (
                <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px solid var(--border-color)' }}>
                  <div style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: '600', marginBottom: '6px' }}>
                    Giocatori Acquistati ({opp.roster.length}):
                  </div>
                  {opp.roster.length === 0 ? (
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                      Nessun acquisto ancora effettuato.
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', maxHeight: '120px', overflowY: 'auto' }}>
                      {opp.roster.map((player, idx) => (
                        <div
                          key={idx}
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            fontSize: '11px',
                            background: 'rgba(255, 255, 255, 0.03)',
                            padding: '4px 8px',
                            borderRadius: '4px',
                            border: '1px solid var(--border-color)'
                          }}
                        >
                          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span className={`role-badge role-${player.role}`} style={{ fontSize: '7px', padding: '1px 3px' }}>
                              {player.role}
                            </span>
                            <span>{player.fullname}</span>
                          </span>
                          <strong style={{ color: 'var(--text-secondary)' }}>{Math.round(player.purchasePrice)} cr</strong>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
