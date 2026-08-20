import { useState } from 'react';
import '../styles/dropdown.css';

export default function TeamDropdown({ teamList, selectedTeam, onSelectTeam }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (team) => {
    onSelectTeam(team);
    setIsOpen(false);
  };

  const displayLabel = selectedTeam === 'Tutte' ? 'Tutte le Squadre' : selectedTeam;

  return (
    <div className="custom-dropdown">
      <button
        className="dropdown-toggle"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{displayLabel}</span>
        <i className={`fa-solid fa-chevron-down ${isOpen ? 'open' : ''}`}></i>
      </button>

      {isOpen && (
        <div className="dropdown-menu">
          {teamList.map(team => (
            <button
              key={team}
              className={`dropdown-item ${selectedTeam === team ? 'active' : ''}`}
              onClick={() => handleSelect(team)}
            >
              {team === 'Tutte' ? 'Tutte le Squadre' : team}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
