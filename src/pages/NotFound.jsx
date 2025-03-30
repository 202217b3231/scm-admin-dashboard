import { Link } from "react-router-dom";
import { Snail } from "lucide-react";
const NotFoundPage = () => {
  return (
    <div className="flex flex-col font-bold text-4xl justify-center mt-10 place-items-center">
      <h1>404</h1>
      <h1>Sorry!</h1>
      <p>This page doesn't exist </p>
      <Link to="/" className="text-blue-400 underline">
        You can go home now!
      </Link>
      <Snail className="mt-10 text-green-300" size={400} />
    </div>
  );
};
export default NotFoundPage;
