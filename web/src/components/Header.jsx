
function Header({ 
  theme, 
  toggleTheme, 
  editingBudget, 
  startingBudget, 
  tempBudgetInput, 
  setTempBudgetInput, 
  setEditingBudget, 
  handleBudgetChangeSubmit,
  canUndo,
  undoLastAction,
  stagione,    // <-- Riceve la stagione corrente
  setStagione, // <-- Riceve la funzione per cambiarla
  openSetupModal,
  isAuctionStarted = false,
  exportBackupJSON,
  exportRostersCSV,
  importBackupJSON
}) {
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      importBackupJSON(e.target.files[0]);
    }
  };

  return (
    <header className="app-header">
      <div className="logo-section">
        <div className="logo-icon">
          <i className="fa-solid fa-basketball-ball"></i>
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <h1 className="logo-title" style={{ margin: 0 }}>Dunkest Manager Pro</h1>
            {isAuctionStarted ? (
              <span className="badge-live-auction" style={{
                background: 'rgba(239, 68, 68, 0.15)',
                color: 'var(--accent-red)',
                border: '1px solid var(--accent-red)',
                borderRadius: '12px',
                padding: '2px 8px',
                fontSize: '10px',
                fontWeight: '800',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                textTransform: 'uppercase',
                boxShadow: '0 0 10px rgba(239, 68, 68, 0.2)',
                animation: 'pulse 2s infinite'
              }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent-red)', display: 'inline-block', animation: 'blink 1s infinite' }}></span>
                Asta Live
              </span>
            ) : (
              <span className="badge-solo" style={{
                background: 'rgba(59, 130, 246, 0.15)',
                color: 'var(--accent-blue)',
                border: '1px solid var(--accent-blue)',
                borderRadius: '12px',
                padding: '2px 8px',
                fontSize: '10px',
                fontWeight: '800',
                display: 'inline-flex',
                alignItems: 'center',
                textTransform: 'uppercase'
              }}>
                Solo Roster
              </span>
            )}
          </div>
          
          {/* Badge statico dell'aggregato storico */}
          <div className="season-selector-container" style={{ marginTop: '2px', display: 'flex', alignItems: 'center' }}>
            <span style={{
              background: 'rgba(234, 179, 8, 0.15)',
              color: 'var(--accent-gold)',
              border: '1px solid var(--accent-gold)',
              borderRadius: '12px',
              padding: '2px 8px',
              fontSize: '10px',
              fontWeight: '800',
              textTransform: 'uppercase'
            }}>
              Stagione 25/26
            </span>
          </div>
        </div>
      </div>

      <div className="header-controls">
        <button
          className="btn-small"
          onClick={openSetupModal}
          style={{
            marginRight: '10px',
            background: 'transparent',
            borderColor: isAuctionStarted ? 'var(--text-muted)' : 'var(--accent-green)',
            color: isAuctionStarted ? 'var(--text-muted)' : 'var(--accent-green)'
          }}
          title={isAuctionStarted ? "Resetta l'asta live corrente e ricomincia" : "Avvia l'asta live con gli avversari"}
        >
          <i className={isAuctionStarted ? "fa-solid fa-rotate" : "fa-solid fa-play"} style={{ marginRight: '6px' }}></i>
          {isAuctionStarted ? 'Reset Asta' : 'Avvia Asta'}
        </button>

        <button
          className="btn-small"
          onClick={undoLastAction}
          disabled={!canUndo}
          style={{ marginRight: '10px' }}
          title="Annulla l'ultima azione"
        >
          <i className="fa-solid fa-rotate-left" style={{ marginRight: '6px' }}></i>Annulla
        </button>

        {/* Gestione Backup e Esportazione Excel */}
        <div style={{ display: 'flex', gap: '6px', marginRight: '10px' }}>
          <button
            className="btn-small"
            onClick={exportBackupJSON}
            title="Scarica un file di backup dell'asta (.json)"
            style={{ borderColor: 'var(--accent-gold)', color: 'var(--accent-gold)', background: 'transparent' }}
          >
            <i className="fa-solid fa-download" style={{ marginRight: '4px' }}></i>Salva
          </button>
          
          <label
            className="btn-small"
            htmlFor="import-file-input"
            title="Carica un file di backup precedentemente salvato (.json)"
            style={{
              borderColor: 'var(--accent-gold)',
              color: 'var(--accent-gold)',
              background: 'transparent',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              padding: '6px 10px',
              fontSize: '11px',
              borderRadius: '8px',
              border: '1px solid var(--accent-gold)',
              fontWeight: '700'
            }}
          >
            <i className="fa-solid fa-upload" style={{ marginRight: '4px' }}></i>Carica
          </label>
          <input
            type="file"
            id="import-file-input"
            accept=".json"
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />

          <button
            className="btn-small"
            onClick={exportRostersCSV}
            title="Esporta i roster di tutte le squadre in formato Excel / Fogli Google"
            style={{ borderColor: 'var(--accent-green)', color: 'var(--accent-green)', background: 'transparent' }}
          >
            <i className="fa-solid fa-file-excel" style={{ marginRight: '4px' }}></i>Esporta Excel
          </button>
        </div>

        {/* Custom Budget Editor */}
        <div className="budget-editor">
          {editingBudget ? (
            <form onSubmit={handleBudgetChangeSubmit} style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
              <input 
                type="number" 
                value={tempBudgetInput} 
                onChange={(e) => setTempBudgetInput(e.target.value)}
                className="popup-input" 
                style={{ width: '80px', padding: '6px', fontSize: '13px' }}
                min="40" max="1000"
              />
              <button type="submit" className="btn-small" style={{ background: 'var(--accent-green)', borderColor: 'var(--accent-green)', color: '#fff' }}>OK</button>
              <button type="button" className="btn-small" onClick={() => setEditingBudget(false)}>Annulla</button>
            </form>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Budget Iniziale: <strong>{startingBudget} cr</strong></span>
              <button className="btn-small" onClick={() => { setTempBudgetInput(startingBudget.toString()); setEditingBudget(true); }}>
                <i className="fa-solid fa-pencil" style={{ marginRight: '4px' }}></i>Modifica
              </button>
            </div>
          )}
        </div>

        <button className="btn-toggle-theme" onClick={toggleTheme} title="Cambia Tema">
          <i className={theme === 'dark' ? "fa-solid fa-sun" : "fa-solid fa-moon"}></i>
        </button>
      </div>
    </header>
  );
}

export default Header;