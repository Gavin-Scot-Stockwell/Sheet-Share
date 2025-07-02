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

  // Drop down hovering states
  const [characterHover, setCharacterHover] = useState(false);
  const [searchHover, setSearchHover] = useState(false);

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
              
              <div
                className="btn btn-lg btn-info m-2"
                onMouseOver={() => setCharacterHover(true)}
                onMouseOut={() => setCharacterHover(false)}
                style={{ position: "relative", display: "inline-block" }}
              >
                My Characters
                {characterHover && (
                  <div
                    style={{
                      position: "absolute",
                      top: "100%",
                      left: 0,
                      width: "150px",
                      zIndex: 1000,
                      backgroundColor: "white",
                      borderRadius: "4px",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                      padding: "8px",
                      transform: characterHover ? "translateY(0)" : "translateY(-100%)",
                      transition: "transform 0.3s ease-in-out",
                      opacity: characterHover ? 1 : 0,
                      visibility: characterHover ? "visible" : "hidden"
                    }}
                  >
                    <Link className="btn btn-sm btn-primary d-block mb-2" to="/me">
                      D&D 5e
                    </Link>
                    <Link className="btn btn-sm btn-secondary d-block" to="/coc7e">
                      CoC 7e
                    </Link>
                  </div>
                )}
              </div>

              <div
                className="btn btn-lg btn-info m-2"
                onMouseOver={() => setSearchHover(true)}
                onMouseOut={() => setSearchHover(false)}
                style={{ position: "relative", display: "inline-block" }}
              >
                Browse
                {searchHover && (
                  <div
                    style={{
                      position: "absolute",
                      top: "100%",
                      left: 0,
                      width: "150px",
                      zIndex: 1000,
                      backgroundColor: "white",
                      borderRadius: "4px",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                      padding: "8px",
                      transform: searchHover ? "translateY(0)" : "translateY(-100%)",
                      transition: "transform 0.3s ease-in-out",
                      opacity: searchHover ? 1 : 0,
                      visibility: searchHover ? "visible" : "hidden"
                    }}
                  >
                    <Link className="btn btn-sm btn-primary d-block mb-2" to="/browse/dnd5e">
                      D&D 5e
                    </Link>
                    <Link className="btn btn-sm btn-secondary d-block" to="/browse/coc7e">
                      CoC 7e
                    </Link>
                  </div>
                )}
              </div>
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