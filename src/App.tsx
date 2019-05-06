import React from 'react';
import FileUploader from './components/FileUploader';
import './App.css';

const App: React.FC = () => {
  // type could either be a string ie one type
  // or array which essentially means
  // multiple type support
  let type = [
    'image/jpeg',
    'application/x-iwork-keynote-sffkey',
    // 'application/pdf',
  ];
  return (
    <div className="App">
      <header className="App-header">
        <FileUploader type={type} autoUpload={true} />
      </header>
    </div>
  );
};

export default App;
