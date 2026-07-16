import { useEffect, useState } from 'react'
import './App.css'
import { Button, Col, Form, Row, Table, ButtonGroup, DropdownButton, Dropdown } from 'react-bootstrap'
import { getTimeDifference } from '../helper';
import MyModal from './components/MyModal'
import EditModal from './components/EditModal';

function App() {

  const [filesData, setFilesData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editFile, setEditFile] = useState(false);
  
  const [singleFile, setSingleFile] = useState({
    fileName: '',
    mimetype: '',
    fileID: '',
  });

  // const [tempData, setTempData] = useState([]);

  // "2025-10-14T11:12:26.267Z"

  function calculateUploadedTime(times) {
    console.log(times);
    console.log(typeof times);

    const allFiles = Array.from(times);

    console.log(typeof allFiles);

    // return
    const extrUploadTim = allFiles.map((file) => {

      const uploadTime = new Date(file.uploadTime);
      const timeAgo = getTimeDifference(uploadTime);

      return {
        ...file,
        uploadTim: timeAgo
      }

    });

    return extrUploadTim;

  }


  async function getAllFiles() {

    try {

      const url = 'http://localhost:5000/files';
      const response = await fetch(url);

      const resData = await response.json();

      console.log(resData);

      const transformedData = calculateUploadedTime(resData.data);
      // setFilesData(resData.data);
      setFilesData(transformedData);

    } catch (error) {
      console.error('error' + error);
    }
  }
  useEffect(() => {

    getAllFiles();

  }, []);


  function handleFileUpload(e) {

    console.log('clicked');

    if (e.target.files && e.target.files.length > 0) {

      const selectedfileDetails = Array.from(e.target.files);

      console.log(selectedfileDetails[0]);
      const file = selectedfileDetails[0];

      uploadFileToBackend(file);


    }

  }

  function handleSorting(e) {

    if (e.target.value === 'a-z') {
      filesData.sort((a, b) => {
        if (a.fileName < b.fileName) {
          return -1;
        }
        if (a.fileName > b.fileName) {
          return 1;
        }
        return 0;
      });

    }

  }

  async function uploadFileToBackend(file) {

    console.log(file);

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
    console.log(fileDetails);
    const { _id } = fileDetails;

    console.log(_id);


    setSingleFile({
      fileName: fileDetails.fileName,
      fileID: fileDetails._id
    });

    setEditFile(true);

  }

  function handleDelete(fileDetails) {
    console.log(fileDetails);
    const { _id } = fileDetails;

    console.log(_id);
    console.log(typeof _id);

    setSingleFile({
      fileName: fileDetails.fileName,
      mimetype: fileDetails.mimetype,
      fileID: fileDetails._id
    });

    setShowModal(true);

  }



  return (
    <div>
      <div className="container">
        <div className="wrapper">
          <div className='header m-5'>
            <Row>
              <Col><h2>file uploading</h2></Col>
            </Row>
          </div>

          <Row>
            <Col>
              {/* <Button onClick={handleFileUpload}>
                +upload
                <Form.Control name='file' type='file'></Form.Control>
                <input type='file' name='file'/>
              </Button> */}

              <Button as="label" htmlFor="file-upload" className="me-3">
                + Upload
              </Button>

              <Form.Control
                id="file-upload"
                name="file"
                type="file"
                onChange={handleFileUpload}
                style={{ display: 'none' }}
              // multiple
              />
              

             
            </Col>
            <Col>
                 <select className="form-select" onChange={(e) => handleSorting(e)}>
                <option value={"default"}>sort files</option>
                <option value={"a-z"}>A - Z</option>
                <option value={"z-a"}>Z - A</option>
              </select> 
            </Col>
          </Row>

          <div className='table'>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>File name</th>
                  <th>Content type</th>
                  <th>Size</th>
                  <th>Uploaded</th>
                </tr>
              </thead>
              <tbody>

                {
                  filesData.map((v, i) => (
                    <tr key={i + '0'}>
                      <td>{v.fileName}</td>
                      <td>{v.contentType ? v.contentType : v.mimetype}</td>
                      <td style={{ width: '90px', }}>{v.size}</td>
                      <td style={{ width: '120px', }}>{v.uploaded ? v.uploaded : v.uploadTim}</td>
                      <td><div style={{ display: 'flex', justifyContent: 'space-between', }}>
                        <div style={{ margin: '5px' }}>

                          <button onClick={() => handleEdit(v)}
                            className="btn btn-outline-primary">
                            <i className="bi bi-pencil"></i>
                            Edit
                          </button>

                        </div>
                        <div style={{ margin: '5px' }}>

                          <button onClick={() => handleDelete(v)} className="btn btn-outline-danger ">
                            <i className="bi bi bi-trash3 "></i>
                            Delete
                          </button>

                        </div>
                      </div>
                      </td>
                    </tr>
                  ))
                }

              </tbody>
            </Table>
          </div>

          {showModal &&

            <MyModal
              show={showModal}
              details={singleFile}
              getAllFiles={getAllFiles}
              onHide={() => setShowModal(false)}
            />

          }

          {
            editFile &&
            <EditModal
              details={singleFile}
              getAllFiles={getAllFiles}
              show={editFile}
              onHide={() => setEditFile(false)}
            />
          }


        </div>
      </div>
    </div>
  )
}

export default App
