import { useEffect, useState } from 'react';
import './App.css';
import { Button, Col, Form, Row, Table, ButtonGroup } from 'react-bootstrap';
import { getTimeDifference } from '../helper';
import MyModal from './components/MyModal';
import EditModal from './components/EditModal';

function App() {

  const [filesData, setFilesData] = useState([]);
  const [filterType, setFilterType] = useState('all');

  // State for our new filter feature
  // sorting management

  const [sortBy, setSortBy] = useState('default');
  const [showModal, setShowModal] = useState(false);
  const [editFile, setEditFile] = useState(false);

  const [singleFile, setSingleFile] = useState({
    fileName: '',
    mimetype: '',
    fileID: '',
  });


  useEffect(() => {

    // gett all files from backend
    getAllFiles();

    //  try {
    //   const url = 'http://localhost:5000/files';
    //   const response = await fetch(url);
    //   const resData = await response.json();

    //   const transformedData = calculateUploadedTime(resData.data);
    //   setFilesData(transformedData);
    // } catch (error) {
    //   console.error('Error fetching files: ' + error);
    // }


  }, []);

  async function getAllFiles() {
    try {


      const url = 'http://localhost:5000/files';
      const response = await fetch(url);
      const resData = await response.json();

      // helper file returnns the time difference 
      const transformedData = calculateUploadedTime(resData.data);
      setFilesData(transformedData);

    } catch (error) {
      console.error('Error fetching files: ' + error);
    }
  }



  function calculateUploadedTime(times) {

    // object into array for loop rendering files
    const allFiles = Array.from(times);

    const extrUploadTim = allFiles.map((file) => {

      const uploadTime = new Date(file.uploadTime);
      const timeAgo = getTimeDifference(uploadTime);
      console.log('timeAgo', timeAgo);

      //  old and new file object with upload time
      return {
        ...file,
        uploadTime: timeAgo,
      };
    });

    return extrUploadTim;
  }



  function handleFileUpload(e) {

    if (e.target.files && e.target.files.length > 0) {

      const selectedfileDetails = Array.from(e.target.files);
      const file = selectedfileDetails[0];

      // data dend to backend
      uploadFileToBackend(file);

    }
  }

  async function uploadFileToBackend(file) {

    const formData = new FormData();

    formData.append('file', file);

    try {
      const response = await fetch('http://localhost:5000/files/upload-file', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        console.log('File uploaded successfully:', result);
      } else {
        console.error('Upload failed');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
    }

    getAllFiles();
  }

  function handleEdit(fileDetails) {

    //  const { _id } = fileDetails;

    // console.log(_id);
    // console.log(typeof _id);

    setSingleFile({
      fileName: fileDetails.fileName,
      fileID: fileDetails._id,
    });

    setEditFile(true);
  }

  function handleDelete(fileDetails) {
    // const { _id } = fileDetails;

    // console.log(_id);
    // console.log(typeof _id);

    setSingleFile({
      fileName: fileDetails.fileName,
      mimetype: fileDetails.mimetype,
      fileID: fileDetails._id,
    });

    setShowModal(true);
  }

  // if (e.target.value === 'a-z') {
  //     filesData.sort((a, b) => {
  //       if (a.fileName < b.fileName) {
  //         return -1;
  //       }
  //       if (a.fileName > b.fileName) {
  //         return 1;
  //       }
  //       return 0;
  //     });

  //   }

  // --- Filtering Helper ---
  const getFilteredFiles = () => {

    return filesData.filter((file) => {

      const extrFileName = (file.contentType || file.mimetype || '').toLowerCase();
      const fileExtension = (file.fileName || '').split('.').pop().toLowerCase();

      if (filterType === 'pictures') {

        return extrFileName.startsWith('image/') || ['png', 'jpg', 'jpeg', 'gif', 'webp'].includes(fileExtension);

      }
      if (filterType === 'pdf') {

        return extrFileName === 'application/pdf' || fileExtension === 'pdf';

      }
      if (filterType === 'docs') {

        return (
          extrFileName.includes('word') ||
          extrFileName.includes('document') ||
          extrFileName === 'text/plain' ||
          ['doc', 'docx', 'txt', 'rtf'].includes(fileExtension)
        );

      }
      if (filterType === 'excel') {

        return extrFileName.includes('excel') || extrFileName.includes('spreadsheet') || ['xls', 'xlsx', 'csv'].includes(fileExtension);

      }
      return true; // "all"
    });
  };

  // Sorting Helper

  // const sorted = [...files];


  const getSortedFiles = (files) => {
    const sorted = [...files];

    // if (e.target.value === 'a-z') {
    //   filesData.sort((a, b) => {
    //     if (a.fileName < b.fileName) {
    //       return -1;
    //     }
    //     if (a.fileName > b.fileName) {
    //       return 1;
    //     }
    //     return 0;
    //   });

    // }

    if (sortBy === 'a-z') {
      return sorted.sort((a, b) => a.fileName.localeCompare(b.fileName));
    }
    if (sortBy === 'z-a') {
      return sorted.sort((a, b) => b.fileName.localeCompare(a.fileName));
    }
    return sorted;
  };

  const processedFiles = getSortedFiles(getFilteredFiles());
  console.log(processedFiles);


  return (
    <div className="container py-4">
      <div className="wrapper">
        <div className="header mb-4 text-center">
          <h2>File Manager Dashboard</h2>
        </div>

        {/* Action Controls */}
        <Row className="g-3 align-items-center mb-4">
          <Col md={3} xs={12}>
            <Button as="label" htmlFor="file-upload" className="btn btn-primary w-100 py-2">
              <i className="bi bi-cloud-upload me-2"></i>+ Upload File
            </Button>
            <Form.Control
              id="file-upload"
              name="file"
              type="file"
              onChange={handleFileUpload}
              style={{ display: 'none' }}
            />
          </Col>

          {/* New Filter Feature Button Group */}
          <Col md={6} xs={12} className="text-center">
            <ButtonGroup className="w-100">
              <Button
                variant={filterType === 'all' ? 'primary' : 'outline-secondary'}
                onClick={() => setFilterType('all')}
              >
                All
              </Button>
              <Button
                variant={filterType === 'pictures' ? 'primary' : 'outline-secondary'}
                onClick={() => setFilterType('pictures')}
              >
                Pictures
              </Button>
              <Button
                variant={filterType === 'pdf' ? 'primary' : 'outline-secondary'}
                onClick={() => setFilterType('pdf')}
              >
                PDFs
              </Button>
              <Button
                variant={filterType === 'docs' ? 'primary' : 'outline-secondary'}
                onClick={() => setFilterType('docs')}
              >
                Docs
              </Button>
              <Button
                variant={filterType === 'excel' ? 'primary' : 'outline-secondary'}
                onClick={() => setFilterType('excel')}
              >
                Excel
              </Button>
            </ButtonGroup>
          </Col>
          {/* sorting changing */}

          <Col md={3} xs={12}>
            <select
              className="form-select py-2"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="default">Sort Files</option>
              <option value="a-z">A - Z</option>
              <option value="z-a">Z - A</option>
            </select>
          </Col>
        </Row>

        {/* Files Table */}
        <div className="table-responsive">
          <Table striped bordered hover align="middle">
            <thead className="table-dark">
              <tr>
                <th>File Name</th>
                <th>Content Type</th>
                <th>Size</th>
                <th>Uploaded</th>
                <th className="text-center" style={{ width: '200px' }}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {processedFiles.length > 0 ? (
                processedFiles.map((v, i) => (
                  <tr key={v._id || i}>
                    <td>{v.fileName}</td>
                    <td>{v.contentType ? v.contentType : v.mimetype}</td>
                    <td>{v.size || 'N/A'}</td>
                    {/* yee hai bug uploadtime ka e miss tha */}
                    <td>{v.uploaded ? v.uploaded : v.uploadTime}</td>
                    <td>
                      <div className="d-flex justify-content-center gap-2">
                        <button
                          onClick={() => handleEdit(v)}
                          className="btn btn-sm btn-outline-primary"
                        >
                          <i className="bi bi-pencil me-1"></i> Edit
                        </button>
                        <button
                          onClick={() => handleDelete(v)}
                          className="btn btn-sm btn-outline-danger"
                        >
                          <i className="bi bi-trash3 me-1"></i> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-4 text-muted">
                    No files found for the selected category.
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>

        {/* Modals */}
        {showModal && (
          <MyModal
            show={showModal}
            details={singleFile}
            getAllFiles={getAllFiles}
            onHide={() => setShowModal(false)}
          />
        )}

        {editFile && (
          <EditModal
            details={singleFile}
            getAllFiles={getAllFiles}
            show={editFile}
            onHide={() => setEditFile(false)}
          />
        )}
      </div>
    </div>
  );
}

export default App;