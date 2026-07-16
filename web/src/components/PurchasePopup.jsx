import { useState } from 'react';

export default function PurchasePopup({
  player,
  priceInput,
  setPriceInput,
  closePurchasePopup,
  executePurchase,
  opponents = [],
  isAuctionStarted = false
}) {
  if (!player) return null;

  const [targetTeamId, setTargetTeamId] = useState('mia_squadra');

  const handleSubmit = (e) => {
    e.preventDefault();
    executePurchase(parseInt(priceInput, 10), targetTeamId);
  };

  return (
    <div className="popup-overlay" onClick={closePurchasePopup}>
      <form className="popup-card" onClick={(e) => e.stopPropagation()} onSubmit={handleSubmit}>
        <div className="popup-header">
          <span className={`role-badge role-${player.role}`} style={{ display: 'inline-block', marginBottom: '6px' }}>
            {player.role}
          </span>
          <h3 className="popup-title">{player.fullname}</h3>
          <p className="popup-subtitle">{player.teamName} ({player.team})</p>
        </div>

        <div className="popup-stats">
          <div className="popup-stat-box">
            <div className="popup-stat-val" style={{ color: 'var(--accent-blue)' }}>{player.ratingAsta !== undefined ? player.ratingAsta.toFixed(1) : '-'}</div>
            <div className="popup-stat-lbl">Rating</div>
          </div>
          <div className="popup-stat-box">
            <div className="popup-stat-val" style={{ color: 'var(--accent-green)' }}>{player.pdk.toFixed(1)}</div>
            <div className="popup-stat-lbl">PDK</div>
          </div>
          <div className="popup-stat-box">
            <div className="popup-stat-val">{player.pts.toFixed(1)}</div>
            <div className="popup-stat-lbl">PTS</div>
          </div>
        </div>

        <div className="popup-input-group">
          <label className="popup-label">Prezzo d'acquisto effettivo (cr):</label>
          <input
            type="number"
            step="1"
            min="1"
            value={priceInput}
            onChange={(e) => setPriceInput(e.target.value)}
            onFocus={(e) => e.target.select()}
            className="popup-input"
            autoFocus
          />
        </div>

        {isAuctionStarted && (
          <div className="popup-input-group" style={{ marginTop: '12px' }}>
            <label className="popup-label">Assegna a:</label>
            <select
              value={targetTeamId}
              onChange={(e) => setTargetTeamId(e.target.value)}
              className="popup-input"
              style={{
                width: '100%',
                padding: '8px',
                borderRadius: '6px',
                background: 'var(--bg-panel)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border-color)',
                outline: 'none'
              }}
            >
              <option value="mia_squadra">Mia Squadra</option>
              {opponents.map(opp => (
                <option key={opp.id} value={opp.id}>{opp.name} ({Math.round(opp.budget)} cr residui)</option>
              ))}
            </select>
          </div>
        )}

        <div className="popup-actions" style={{ marginTop: '20px' }}>
          <button type="button" className="btn-action btn-secondary" onClick={closePurchasePopup} style={{ flex: 1 }}>
            Annulla
          </button>
          <button type="submit" className="btn-action btn-primary" style={{ flex: 1 }}>
            Conferma
          </button>
        </div>
      </form>
    </div>
  );
}
