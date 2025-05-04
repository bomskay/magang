import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => (
  <aside style={{ width: "200px", background: "#e0e0e0", padding: "10px" }}>
    <ul style={{ listStyle: "none", padding: 0 }}>
      <li><Link to="/dashboard">Dashboard</Link></li>
      <li><Link to="/input-surat-masuk">Input Surat Masuk</Link></li>
      <li><Link to="/input-surat-keluar">Input Surat Keluar</Link></li>
      <li><Link to="/daftar-surat-masuk">Daftar Surat Masuk</Link></li>
      <li><Link to="/daftar-surat-keluar">Daftar Surat Keluar</Link></li>
    </ul>
  </aside>
);

export default Sidebar;
