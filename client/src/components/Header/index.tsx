import { Link } from 'react-router-dom';
import { useState } from 'react'
import { type MouseEvent} from 'react';
import Auth from '../../utils/auth';

const Header = () => {
  const logout = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    // Logs the user out by calling the logout method from Auth
    Auth.logout();
    

  };
      //Drop down hovering
     const [hover, setHover] = useState(false);
  return (
    <header className="bg-primary text-light mb-4 py-3 flex-row align-center">
      <div className="container flex-row justify-space-between-lg justify-center align-center">
        <div>
          <Link className="text-light" to="/">
            <h1 className="m-0">Sheet Share</h1>
          </Link>
          <p className="m-0">Create and Share for those Table Top affairs!</p>
        </div>
        <div>
          {/* Checking if the user is logged in to conditionally render profile link and logout button */}
          {Auth.loggedIn() ? (
            <>

              <button className="btn btn-lg btn-light m-2" onClick={logout}>
                Logout
              </button>
              
      <h1
        className="btn btn-lg btn-info m-2"
        onMouseOver={() => setHover(true)}
        onMouseOut={() => setHover(false)}
        style={{ position: "relative", display: "inline-block" }}
      >
        My Character
        {hover && (
          <div
style={{
  position: "absolute",
  top: "100%",
  left: 0,
  width: "150px",
  zIndex: 1,
  padding: "4px",
  transform: hover ? "translateY(0)" : "translateY(-100%)",
  transition: "transform 0.3s ease-in-out",
  opacity: hover ? 1 : 0,
  visibility: hover ? "visible" : "hidden"
}}
>
              <Link className="btn btn-lg btn-info m-2" to="/me">
                D&D 5e
              </Link>
              <Link className="btn btn-lg btn-info m-2" to="/login">
                COC 7e
              </Link>
          </div>
        )}
      </h1>

 <h1
        className="btn btn-lg btn-info m-2"
        onMouseOver={() => setHover(true)}
        onMouseOut={() => setHover(false)}
        style={{ position: "relative", display: "inline-block" }}
      >
        Search
        {hover && (
          <div
style={{
  position: "absolute",
  top: "100%",
  left: 0,
  width: "150px",
  zIndex: 1,
  padding: "4px",
  transform: hover ? "translateY(0)" : "translateY(-100%)",
  transition: "transform 0.3s ease-in-out",
  opacity: hover ? 1 : 0,
  visibility: hover ? "visible" : "hidden"
}}
>
              <Link className="btn btn-lg btn-info m-2" to="/login">
                D&D 5e
              </Link>
              <Link className="btn btn-lg btn-info m-2" to="/login">
                COC 7e
              </Link>
          </div>
        )}
      </h1>
            
            </>
          ) : (
            <>
              <Link className="btn btn-lg btn-info m-2" to="/login">
                Login
              </Link>
              <Link className="btn btn-lg btn-light m-2" to="/signup">
                Signup
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
