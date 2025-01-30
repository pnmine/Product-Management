import React from "react";
import { Modal, Button, TextInput, Label } from "flowbite-react";

function ProductModal({ show, onClose, onSubmit, product }) {
	return (
		<Modal show={show} onClose={onClose}>
			<Modal.Header>{product ? "Edit Product" : "Add Product"}</Modal.Header>
			<Modal.Body>
				<form onSubmit={onSubmit}>
					<div className="mb-4">
						<Label htmlFor="productName" value="Product Name" />
						<TextInput
							id="productName"
							name="productName"
							type="text"
							defaultValue={product?.product_name || ""}
							required
						/>
					</div>
					<div className="mb-4">
						<Label htmlFor="price" value="Price" />
						<TextInput
							id="price"
							name="price"
							type="number"
							defaultValue={product?.price || ""}
							required
						/>
					</div>
					<div className="mb-4">
						<Label htmlFor="stockQuantity" value="Stock Quantity" />
						<TextInput
							id="stockQuantity"
							name="stockQuantity"
							type="number"
							defaultValue={product?.stock_quantity || ""}
							required
						/>
					</div>
					<div className="flex justify-end">
						<Button type="submit">{product ? "Update" : "Add"}</Button>
					</div>
				</form>
			</Modal.Body>
		</Modal>
	);
}

export default ProductModal;
