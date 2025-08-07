import React from "react";

type ErrorPageProps = {
  statusCode?: number;
};

function ErrorPage({ statusCode }: ErrorPageProps) {
  return (
    <div className="ErrorPage mx-auto max-w-screen-sm p-6 text-center">
      <h1 className="Title mb-2 text-2xl font-semibold">
        Something went wrong
      </h1>
      <p className="Description text-stone-600">
        {statusCode ? `An error ${statusCode} occurred.` : "An error occurred."}
      </p>
    </div>
  );
}

// @ts-expect-error - Next.js will inject the context type at runtime
ErrorPage.getInitialProps = ({ res, err }) => {
  const statusCode = res?.statusCode ?? err?.statusCode ?? 404;
  return { statusCode } as ErrorPageProps;
};

export default ErrorPage;
