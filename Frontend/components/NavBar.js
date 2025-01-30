"use client";
import React from "react";
import Image from "next/image";
import { BuildingStorefrontIcon } from "@heroicons/react/24/solid";
import Link from "next/link";

function NavBar(params) {
	return (
		<>
			<nav className="shadow-md flex justify-between items-center bg-white p-4 w-100">
				<div className="flex items-center">
					<BuildingStorefrontIcon className="size-10" />
					<h1 className="self-end text-2xl font-bold ml-5">
						Products Management
					</h1>
				</div>
				<div>
					<ul>
						<li>
							<Link
								href="http://line.me/ti/p/~pnmine"
								rel="noopener noreferrer"
								target="_blank"
								className="font-semibold text-slate-500 "
							>
								Prapatsorn Sangrod
							</Link>
						</li>
					</ul>
				</div>
			</nav>
		</>
	);
}
export default NavBar;
