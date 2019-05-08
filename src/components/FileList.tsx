import React from 'react';

interface fileName {
  name: string;
  uploaded: boolean;
}

interface Props {
  fileName: fileName[];
  handleSingleUpload: (el: object, i: number) => void;
}

const FileList: React.FC<Props> = props => {
  console.log(props);
  return (
    <div>
      {props.fileName &&
        props.fileName.map((el, i) => {
          console.log(el.uploaded);
          return (
            <div className="list-wrapper" key={el.name}>
              {/* assuming file names would be unique */}
              <div>{el.name}</div>
              <div className="upload-status">
                {el.uploaded ? (
                  'Uploaded'
                ) : (
                  <button
                    onClick={() => {
                      props.handleSingleUpload(el, i);
                    }}
                  >
                    Upload
                  </button>
                )}
              </div>
            </div>
          );
        })}
    </div>
  );
};

export default FileList;
