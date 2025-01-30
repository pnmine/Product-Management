import React from "react";
import { Modal, Button } from "flowbite-react";

function ConfirmDeleteModal({ show, onClose, onConfirm, product }) {
	return (
		<Modal show={show} onClose={onClose}>
			<Modal.Header>Confirm Deletion</Modal.Header>
			<Modal.Body>
				<p>Are you sure you want to delete the product {product?.product_name}?</p>
			</Modal.Body>
			<Modal.Footer>
				<button className="rounded-md bg-gray-200  hover:bg-gray-400 hover:text-white text-gray-800 px-4 py-2 mr-2" onClick={onClose}>
					Cancle
				</button>
				<button className="rounded-md bg-red-500 hover:bg-red-700 text-white px-4 py-2" onClick={onConfirm}>
					Delete
				</button>
			
			</Modal.Footer>
		</Modal>
	);
}

export default ConfirmDeleteModal;
