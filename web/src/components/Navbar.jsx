import React from 'react';
import Header from './Header'; // <-- Questo è l'import che mancava e causava il crash!

function Navbar(props) {
  return (
    <div className="app-navbar">
      <Header {...props} />
    </div>
  );
}

export default Navbar;