import React from 'react';
import Modal from 'react-awesome-modal';
import axios from 'axios';

interface Props {
  type?: string;
}

interface States {
  file: any;
  progressModal: boolean;
  errModal: boolean;
}

export class FileUploader extends React.Component<Props, States> {
  constructor(props: any) {
    super(props);
    this.state = {
      file: null,
      progressModal: false,
      errModal: false,
    };
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
      this.toggleProgressModal();
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

  toggleErrModal() {
    this.setState(prevState => ({ errModal: !prevState.errModal }));
  }

  toggleProgressModal() {
    this.setState(prevState => ({ progressModal: !prevState.progressModal }));
  }

  render() {
    console.log(this.props.type);
    return (
      <div>
        <input type="file" onChange={e => this.handleChange(e.target.files)} />
        <button onClick={this.handleUpload}>Upload</button>
        <Modal
          visible={this.state.progressModal}
          width="400"
          height="300"
          effect="fadeInUp"
          onClickAway={() => this.toggleProgressModal()}
        >
          <div>
            <h1>Title</h1>
            <p>Some Contents</p>
          </div>
        </Modal>
      </div>
    );
  }
}

export default FileUploader;
