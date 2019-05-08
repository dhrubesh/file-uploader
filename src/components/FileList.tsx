import React from 'react';

interface fileName {
  name: string;
  uploaded: boolean;
}

interface Props {
  fileName: fileName[];
}

const FileList: React.FC<Props> = props => {
  console.log(props);
  return (
    <div>
      {props.fileName &&
        props.fileName.map(el => {
          console.log(el.uploaded);
          return (
            <div key={el.name}>
              {/* assuming file names would be unique */}
              {el.name}
              {el.uploaded ? <div>Uploaded</div> : <div>not uploaded</div>}
            </div>
          );
        })}
    </div>
  );
};

export default FileList;
