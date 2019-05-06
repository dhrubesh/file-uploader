import React from 'react';
interface Props {
  percentage: number;
}

const App: React.FC<Props> = props => {
  return (
    <div className="progress-wrapper">
      <div className="perc-num">{props.percentage}%</div>
      <div className="progress-bar">
        <div className="perc" style={{ width: `${props.percentage}%` }} />
      </div>
    </div>
  );
};

export default App;
