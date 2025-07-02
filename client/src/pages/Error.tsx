import { useRouteError } from 'react-router-dom';

interface RouteError {
  statusText?: string;
  message?: string;
}

export default function ErrorPage() {
  const error = useRouteError() as RouteError;
  console.error(error);

  return (
    <div id="error-page">
      <h1>Oops!</h1>
      <p>Sorry, an unexpected error has occurred while loading your character sheets.</p>
      <p>
        <i>{error.statusText || error.message}</i>
      </p>
      <p>
        <a href="/">Return to Sheet Share home</a>
      </p>
    </div>
  );
}