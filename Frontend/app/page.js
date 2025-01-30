"use client";
import axios from "axios";
import React, { useState, useEffect } from "react";
import { Spinner } from "flowbite-react";
import {
	MagnifyingGlassIcon,
	PencilSquareIcon,
	ArchiveBoxXMarkIcon,
	BarsArrowDownIcon,
	BarsArrowUpIcon,
} from "@heroicons/react/24/solid";
import ProductModal from "../components/ProductModal";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";

axios.defaults.baseURL = "http://localhost:3000";

function Home() {
	//product data
	const [products, setProducts] = useState();
	const [isLoading, setIsLoading] = useState(true);

	//table
	const [searchProduct, setSearchProduct] = useState("");
	const [currentPage, setCurrentPage] = useState(1);
	const [itemsPerPage] = useState(10); //จำนวนข้อมูลที่ต้องการแสดงในแต่ละหน้า
	const [sortConfig, setSortConfig] = useState({
		//เริ่มต้นให้เรียงข้อมูลตามชื่อสินค้า
		key: "product_name",
		direction: "asc",
	});

	const filteredProducts = products?.filter((product) =>
		product.product_name.toLowerCase().includes(searchProduct.toLowerCase())
	);

	const sortedProducts = React.useMemo(() => { 
		// useMemo ใช้เพื่อจดจำ (memoize) ผลลัพธ์ของการเรียงลำดับสินค้า
		// เพื่อหลีกเลี่ยงการคำนวณซ้ำที่ไม่จำเป็นเมื่อ 
		// dependencies (filteredProducts, sortConfig) ไม่ได้เปลี่ยนแปลง
		if (!filteredProducts) return [];
		const sorted = [...filteredProducts];
		if (sortConfig.key) {
			sorted.sort((a, b) => {
				if (a[sortConfig.key] < b[sortConfig.key]) {
					return sortConfig.direction === "asc" ? -1 : 1;
				}
				if (a[sortConfig.key] > b[sortConfig.key]) {
					return sortConfig.direction === "asc" ? 1 : -1;
				}
				return 0;
			});
		}
		return sorted;
	}, [filteredProducts, sortConfig]);

	const requestSort = (key) => {
		let direction = "asc";
		if (sortConfig.key === key && sortConfig.direction === "asc") {
			direction = "desc";
		}
		setSortConfig({ key, direction });
	};

	const getSortDirection = (key) => {
		//สำหรับการเปลี่ยน icon ของการเรียงข้อมูล
		if (!sortConfig.key) {
			return;
		}
		return sortConfig.key === key ? sortConfig.direction : undefined;
	};

	//pagination
	const indexOfLastItem = currentPage * itemsPerPage;
	const indexOfFirstItem = indexOfLastItem - itemsPerPage;
	const currentItems = sortedProducts?.slice(indexOfFirstItem, indexOfLastItem); //แบ่งข้อมูล

	const totalPages = filteredProducts
		? Math.ceil(filteredProducts.length / itemsPerPage)
		: 0; //คำนวนโดย หารจำนวนข้อมูลทั้งหมด ด้วยจำนวนข้อมูลที่ต้องการแสดงในแต่ละหน้า

	const paginate = (pageNumber) => setCurrentPage(pageNumber);

	async function fetchProducts() {
		try {
			const res = await axios.get("/api/products").then((res) => {
				if (res.status === 200) {
					setProducts(res.data);
					console.log("products", res.data);
					setIsLoading(false);
				}
			});
		} catch (error) {
			console.log("error", error);
		}
	}

	useEffect(() => {
		fetchProducts();
	}, []);

	//Modal
	const [showModal, setShowModal] = useState(false);
	const [currentProduct, setCurrentProduct] = useState(null);

	const handleCreateProduct = () => {
		setCurrentProduct(null);
		setShowModal(true);
	};

	const handleEditProduct = (product) => {
		setCurrentProduct(product);
		setShowModal(true);
	};

	//Submit form
	const handleSubmit = async (e) => {
		e.preventDefault();
		const formData = new FormData(e.target);
		const productData = {
			product_name: formData.get("productName"),
			price: formData.get("price"),
			stock_quantity: formData.get("stockQuantity"),
		};

		try {
			if (currentProduct) {
				// Edit product
				await axios.patch(
					`/api/products/${currentProduct.product_id}`,
					productData
				);
			} else {
				// Create product
				await axios.post("/api/create", productData);
			}
			fetchProducts();
			setShowModal(false);
		} catch (error) {
			console.error("Error submitting form:", error);
		}
	};

	//Delete product
	const [showDeleteModal, setShowDeleteModal] = useState(false);

	const handleDeleteProduct = async () => {
		try {
			await axios.delete(`/api/products/${currentProduct.product_id}`);
			fetchProducts();
			setShowDeleteModal(false);
		} catch (error) {
			console.error("Error deleting product:", error);
		}
	};

	const confirmDeleteProduct = (product) => {
		setCurrentProduct(product);
		setShowDeleteModal(true);
	};

	const formatNumber = (number) => {
		return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	};

	return (
		<>
			<div className="container mx-auto p-5 h-screen">
				<div className="text-center">
					<h1 className="text-lg font-semibold pb-3 ">Product Stock</h1>
				</div>

				<div className="flex justify-between items-center">
					<div className="relative ">
						<div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
							<MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
						</div>
						<input
							type="text"
							id="searchProduct"
							className="block w-full p-3 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
							placeholder="Search Product..."
							value={searchProduct}
							onChange={(e) => setSearchProduct(e.target.value)}
						/>
					</div>
					<button
						className="ml-4 rounded bg-blue-500 hover:bg-blue-700 text-white py-2 px-4"
						onClick={handleCreateProduct}
					>
						+ New Product
					</button>
				</div>

				<div className="overflow-x-auto mt-3 rounded-lg shadow-lg bg-white">
					<table className="min-w-full divide-y divide-gray-200">
						<thead className="text-left bg-slate-50 ">
							<tr>
								<th
									className={`px-5 py-4 cursor-pointer ${
										getSortDirection("product_name")
											? "text-black"
											: "text-gray-500"
									}`}
									onClick={() => requestSort("product_name")}
								>
									<div className="flex items-center">
										Product name
										{getSortDirection("product_name") === "asc" ? (
											<BarsArrowDownIcon className="ml-1 size-5" />
										) : (
											<BarsArrowUpIcon className="ml-1 size-5" />
										)}
									</div>
								</th>
								<th
									className={`px-5 py-4 cursor-pointer  ${
										getSortDirection("price") ? "text-black" : "text-gray-500"
									}`}
									onClick={() => requestSort("price")}
								>
									<div className="flex items-center">
										Price
										{getSortDirection("price") === "asc" ? (
											<BarsArrowDownIcon className="ml-1 size-5" />
										) : (
											<BarsArrowUpIcon className="ml-1 size-5" />
										)}
									</div>
								</th>
								<th
									className={`px-5 py-4 cursor-pointer  ${
										getSortDirection("stock_quantity")
											? "text-black"
											: "text-gray-500"
									}`}
									onClick={() => requestSort("stock_quantity")}
								>
									<div className="flex items-center">
										Stock Quantity
										{getSortDirection("stock_quantity") === "asc" ? (
											<BarsArrowDownIcon className="ml-1 size-5" />
										) : (
											<BarsArrowUpIcon className="ml-1 size-5" />
										)}
									</div>
								</th>
								<th className="px-5 py-4">
									<span className="sr-only">Edit</span>
								</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-gray-200">
							{isLoading ? (
								<tr>
									<td colSpan="4" className="text-center">
										<Spinner size="xl" />
									</td>
								</tr>
							) : (
								currentItems.map((product) => (
									<tr
										key={product.product_id}
										className="text-left hover:bg-slate-50"
									>
										<td className="px-5 py-2">{product.product_name}</td>
										<td className="px-5 py-2">{formatNumber(product.price)}</td>
										<td className="px-5 py-2">
											{formatNumber(product.stock_quantity)}
										</td>
										<td className="px-5 py-2 flex justify-around">
											<button onClick={() => handleEditProduct(product)}>
												<PencilSquareIcon className="size-6 text-blue-500"></PencilSquareIcon>
											</button>
											<button onClick={() => confirmDeleteProduct(product)}>
												<ArchiveBoxXMarkIcon className="size-6 text-red-500"></ArchiveBoxXMarkIcon>
											</button>
										</td>
									</tr>
								))
							)}
						</tbody>
					</table>
				</div>
				{/* pagination */}
				<div className="flex flex-col items-center mt-4 text-slate-500">
					{filteredProducts && filteredProducts.length > 0 && (
						<p>
							Showing {indexOfFirstItem + 1} to{" "}
							{indexOfLastItem > filteredProducts.length
								? filteredProducts.length
								: indexOfLastItem}{" "}
							of {filteredProducts.length}
						</p>
					)}
					<nav className="mt-2">
						<ul className="inline-flex -space-x-px">
							<li>
								<button
									onClick={() => paginate(currentPage - 1)}
									disabled={currentPage === 1}
									className={`px-3 py-2 leading-tight ${
										currentPage === 1
											? "text-gray-400 border-gray-300 bg-white "
											: "text-gray-500 bg-white border-gray-300 hover:bg-gray-100 hover:text-gray-700"
									} border`}
								>
									&lt;
								</button>
							</li>
							{filteredProducts &&
								[...Array(totalPages)].map((_, index) => (
									<li key={index}>
										<button
											onClick={() => paginate(index + 1)}
											className={`px-3 py-2 leading-tight ${
												currentPage === index + 1
													? "text-blue-600 border-blue-300 bg-blue-50"
													: "text-gray-500 bg-white border-gray-300 hover:bg-gray-100 hover:text-gray-700"
											} border`}
										>
											{index + 1}
										</button>
									</li>
								))}
							<li>
								<button
									onClick={() => paginate(currentPage + 1)}
									disabled={currentPage === totalPages}
									className={`px-3 py-2 leading-tight ${
										currentPage === totalPages
											? "text-gray-400 border-gray-300 bg-white "
											: "text-gray-500 bg-white border-gray-300 hover:bg-gray-100 hover:text-gray-700"
									} border`}
								>
									&gt;
								</button>
							</li>
						</ul>
					</nav>
				</div>
			</div>
			{/* Modals */}
			<ProductModal
				show={showModal}
				onClose={() => setShowModal(false)}
				onSubmit={handleSubmit}
				product={currentProduct}
			/>
			<ConfirmDeleteModal
				show={showDeleteModal}
				onClose={() => setShowDeleteModal(false)}
				onConfirm={handleDeleteProduct}
				product={currentProduct}
			/>
		</>
	);
}

export default Home;
