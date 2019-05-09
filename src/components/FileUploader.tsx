import React, { createRef } from 'react';
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
  id: string;
  name: string;
  uploaded: boolean;
  percentCompleted: number;
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
  active: Array<string>;
}

export class FileUploader extends React.Component<Props, States> {
  constructor(props: any) {
    super(props);
    this.state = {
      file: [],
      progressModal: false,
      percentCompleted: 0,
      fileName: [],
      active: [],
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleUpload = this.handleUpload.bind(this);
    this.handleSingleUpload = this.handleSingleUpload.bind(this);
  }

  static defaultProps = { autoUpload: false };

  componentDidMount() {
    let div = this.divRef.current;
    if (div) {
      div.addEventListener('drop', this.onDrop);
    }
  }
  componentWillUnmount() {
    let div = this.divRef.current;
    if (div) {
      div.removeEventListener('drop', this.onDrop);
    }
  }
  handleChange(selectorFiles: any) {
    if (selectorFiles) {
      for (let i = 0; i < selectorFiles.length; i++) {
        this.updateList(selectorFiles, i);
      }
    }
  }

  uuidv4 = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = (Math.random() * 16) | 0,
        v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  };

  updateList = (selectorFiles: any, i: number) => {
    if (selectorFiles && selectorFiles[i] && selectorFiles[i].type) {
      if (
        typeof this.props.type === 'string' &&
        this.props.type === selectorFiles[i].type
      ) {
        this.addNewFile(selectorFiles, i);
      } else if (Array.isArray(this.props.type)) {
        var found = false;
        for (var el of this.props.type) {
          if (el === selectorFiles[i].type) {
            found = true;
            break;
          }
        }
        if (found) {
          this.addNewFile(selectorFiles, i);
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

  addNewFile = (selectorFiles: any, i: number) => {
    const fd = new FormData();
    fd.append('file', selectorFiles[i], selectorFiles[i].name);
    let obj = {
      id: this.uuidv4(),
      name: selectorFiles[i].name,
      uploaded: false,
      percentCompleted: 0,
    };

    this.setState(
      prevState => ({
        file: [...prevState.file, fd],
        fileName: [...prevState.fileName, obj],
      }),
      () => {
        if (this.props.autoUpload) {
          for (let i in this.state.fileName) {
            if (this.state.fileName[i].name === obj.name) {
              this.handleUpload(obj, Number(i));
              break;
            }
          }
        }
      }
    );
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
      this.ProgressModal(0, index, fileObj.id);
      var self = this;
      axios
        .post(this.props.url, file, {
          onUploadProgress: function(progressEvent) {
            let percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            self.ProgressModal(percentCompleted, index, fileObj.id);
          },
        })
        .then(function(res) {
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

  handleRemove = (fileRemove: fileName) => {
    var fileName = [...this.state.fileName],
      file = [...this.state.file],
      active = [...this.state.active];
    for (var el in fileName) {
      if (fileName[el].name === fileRemove.name) {
        let index = Number(el);
        fileName.splice(index, 1);
        file.splice(index, 1);
        active.map((el, i) => {
          if (el === fileRemove.id) {
            active.splice(i, 1);
          }
        });
        // call the remove file api
        this.setState({
          active: [...active],
          fileName: [...fileName],
          file: [...file],
        });
        break;
      }
    }
  };

  multipleUpload = () => {
    var fileName = [...this.state.fileName];
    if (fileName.length > 0) {
      var found = false;

      for (var el in fileName) {
        if (fileName[el].uploaded === false) {
          found = true;
          let index = Number(el);
          this.handleSingleUpload(fileName[el], index);
        }
      }
      if (!found) {
        NotificationManager.info("Be rest assured you've uploaded everything");
      }
    } else {
      NotificationManager.info('Please select a file to Upload');
    }
  };

  ProgressModal(perc: number, index: number, id: string) {
    var fileName = [...this.state.fileName];

    if (fileName[index].percentCompleted !== perc) {
      fileName[index].percentCompleted = perc;
      console.log('active state change');
      this.setState(prevState => ({
        fileName: [...fileName],
      }));
    }
    if (fileName[index].percentCompleted === 100) {
      setTimeout(() => {
        console.log('active state change');

        this.setState(prevState => ({
          progressModal: false,
          active: [],
        }));
      }, 1500);
    } else if (fileName[index].percentCompleted === 0) {
      console.log('zero');
      this.setState(prevState => ({
        progressModal: true,
        active:
          prevState.active.length === 0 || prevState.active.indexOf(id) === -1
            ? prevState.active.concat([id])
            : prevState.active,
      }));
    }
  }

  onDrop = (e: any) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      this.handleChange(e.dataTransfer.files);
    }
  };

  private divRef = createRef<HTMLDivElement>();

  render() {
    return (
      <div className="App-header">
        <div ref={this.divRef}>
          <input
            className="input-file"
            type="file"
            multiple={true}
            onChange={e => this.handleChange(e.target.files)}
          />
        </div>
        {!this.props.autoUpload && (
          <button className="upload-btn" onClick={this.multipleUpload}>
            Upload All
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
            <ProgressBar
              progressFile={this.state.fileName}
              active={this.state.active}
              handleRemove={this.handleRemove}
            />
          </Modal>
        </div>
      </div>
    );
  }
}

export default FileUploader;
