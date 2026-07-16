import React, { useState } from 'react'
import { Button, Form, Modal } from 'react-bootstrap'

export default function EditModal({ show, onHide, details, getAllFiles }) {

  const [fileEditData, setFileEditData] = useState({
    fileName : details.fileName,
    fileId : details.fileID,
  });

  const handleChange = (e) => {

    const {name, value} = e.target;

    setFileEditData(prevData => ({
    ...prevData,
    [name]: value,
    
    }));


  }

  async function confirmEdit() {

    const url = 'http://localhost:5000/files/update-file';

    // console.log(file);
    // console.log('confirm edit file:: '+action);
    
    // if (action === 'edit') {
      
    try {

      const response = await fetch(url,{
        method: 'POST',
        headers:{
           'Content-Type': 'application/json',
          },
          body: JSON.stringify(fileEditData),
      });

      const resData = await response.json();
      console.log(resData);
      
      onHide();
      getAllFiles();


    } catch (error) {
      console.error('failed to edit', error.message );
     }
    // }

    // if (action === 'replace') {
      // console.log('yes prop is arrived');
// 
      // try {
        
      //   const formData = new FormData;
      //   formData.append('file',file);
      //   formData.append('fileId', fileEditData.fileId);

      //   const response = await fetch(url,{
      //     method: 'POST',
      //     body: formData
      //   });

      //   const result = await response.json();
      //   console.log(result);
        
      //   onHide();
      //   getAllFiles();

      // } catch (error) {
      //   console.error('error', error);
      // }

      
    // }
  

  }

  async function confirmReplaceFile(file) {

    console.log(file);
    
    
  }

  async function handleFileReplace(e) {

    if (e.target.files && e.target.files.length > 0) {
      const selectedfileDetails = Array.from(e.target.files);

      const file = selectedfileDetails[0];
      console.log(file);

      console.log(file.name);
      
      
      const url = 'http://localhost:5000/files/replace-file';
    
     try {
        
        const formData = new FormData;
        formData.append('file',file);

        console.log('state stored id'+fileEditData.fileId);
        
        formData.append('fileId', fileEditData.fileId);

        const response = await fetch(url,{
          method: 'POST',
          body: formData
        });

        const result = await response.json();
        console.log(result);
        
        onHide();
        getAllFiles();

      } catch (error) {
        console.error('error', error);
      }

      // confirmReplaceFile(file);
      // confirmReplaceFile(file, 'replace');

    }
  }

  return (
    <Modal
      show={show}
      onHide={onHide}
      size="md"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Are you Sure Edit file....!
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h4>Rename the file</h4>

        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
          <Form.Control type='text' name='fileName'
            value={fileEditData.fileName || ''}
            onChange={handleChange}>
          </Form.Control>
        </Form.Group>
        <Button variant="primary" onClick={()=>confirmEdit()}>Edit</Button>

        <br />
        <br />
        <br />

        <h4>Replace the file {fileEditData.fileName}</h4>
        {/* <Button variant='primary' >file to replace</Button> */}

        <Button as="label" htmlFor="file-replace" className="me-3">
          +Upload
        </Button>

        <Form.Control
          id="file-replace"
          name="file"
          type="file"
          onChange={handleFileReplace}
          style={{ display: 'none' }}
        // multiple
        />

      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  )
}
