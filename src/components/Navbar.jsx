import { Link } from "react-router-dom"
const Navbar = () => {
  return (
    <nav className=" shadow-neutral-500 shadow-lg">
      <ul className="list-none flex justify-center gap-8 p-4 bg-black opacity-85 text-white">
        <Link to="/"><li>MyReportGenerator</li></Link>
        <Link to="/placeholder"><li>Placeholder</li></Link>
      </ul>
    </nav>
  )
}

export default Navbar
