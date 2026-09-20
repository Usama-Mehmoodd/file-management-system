// import {
//   createContext,
//   useContext,
//   useState,
//   useEffect,
// } from "react";

// import api from "../utilities/axios";

// const AuthContext = createContext(null);

// export function AuthProvider({ children }) {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     let isMounted = true;

//     const checkAuth = async () => {
//       try {
//         const res = await api.get("/me");

//         if (isMounted) {
//           setUser(res.data.user);
//         }
//       } catch (error) {
//         if (isMounted) {
//           setUser(null);
//         }

//         console.error("Auth check failed:", error);
//       } finally {
//         if (isMounted) {
//           setLoading(false);
//         }
//       }
//     };

//     checkAuth();

//     return () => {
//       isMounted = false;
//     };
//   }, []);

//   const login = (userData) => {
//     setUser(userData);
//   };

//   const logout = async () => {
//     try {
//       await api.post("/logout");
//     } finally {
//       setUser(null);
//     }
//   };

//   return (
//     <AuthContext.Provider
//       value={{ user, loading, login, logout }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// }

// export const useAuth = () => useContext(AuthContext);

import {
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";

import api from "../utilities/axios";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const checkAuth = async () => {
      try {
        const res = await api.get("/me");

        if (isMounted) {
          setUser(res.data.user);
        }
      } catch (error) {
        if (isMounted) {
          setUser(null);
        }

        console.error("Auth check failed:", error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    checkAuth();

    return () => {
      isMounted = false;
    };
  }, []);

  const login = (userData) => {
    setUser(userData);
  };

  const logout = async () => {
    try {
      await api.post("/logout");
    } finally {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);