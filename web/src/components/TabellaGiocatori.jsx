function TabellaGiocatori({
  filteredPlayers,
  handleSort,
  sortField,
  sortDirection,
  openPurchasePopup,
  removePlayer,
  playerTags = {},
  updatePlayerTag
}) {
  return (
    <div className="player-list-wrapper">
      <table className="player-table">
        <thead>
          <tr>
            <th onClick={() => handleSort('fullname')}>Giocatore {sortField === 'fullname' && (sortDirection === 'desc' ? '▼' : '▲')}</th>
            <th onClick={() => handleSort('ratingAsta')} style={{ textAlign: 'center' }}>Rating {sortField === 'ratingAsta' && (sortDirection === 'desc' ? '▼' : '▲')}</th>
            <th onClick={() => handleSort('pdk')} style={{ textAlign: 'center' }}>PDK {sortField === 'pdk' && (sortDirection === 'desc' ? '▼' : '▲')}</th>
            <th onClick={() => handleSort('pts')} style={{ textAlign: 'center' }}>PTS {sortField === 'pts' && (sortDirection === 'desc' ? '▼' : '▲')}</th>
            <th onClick={() => handleSort('reb')} style={{ textAlign: 'center' }}>REB {sortField === 'reb' && (sortDirection === 'desc' ? '▼' : '▲')}</th>
            <th onClick={() => handleSort('ast')} style={{ textAlign: 'center' }}>AST {sortField === 'ast' && (sortDirection === 'desc' ? '▼' : '▲')}</th>
            <th style={{ width: '40px' }}></th>
          </tr>
        </thead>
        <tbody>
          {filteredPlayers.length === 0 ? (
            <tr>
              <td colSpan="7" style={{ textAlign: 'center', padding: '32px', color: 'var(--text-muted)' }}>
                Nessun giocatore corrisponde ai filtri selezionati.
              </td>
            </tr>
          ) : (
            filteredPlayers.map(p => {
              const activeTag = playerTags[p.id] || '';
              
              let rowStyle = {};
              if (activeTag === 'ottimo') {
                rowStyle = { background: 'rgba(16, 185, 129, 0.05)' };
              } else if (activeTag === 'osservare') {
                rowStyle = { background: 'rgba(234, 179, 8, 0.05)' };
              } else if (activeTag === 'avoid') {
                rowStyle = { background: 'rgba(239, 68, 68, 0.05)', opacity: 0.6 };
              }

              return (
                <tr
                  key={p.id}
                  className="player-row"
                  onDoubleClick={() => openPurchasePopup(p)}
                  style={{ cursor: 'pointer', ...rowStyle }}
                  title="Doppio clic per inserire prezzo d'asta"
                >
                  <td>
                    <div className="player-name-cell">
                      <span className="player-fullname">{p.fullname}</span>
                      <div className="player-team-role" style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '6px' }}>
                        <span className={`role-badge role-${p.role}`}>{p.role}</span>
                        <span>{p.teamName} ({p.team})</span>
                        
                        <select
                          value={activeTag}
                          onChange={(e) => updatePlayerTag(p.id, e.target.value)}
                          onClick={(e) => e.stopPropagation()}
                          style={{
                            background: 
                              activeTag === 'ottimo' ? 'rgba(16, 185, 129, 0.2)' : 
                              activeTag === 'osservare' ? 'rgba(234, 179, 8, 0.2)' : 
                              activeTag === 'avoid' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                            color: 
                              activeTag === 'ottimo' ? 'var(--accent-green)' : 
                              activeTag === 'osservare' ? 'var(--accent-gold)' : 
                              activeTag === 'avoid' ? 'var(--accent-red)' : 'var(--text-secondary)',
                            borderColor: 
                              activeTag === 'ottimo' ? 'var(--accent-green)' : 
                              activeTag === 'osservare' ? 'var(--accent-gold)' : 
                              activeTag === 'avoid' ? 'var(--accent-red)' : 'var(--border-color)',
                            borderStyle: 'solid',
                            borderWidth: '1px',
                            borderRadius: '6px',
                            padding: '2px 4px',
                            fontSize: '10px',
                            fontWeight: '700',
                            cursor: 'pointer',
                            outline: 'none'
                          }}
                        >
                          <option value="" style={{ background: 'var(--bg-panel)', color: 'var(--text-primary)' }}>- Tag -</option>
                          <option value="ottimo" style={{ background: 'var(--bg-panel)', color: 'var(--accent-green)' }}>🟢 Ottimo</option>
                          <option value="osservare" style={{ background: 'var(--bg-panel)', color: 'var(--accent-gold)' }}>🟡 Osservare</option>
                          <option value="avoid" style={{ background: 'var(--bg-panel)', color: 'var(--accent-red)' }}>🔴 Avoid</option>
                        </select>
                      </div>
                    </div>
                  </td>
                  <td style={{ textAlign: 'center', fontWeight: '600', color: p.ratingAsta !== undefined ? 'var(--accent-gold)' : 'inherit' }}>{p.ratingAsta !== undefined ? p.ratingAsta.toFixed(1) : Math.round(p.cost)}</td>
                  <td style={{ textAlign: 'center', fontWeight: '600', color: 'var(--accent-green)' }}>{p.pdk.toFixed(1)}</td>
                  <td style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>{p.pts.toFixed(1)}</td>
                  <td style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>{p.reb.toFixed(1)}</td>
                  <td style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>{p.ast.toFixed(1)}</td>
                  <td style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
                    <button
                      className="btn-buy"
                      onClick={(e) => { e.stopPropagation(); openPurchasePopup(p); }}
                      title="Compra giocatore"
                    >
                      <i className="fa-solid fa-plus"></i>
                    </button>
                    <button
                      className="btn-delete"
                      onClick={(e) => { e.stopPropagation(); removePlayer(p.id); }}
                      title="Rimuovi giocatore dalla tabella"
                    >
                      <i className="fa-solid fa-trash"></i>
                    </button>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}

export default TabellaGiocatori;
