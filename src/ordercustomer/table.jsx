import React, { useState, useEffect } from 'react';

function fetchTable() {
  return fetch('http://localhost:3333/table')
    .then(response => {
      if (!response.ok) {
        throw new Error('Network is not ok');
      }
      return response.json();
    })
    .catch(error => {
      console.error('failed to fetch Table', error);
      return [];
    });
}

function Table({ onSelect }) {
  const [Table, setTable] = useState([]);
  const [SelectedTable, setSelectedTable] = useState('1');

  useEffect(() => {
    fetchTable().then(data => {
      setTable(data);
    })
  }, []);

  useEffect(() => {
    if (SelectedTable) {
      onSelect(SelectedTable);
    }
  }, [SelectedTable]);


  return (
    <div style={{ justifyContent: 'left', display: 'flex', fontSize: '20px', padding: "10px 0px" }}>
      <select
        value={SelectedTable}
        onChange={(e) => {
          const selectedTable = e.target.value;
          setSelectedTable(selectedTable);
        }}
        style={{
          padding: '8px',
          borderRadius: '4px',
          border: '1px solid #ccc',
        }}
      >
        {Table.map((table) => (
          <option
            key={table.tables_id}
            value={table.tables_id}
            disabled={table.status_id === 2}
          >
            โต๊ะที่ {table.tables_number}
          </option>
        ))}
      </select>
    </div>
  );
}

export default Table;
