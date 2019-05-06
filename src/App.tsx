import React from 'react';
import FileUploader from './components/FileUploader';
import './App.css';

const App: React.FC = () => {
  return (
    <div className="App">
      <header className="App-header">
        <FileUploader type="pdf" />
      </header>
    </div>
  );
};

export default App;
