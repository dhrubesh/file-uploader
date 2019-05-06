import React from 'react';
import axios from 'axios';

interface Props {
  type?: string;
}
export class FileUploader extends React.Component<Props, {}> {
  constructor(props: any) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(selectorFiles: any) {
    console.log(selectorFiles);
    const fd = new FormData();
    fd.append('file', selectorFiles[0], selectorFiles[0].name);
    console.log('fd', fd);
    axios
      .post('http://localhost:5555/upload-file', fd, {
        onUploadProgress: function(progressEvent) {
          console.log('progressEvent', progressEvent);
          let percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          console.log('percentCompleted', percentCompleted);
        },
      })
      .then(function(res) {
        console.log('res', res);
      })
      .catch(function(err) {
        console.error(err);
      });
  }

  render() {
    console.log(this.props.type);
    return (
      <div>
        <input type="file" onChange={e => this.handleChange(e.target.files)} />
      </div>
    );
  }
}

export default FileUploader;
