import React from 'react';
interface file {
  name: string;
  uploaded: boolean;
}
interface Props {
  percentage: number;
  progressFile: file;
  handleRemove: (file: file) => void;
}

const App: React.FC<Props> = props => {
  return (
    <div className="progress-wrapper">
      <div className="perc-text">{props.progressFile.name}</div>
      <div className="progress-bar">
        <div className="perc" style={{ width: `${props.percentage}%` }} />
      </div>
      <div className="perc-text">{props.percentage}%</div>
      <button onClick={() => props.handleRemove(props.progressFile)}>
        Cancel
      </button>
    </div>
  );
};

export default App;
