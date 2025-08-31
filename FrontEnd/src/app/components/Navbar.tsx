"use client";
import Link from "next/link";

export default function Navbar() {
  return (
    <div>
      <nav className="bg-violet-800 text-white py-4">
        <div className="container mx-auto flex justify-between items-center px-4">
          <h1 className="text-lg font-bold">Meu Site</h1>
          <ul className="flex space-x-4">
            <li>
              <Link href="/">
                <button className="hover:underline">Home</button>
              </Link>
            </li>
            <li>
              <Link href="/LoginPage">
                <button className="hover:underline">Login</button>
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </div>
  );
}
