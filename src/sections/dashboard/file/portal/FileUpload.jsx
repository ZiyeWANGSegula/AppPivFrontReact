import PropTypes from 'prop-types';
import { useEffect, useState, useCallback } from 'react';
// components
import Iconify from '../../../../components/iconify';
import { Upload } from '../../../../components/upload';

//Post files
import Axios from '../../../../_services/caller.service';

// ----------------------------------------------------------------------

FileUpload.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  title: PropTypes.string,
  onCreate: PropTypes.func,
  onUpdate: PropTypes.func,
  folderName: PropTypes.string,
  onChangeFolderName: PropTypes.func,
};

export default function FileUpload({
  title = 'Upload Files',
  open,
  onClose,
  //
  onCreate,
  onUpdate,
  //
  folderName,
  entity,
  setUploaderInfo,
  onChangeFolderName,
  deleteFunction,
  ...other
}) {
  const [file, setFile] = useState([]);

  useEffect(() => {
    if (!open) {
      setFile([]);
    }
  }, [open]);

  const handleDrop = useCallback(
    (acceptedFiles) => {
      console.log(acceptedFiles);
      const newFile = acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      );

      setFile(newFile);
      handleUpload(newFile);
    },
    [file]
  );

  const handleUpload = (newFile) => {
    var formData = new FormData();
    console.log(newFile[0]);
    formData.append('filedata', newFile[0]);
    Axios.post(`/api/upload/${entity}`, formData, {
      headers:{
        'Content-Type': 'multipart/form-data'
      }
    }).then((res) => {console.log(res.data);setUploaderInfo(res.data); deleteFunction(false);}).catch((err) => {console.log('uploader err'+ err);});

    console.log('ON UPLOAD');
  };

  const handleRemoveFile = (inputFile) => {
    console.log("HERE");
    const filtered = file.filter((file) => file !== inputFile);
    setFile(filtered);
    deleteFunction(true);
    setUploaderInfo(null);
  };

  return (
    <Upload title="HERE" file={file} onDrop={handleDrop} onRemove={handleRemoveFile} />
  );
}
