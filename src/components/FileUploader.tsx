import React from 'react';
import Modal from 'react-awesome-modal';
import axios from 'axios';
import ProgressBar from './ProgressBar';
import FileList from './FileList';

interface fileName {
  name: string;
  uploaded: boolean;
}

interface Props {
  type: string | Array<string>;
  autoUpload: boolean;
  url: string;
}

interface States {
  file: any;
  progressModal: boolean;
  errModal: boolean;
  percentCompleted: number;
  errMsg: string;
  fileName: fileName[];
}

export class FileUploader extends React.Component<Props, States> {
  constructor(props: any) {
    super(props);
    this.state = {
      file: null,
      progressModal: false,
      errModal: false,
      percentCompleted: 0,
      errMsg: 'error message',
      fileName: [],
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleUpload = this.handleUpload.bind(this);
  }

  static defaultProps = { autoUpload: false };

  handleChange(selectorFiles: any) {
    console.log(selectorFiles);
    if (selectorFiles && selectorFiles[0] && selectorFiles[0].type) {
      if (
        typeof this.props.type === 'string' &&
        this.props.type === selectorFiles[0].type
      ) {
        const fd = new FormData();
        fd.append('file', selectorFiles[0], selectorFiles[0].name);
        let obj = {
          name: selectorFiles[0].name,
          uploaded: false,
        };
        this.setState(
          {
            file: fd,
            fileName: [...this.state.fileName, obj],
          },
          () => {
            console.log(this.state.fileName);

            if (this.props.autoUpload) {
              this.handleUpload();
            }
          }
        );
      } else if (Array.isArray(this.props.type)) {
        var found = false;
        for (var el of this.props.type) {
          if (el === selectorFiles[0].type) {
            found = true;
            break;
          }
        }
        if (found) {
          const fd = new FormData();
          fd.append('file', selectorFiles[0], selectorFiles[0].name);
          let obj = {
            name: selectorFiles[0].name,
            uploaded: false,
          };
          this.setState(
            {
              file: fd,
              fileName: [...this.state.fileName, obj],
            },
            () => {
              console.log(this.state.fileName);
              if (this.props.autoUpload) {
                this.handleUpload();
              }
            }
          );
        } else {
          this.ErrorModal('File type not found');
        }
      } else {
        this.ErrorModal('File type not found');
      }
    }
  }

  handleUpload() {
    let { file } = this.state;
    console.log('file', file);
    if (file) {
      this.ProgressModal(0);
      var self = this;
      axios
        .post(this.props.url, file, {
          onUploadProgress: function(progressEvent) {
            console.log('progressEvent', progressEvent);
            let percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            self.ProgressModal(percentCompleted);
            console.log('percentCompleted', percentCompleted);
          },
        })
        .then(function(res) {
          console.log('res', res);
        })
        .catch(function(err) {
          console.error(err);
        });
    } else {
      this.ErrorModal('File not found. Please choose a file.');
    }
  }

  ErrorModal(msg: string) {
    this.setState({
      errMsg: msg,
      errModal: true,
    });

    setTimeout(() => {
      this.setState({
        errModal: false,
      });
    }, 1500);
  }

  ProgressModal(perc: number) {
    if (this.state.percentCompleted !== perc) {
      this.setState({
        percentCompleted: perc,
      });
    }
    if (this.state.percentCompleted === 100) {
      setTimeout(() => {
        this.setState(prevState => ({
          progressModal: !prevState.progressModal,
          file: null,
        }));
      }, 1500);
    } else if (this.state.percentCompleted === 0) {
      this.setState(prevState => ({
        progressModal: !prevState.progressModal,
      }));
    }
  }

  render() {
    console.log(this.state.fileName);

    return (
      <div>
        <input
          className="input-file"
          type="file"
          onChange={e => this.handleChange(e.target.files)}
        />
        {!this.props.autoUpload && (
          <button className="upload-btn" onClick={this.handleUpload}>
            Upload
          </button>
        )}
        <FileList fileName={this.state.fileName} />
        <div className="pe">
          <Modal
            visible={this.state.progressModal}
            width="800"
            height="300"
            effect="fadeInUp"
          >
            <div>
              <ProgressBar percentage={this.state.percentCompleted} />
            </div>
          </Modal>
          <Modal
            visible={this.state.errModal}
            width="400"
            height="300"
            effect="fadeInDown"
          >
            <div>
              <h1>Error</h1>
              <p>{this.state.errMsg}</p>
            </div>
          </Modal>
        </div>
      </div>
    );
  }
}

export default FileUploader;
