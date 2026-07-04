import { useEffect } from 'react';
import Navbar from './components/Navbar';
import Filtri from './components/Filtri';
import TabellaGiocatori from './components/TabellaGiocatori';
import RosterSquadra from './components/RosterSquadra';
import PurchasePopup from './components/PurchasePopup';
import useDunkestApp from './hooks/useDunkestApp';

function App() {
  const {
    loading,
    error,
    theme,
    toggleTheme,
    editingBudget,
    startingBudget,
    tempBudgetInput,
    setTempBudgetInput,
    setEditingBudget,
    handleBudgetChangeSubmit,
    teamList,
    searchQuery,
    setSearchQuery,
    selectedTeam,
    setSelectedTeam,
    selectedRole,
    setSelectedRole,
    tagFilter,
    setTagFilter,
    playerTags,
    updatePlayerTag,
    filteredPlayers,
    sortField,
    sortDirection,
    handleSort,
    removePlayerFromMarket,
    openPurchasePopup,
    roster,
    selectedSlot,
    handleSlotClick,
    sellPlayer,
    rosterStats,
    rosterValidation,
    budgetRemaining,
    clearRoster,
    COURT_SLOTS_MAIN,
    BENCH_SLOTS,
    TRIBUNA_SLOTS,
    activePurchase,
    closePurchasePopup,
    updatePurchasePriceInput,
    executePurchase,
    canUndo,
    undoLastAction,
    stagione,
    setStagione,
    // Live Draft & Opponents
    opponents,
    auctionLog,
    isDraftConfigured,
    setIsDraftConfigured,
    showSetupModal,
    setShowSetupModal,
    startAuction,
    stopAuction,
    revertPurchase,
    editPurchase,
    exportBackupJSON,
    exportRostersCSV,
    importBackupJSON
  } = useDunkestApp();

  const handlePurchaseConfirm = (price, targetTeamId) => {
    if (isNaN(price) || price <= 0) {
      alert('Inserisci un prezzo d\'acquisto numerico valido!');
      return;
    }
    executePurchase(price, targetTeamId);
  };

  // Scorciatoie da tastiera globali per l'assistente
  useEffect(() => {
    const handleGlobalKeyDown = (e) => {
      // Tasto '/' per mettere il focus rapido sulla ricerca (se non si sta già digitando)
      if (e.key === '/' && !['INPUT', 'SELECT', 'TEXTAREA'].includes(document.activeElement?.tagName)) {
        e.preventDefault();
        const searchInput = document.getElementById('search-player-input');
        if (searchInput) {
          searchInput.focus();
          searchInput.select();
        }
      }
      // Tasto 'Escape' per chiudere il popup o pulire la ricerca
      if (e.key === 'Escape') {
        if (activePurchase) {
          closePurchasePopup();
        } else if (searchQuery) {
          setSearchQuery('');
        }
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [activePurchase, searchQuery, closePurchasePopup, setSearchQuery]);

  if (loading) {
    return (
      <div className="app-container" style={{ justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <div style={{ textAlign: 'center' }}>
          <i className="fa-solid fa-basketball-ball fa-spin" style={{ fontSize: '48px', color: 'var(--accent-green)', marginBottom: '16px' }}></i>
          <h2 style={{ fontSize: '20px' }}>Caricamento database Dunkest...</h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="app-container" style={{ justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <div style={{ textAlign: 'center', color: 'var(--accent-red)' }}>
          <i className="fa-solid fa-exclamation-triangle" style={{ fontSize: '48px', marginBottom: '16px' }}></i>
          <h2>Errore</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <Navbar 
        theme={theme}
        toggleTheme={toggleTheme}
        editingBudget={editingBudget}
        startingBudget={startingBudget}
        tempBudgetInput={tempBudgetInput}
        setTempBudgetInput={setTempBudgetInput}
        setEditingBudget={setEditingBudget}
        handleBudgetChangeSubmit={handleBudgetChangeSubmit}
        canUndo={canUndo}
        undoLastAction={undoLastAction}
        stagione={stagione}
        setStagione={setStagione}
        openSetupModal={startAuction}
        isAuctionStarted={isDraftConfigured}
        exportBackupJSON={exportBackupJSON}
        exportRostersCSV={exportRostersCSV}
        importBackupJSON={importBackupJSON}
      />

      <main className="content-grid">
        <section className="market-panel">
          <div className="panel-title">
            <h3 className="title-text">
              <i className="fa-solid fa-shop" style={{ color: 'var(--accent-green)' }}></i>
              Mercato Giocatori
            </h3>
            <span className="player-count">{filteredPlayers.length} trovati</span>
          </div>

          <Filtri
            teamList={teamList}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedTeam={selectedTeam}
            setSelectedTeam={setSelectedTeam}
            tagFilter={tagFilter}
            setTagFilter={setTagFilter}
            selectedRole={selectedRole}
            setSelectedRole={setSelectedRole}
            onPressEnterFirstPlayer={() => {
              if (filteredPlayers.length > 0) {
                openPurchasePopup(filteredPlayers[0]);
              }
            }}
          />

          <TabellaGiocatori
            filteredPlayers={filteredPlayers}
            handleSort={handleSort}
            sortField={sortField}
            sortDirection={sortDirection}
            openPurchasePopup={openPurchasePopup}
            removePlayer={removePlayerFromMarket}
            playerTags={playerTags}
            updatePlayerTag={updatePlayerTag}
          />
        </section>

        <RosterSquadra
          roster={roster}
          selectedSlot={selectedSlot}
          handleSlotClick={handleSlotClick}
          sellPlayer={sellPlayer}
          rosterStats={rosterStats}
          rosterValidation={rosterValidation}
          budgetRemaining={budgetRemaining}
          startingBudget={startingBudget}
          clearRoster={clearRoster}
          courtSlots={COURT_SLOTS_MAIN}
          benchSlots={BENCH_SLOTS}
          tribunaSlots={TRIBUNA_SLOTS}
          opponents={opponents}
          auctionLog={auctionLog}
          revertPurchase={revertPurchase}
          editPurchase={editPurchase}
          isAuctionStarted={isDraftConfigured}
          startAuction={startAuction}
          stopAuction={stopAuction}
        />
      </main>

      {activePurchase && (
        <PurchasePopup
          player={activePurchase.player}
          priceInput={activePurchase.priceInput}
          setPriceInput={updatePurchasePriceInput}
          closePurchasePopup={closePurchasePopup}
          executePurchase={handlePurchaseConfirm}
          opponents={opponents}
          isAuctionStarted={isDraftConfigured}
        />
      )}
    </div>
  );
}

export default App;