import { useState } from 'react';

export default function RegistroAstaPanel({
  auctionLog = [],
  revertPurchase,
  editPurchase,
  opponents = []
}) {
  const [editingLogId, setEditingLogId] = useState(null);
  const [editPrice, setEditPrice] = useState('');
  const [editTeamId, setEditTeamId] = useState('');

  const startEdit = (log) => {
    setEditingLogId(log.id);
    setEditPrice(log.purchasePrice.toString());
    setEditTeamId(log.teamId);
  };

  const handleCancel = () => {
    setEditingLogId(null);
  };

  const handleSave = (logId) => {
    editPurchase(logId, parseInt(editPrice, 10), editTeamId);
    setEditingLogId(null);
  };

  if (auctionLog.length === 0) {
    return (
      <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)' }}>
        <i className="fa-solid fa-list-check" style={{ fontSize: '32px', marginBottom: '12px', display: 'block' }}></i>
        <p>Il registro dell'asta è vuoto. Effettua i primi acquisti per popolarlo.</p>
      </div>
    );
  }

  return (
    <div className="log-panel-container" style={{ display: 'flex', flexDirection: 'column', gap: '12px', padding: '4px' }}>
      <div className="panel-info-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
        <h4 style={{ margin: 0, fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          <i className="fa-solid fa-clock-rotate-left" style={{ color: 'var(--accent-gold)', marginRight: '6px' }}></i>
          Cronologia Acquisti
        </h4>
        <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{auctionLog.length} inserimenti</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '60vh', overflowY: 'auto', paddingRight: '4px' }}>
        {auctionLog.map((log) => {
          const isUser = log.teamId === 'mia_squadra';
          const isEditing = editingLogId === log.id;

          return (
            <div
              key={log.id}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                background: 'var(--bg-card)',
                borderRadius: '6px',
                border: '1px solid var(--border-color)',
                padding: '10px 12px',
                boxShadow: 'var(--shadow-premium)'
              }}
            >
              {isEditing ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span className={`role-badge role-${log.player.role}`} style={{ fontSize: '8px', padding: '2px 4px' }}>
                      {log.player.role}
                    </span>
                    <strong style={{ fontSize: '13px', color: 'var(--text-primary)' }}>{log.player.fullname}</strong>
                  </div>
                  
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap', width: '100%' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', flex: 1, minWidth: '120px' }}>
                      <label style={{ fontSize: '9px', color: 'var(--text-muted)' }}>Squadra:</label>
                      <select
                        value={editTeamId}
                        onChange={(e) => setEditTeamId(e.target.value)}
                        style={{
                          background: 'rgba(30, 41, 59, 0.7)',
                          color: 'var(--text-primary)',
                          border: '1px solid var(--border-color)',
                          borderRadius: '4px',
                          padding: '4px',
                          fontSize: '11px',
                          outline: 'none',
                          cursor: 'pointer'
                        }}
                      >
                        <option value="mia_squadra">Mia Squadra</option>
                        {opponents.map(opp => (
                          <option key={opp.id} value={opp.id}>{opp.name}</option>
                        ))}
                      </select>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', width: '70px' }}>
                      <label style={{ fontSize: '9px', color: 'var(--text-muted)' }}>Prezzo (cr):</label>
                      <input
                        type="number"
                        min="1"
                        step="1"
                        value={editPrice}
                        onChange={(e) => setEditPrice(e.target.value)}
                        style={{
                          background: 'rgba(30, 41, 59, 0.7)',
                          color: 'var(--text-primary)',
                          border: '1px solid var(--border-color)',
                          borderRadius: '4px',
                          padding: '4px',
                          fontSize: '11px',
                          outline: 'none',
                          textAlign: 'center'
                        }}
                      />
                    </div>

                    <div style={{ display: 'flex', gap: '4px', alignSelf: 'flex-end', paddingBottom: '2px' }}>
                      <button
                        onClick={() => handleSave(log.id)}
                        style={{
                          background: 'var(--accent-green)',
                          color: '#fff',
                          border: 'none',
                          borderRadius: '4px',
                          padding: '5px 8px',
                          fontSize: '11px',
                          fontWeight: '700',
                          cursor: 'pointer',
                          transition: 'opacity 0.2s'
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.85'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.opacity = '1'; }}
                      >
                        Salva
                      </button>
                      <button
                        onClick={handleCancel}
                        style={{
                          background: 'var(--text-muted)',
                          color: '#fff',
                          border: 'none',
                          borderRadius: '4px',
                          padding: '5px 8px',
                          fontSize: '11px',
                          fontWeight: '700',
                          cursor: 'pointer',
                          transition: 'opacity 0.2s'
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.85'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.opacity = '1'; }}
                      >
                        Annulla
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span className={`role-badge role-${log.player.role}`} style={{ fontSize: '8px', padding: '2px 4px' }}>
                        {log.player.role}
                      </span>
                      <strong style={{ fontSize: '13px', color: 'var(--text-primary)' }}>{log.player.fullname}</strong>
                    </span>
                    
                    <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                      Aggiudicato a: <span style={{ color: isUser ? 'var(--accent-green)' : 'var(--accent-blue)', fontWeight: '600' }}>{log.teamName}</span>
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ textAlign: 'right', marginRight: '4px' }}>
                      <strong style={{ fontSize: '14px', color: 'var(--accent-green)' }}>{Math.round(log.purchasePrice)} cr</strong>
                      {log.slotKey && (
                        <div style={{ fontSize: '9px', color: 'var(--text-muted)' }}>Slot: {log.slotKey}</div>
                      )}
                    </div>

                    <div style={{ display: 'flex', gap: '2px' }}>
                      <button
                        onClick={() => startEdit(log)}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: 'var(--accent-blue)',
                          cursor: 'pointer',
                          padding: '6px',
                          borderRadius: '4px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'background 0.2s',
                        }}
                        title="Modifica acquisto"
                        onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(59, 130, 246, 0.1)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                      >
                        <i className="fa-solid fa-pencil" style={{ fontSize: '13px' }}></i>
                      </button>

                      <button
                        onClick={() => revertPurchase(log.id)}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: 'var(--accent-red)',
                          cursor: 'pointer',
                          padding: '6px',
                          borderRadius: '4px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'background 0.2s',
                        }}
                        title="Annulla acquisto e rimetti sul mercato"
                        onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                      >
                        <i className="fa-regular fa-trash-can" style={{ fontSize: '14px' }}></i>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
