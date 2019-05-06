import React from 'react';
import axios from 'axios';

interface Props {
  type?: string;
}

interface State {
  file: any;
}

export class FileUploader extends React.Component<Props, State> {
  constructor(props: any) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleUpload = this.handleUpload.bind(this);
  }

  handleChange(selectorFiles: any) {
    console.log(selectorFiles);
    if (selectorFiles && this.props.type === selectorFiles[0].type) {
      const fd = new FormData();
      fd.append('file', selectorFiles[0], selectorFiles[0].name);
      this.setState({ file: fd });
    }
    //Todo:
    // handle else (throw error)
  }

  handleUpload() {
    console.log('here');
    let { file } = this.state;
    if (file) {
      axios
        .post('http://localhost:5555/upload-file', file, {
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
  }
  render() {
    console.log(this.props.type);
    return (
      <div>
        <input type="file" onChange={e => this.handleChange(e.target.files)} />
        <button onClick={this.handleUpload}>Upload</button>
      </div>
    );
  }
}

export default FileUploader;
