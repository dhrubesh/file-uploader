import React from 'react';
import FileUploader from './components/FileUploader';
import './App.css';

const App: React.FC = () => {
  let type = [
    'image/jpeg',
    'application/x-iwork-keynote-sffkey',
    'application/pdf',
  ];
  return (
    <div className="App">
      <header className="App-header">
        <FileUploader type={type} />
      </header>
    </div>
  );
};

export default App;
