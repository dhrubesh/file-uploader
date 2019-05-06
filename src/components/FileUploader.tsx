import React from 'react';

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
