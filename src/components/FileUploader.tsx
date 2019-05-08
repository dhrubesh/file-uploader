import React from 'react';
import Modal from 'react-awesome-modal';
import {
  NotificationContainer,
  NotificationManager,
} from 'react-notifications';
import 'react-notifications/lib/notifications.css';
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
  percentCompleted: number;
  fileName: fileName[];
}

export class FileUploader extends React.Component<Props, States> {
  constructor(props: any) {
    super(props);
    this.state = {
      file: [],
      progressModal: false,
      percentCompleted: 0,
      fileName: [],
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleUpload = this.handleUpload.bind(this);
    this.handleSingleUpload = this.handleSingleUpload.bind(this);
  }

  static defaultProps = { autoUpload: false };

  handleChange(selectorFiles: any) {
    console.log('selectorFiles', selectorFiles);
    if (selectorFiles) {
      for (let i = 0; i < selectorFiles.length; i++) {
        this.updateList(selectorFiles, i);
      }
    }
  }

  updateList = (selectorFiles: any, i: number) => {
    if (selectorFiles && selectorFiles[i] && selectorFiles[i].type) {
      if (
        typeof this.props.type === 'string' &&
        this.props.type === selectorFiles[i].type
      ) {
        const fd = new FormData();
        fd.append('file', selectorFiles[i], selectorFiles[i].name);
        let obj = {
          name: selectorFiles[i].name,
          uploaded: false,
        };
        this.setState(
          prevState => ({
            file: [...prevState.file, fd],
            fileName: [...prevState.fileName, obj],
          }),
          () => {
            console.log(this.state.fileName);

            if (this.props.autoUpload) {
              this.handleUpload(obj, this.state.file.length - 1);
            }
          }
        );
      } else if (Array.isArray(this.props.type)) {
        var found = false;
        for (var el of this.props.type) {
          if (el === selectorFiles[i].type) {
            found = true;
            break;
          }
        }
        if (found) {
          const fd = new FormData();
          fd.append('file', selectorFiles[i], selectorFiles[i].name);
          let obj = {
            name: selectorFiles[i].name,
            uploaded: false,
          };
          this.setState(
            prevState => ({
              file: [...prevState.file, fd],
              fileName: [...prevState.fileName, obj],
            }),
            () => {
              console.log('this.state.fileName', this.state.fileName);
              if (this.props.autoUpload) {
                this.handleUpload(obj, this.state.file.length - 1);
              }
            }
          );
        } else {
          NotificationManager.error(
            `invalid file type of ${selectorFiles[i].name}`
          );
        }
      } else {
        NotificationManager.error(
          `invalid file type of ${selectorFiles[i].name}`
        );
      }
    }
  };

  updateStatus = (fileObj: fileName) => {
    var fileName = [...this.state.fileName];
    for (var el in fileName) {
      if (fileName[el].name === fileObj.name) {
        let index = Number(el);
        fileName[index].uploaded = true;
        this.setState({
          fileName: fileName,
        });
        break;
      }
    }
  };

  handleSingleUpload(fileObj: object, index: number) {
    this.handleUpload(fileObj, index);
  }

  handleUpload(fileObj: any, index: number) {
    let { file } = this.state;
    if (file[index]) {
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
          console.log('fileObj', fileObj);
          self.updateStatus(fileObj);

          console.log('res', res);
        })
        .catch(function(err) {
          console.error(err);
        });
    } else {
      NotificationManager.error('File not found. Please choose a file.');
    }
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
          percentCompleted: 0,
          // file: null,
        }));
      }, 1500);
    } else if (this.state.percentCompleted === 0) {
      this.setState(prevState => ({
        progressModal: !prevState.progressModal,
      }));
    }
  }

  render() {
    console.log('filensdljfns', this.state.file);

    return (
      <div>
        <input
          className="input-file"
          type="file"
          multiple={true}
          onChange={e => this.handleChange(e.target.files)}
        />
        {!this.props.autoUpload && (
          <button
            className="upload-btn"
            onClick={() => this.handleUpload({}, 0)}
          >
            Upload
          </button>
        )}
        <FileList
          fileName={this.state.fileName}
          handleSingleUpload={this.handleSingleUpload}
        />
        <NotificationContainer />
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
        </div>
      </div>
    );
  }
}

export default FileUploader;
