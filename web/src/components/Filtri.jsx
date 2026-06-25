import TeamDropdown from './TeamDropdown';

function Filtri({
  teamList,
  searchQuery,
  setSearchQuery,
  selectedTeam,
  setSelectedTeam,
  tagFilter,
  setTagFilter,
  selectedRole,
  setSelectedRole,
  onPressEnterFirstPlayer
}) {
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && onPressEnterFirstPlayer) {
      e.preventDefault();
      onPressEnterFirstPlayer();
    } else if (e.key === 'Escape') {
      setSearchQuery('');
      e.target.blur();
    }
  };

  return (
    <div className="filters-section">
      <div className="search-row">
        <div className="search-box">
          <i className="fa-solid fa-magnifying-glass"></i>
          <input
            id="search-player-input"
            type="text"
            placeholder="Cerca giocatore... (premi / per cercare)"
            className="input-search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>

        <TeamDropdown
          teamList={teamList}
          selectedTeam={selectedTeam}
          onSelectTeam={setSelectedTeam}
        />
      </div>

      <div className="filter-options-row">
        <div className="tag-toggles" style={{ display: 'flex', gap: '8px' }}>
          <button
            className={`toggle-tag-btn ${tagFilter === 'ottimo' ? 'active' : ''}`}
            onClick={() => setTagFilter(prev => prev === 'ottimo' ? 'Tutti' : 'ottimo')}
            style={{
              background: tagFilter === 'ottimo' ? 'var(--accent-green)' : 'transparent',
              color: tagFilter === 'ottimo' ? '#fff' : 'var(--text-secondary)',
              borderColor: tagFilter === 'ottimo' ? 'var(--accent-green)' : 'var(--border-color)',
              fontWeight: '700'
            }}
          >
            <i className="fa-solid fa-star" style={{ color: tagFilter === 'ottimo' ? '#fff' : 'var(--accent-green)' }}></i> Ottimi
          </button>
          <button
            className={`toggle-tag-btn ${tagFilter === 'osservare' ? 'active' : ''}`}
            onClick={() => setTagFilter(prev => prev === 'osservare' ? 'Tutti' : 'osservare')}
            style={{
              background: tagFilter === 'osservare' ? 'var(--accent-gold)' : 'transparent',
              color: tagFilter === 'osservare' ? '#fff' : 'var(--text-secondary)',
              borderColor: tagFilter === 'osservare' ? 'var(--accent-gold)' : 'var(--border-color)',
              fontWeight: '700'
            }}
          >
            <i className="fa-solid fa-eye" style={{ color: tagFilter === 'osservare' ? '#fff' : 'var(--accent-gold)' }}></i> Osservare
          </button>
          <button
            className={`toggle-tag-btn ${tagFilter === 'avoid' ? 'active' : ''}`}
            onClick={() => setTagFilter(prev => prev === 'avoid' ? 'Tutti' : 'avoid')}
            style={{
              background: tagFilter === 'avoid' ? 'var(--accent-red)' : 'transparent',
              color: tagFilter === 'avoid' ? '#fff' : 'var(--text-secondary)',
              borderColor: tagFilter === 'avoid' ? 'var(--accent-red)' : 'var(--border-color)',
              fontWeight: '700'
            }}
          >
            <i className="fa-solid fa-ban" style={{ color: tagFilter === 'avoid' ? '#fff' : 'var(--accent-red)' }}></i> Avoid
          </button>
        </div>
      </div>

      <div className="filter-pills">
        {['Tutti', 'G', 'F', 'C'].map(role => (
          <button
            key={role}
            className={`pill ${selectedRole === role ? 'active' : ''}`}
            onClick={() => setSelectedRole(role)}
          >
            {role === 'Tutti' ? 'Tutti i Ruoli' : role === 'G' ? 'Guardie (G)' : role === 'F' ? 'Ali (F)' : 'Centri (C)'}
          </button>
        ))}
      </div>
    </div>
  );
}

export default Filtri;
