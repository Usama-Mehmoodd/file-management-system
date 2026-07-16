import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

export default function MyModal({ show, onHide, details, getAllFiles}) {

   
  
  async function deleteFileToBackend(fileID) {

    console.log('delete the file through:'+ fileID);

    const url = 'http://localhost:5000/files/delete-file';
    // return;

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ fileID }),


      });
      const resData = await response.json();
      // i want to hide modal
      onHide();
      console.log(resData);

      getAllFiles();


    } catch (error) {
      console.error('faild to delete ', error);
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
          Are you Sure delete the file....! 
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h4>{details.fileName}</h4>
        <p>
          The file containing the {details.mimetype} format
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>Close</Button>
        <Button variant="danger" onClick={()=>deleteFileToBackend(details.fileID)}>delete</Button>
      </Modal.Footer>
    </Modal>
  );
}
