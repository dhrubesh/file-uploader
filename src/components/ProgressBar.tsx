import React from 'react';
interface Props {
  percentage: number;
}

const App: React.FC<Props> = props => {
  return (
    <div className="progress-wrapper">
      <div className="perc-text">{props.percentage}%</div>
      <div className="progress-bar">
        <div className="perc" style={{ width: `${props.percentage}%` }} />
      </div>
      {props.percentage === 100 && (
        <div className="perc-text">File Uploaded</div>
      )}
    </div>
  );
};

export default App;
