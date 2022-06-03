import React, { useState, useCallback, useEffect } from 'react';
import { useDropzone } from "react-dropzone";
import "./App.css";

function Dropzone() {
  const [files, setFiles] = useState([]);

  const onDrop = useCallback((acceptedFiles) => {
    console.log(acceptedFiles);
    setFiles(
      acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file)
        })
      )
    );
  }, []);

  const {
    getRootProps,
    getInputProps,
    isDragActive,
  } = useDropzone({
    onDrop,
    accept: 'images/*',
  });

  const thumbs = files.map(file => (
    <div key={file.name}>
      <div >
        <img
          src={file.preview}
          onLoad={() => { URL.revokeObjectURL(file.preview) }} alt=""
        />
      </div>
    </div>
  ));
  
  useEffect(() => {
  return () => files.forEach(file => URL.revokeObjectURL(file.preview));
  },[files]);
 

  const handleUpload = () => {
    const url = "https://api.cloudinary.com/v1_1/johnpaul/image/upload";
    const formData = new FormData();
    let file = files[0];
    formData.append("file", file);
    formData.append("upload_preset", "dryqolej");
    fetch(url, {
      method: "POST",
      body: formData
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        console.log(data);
      });
  };

  return (
    <div className="App">
      <div>
        <div {...getRootProps()}>
        <input {...getInputProps()} />
        {isDragActive ? (
          <p className="dropzone">Drop your image files here</p>
        ) : (
          <p className="dropzone">
            Drag and drop some files here, or click to select files
          </p>
        )}
        </div>
      </div>
      {files.length > 0 && (
        <button className="button" onClick={handleUpload}>
          Upload
        </button>
      )}
      <aside>{thumbs}</aside>
    </div>
  );
}
export default Dropzone;
