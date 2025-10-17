
import { Link, useRouteError } from "react-router-dom";

const Error = () => {
  const error = useRouteError();
  console.log(error);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="form text-center max-w-md w-full">
        <h1 className="mb-4" style={{ color: "var(--primary-500)" }}>
          {error?.status || "Error"}
        </h1>
        <h2 className="mb-6">{error?.statusText || "Something went wrong"}</h2>
        <p className="mb-8" style={{ color: "var(--text-secondary-color)" }}>
          {error?.message ||
            "We apologize for the inconvenience. Please try again later."}
        </p>

        {/* Show stack trace only in development */}
        {error?.stack && process.env.NODE_ENV === "development" && (
          <pre
            className="mt-6 text-left p-4 rounded-md overflow-auto text-sm"
            style={{
              background: "var(--background-color)",
              color: "var(--text-secondary-color)",
            }}
          >
            {error.stack}
          </pre>
        )}

        <div className="mt-8">
          <Link to="/">
            <button className="btn">Return to Home</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Error;
