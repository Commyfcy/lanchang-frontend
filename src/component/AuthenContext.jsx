
import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkToken = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await axios.post('http://localhost:3333/authen', {}, {
            headers: { Authorization: `Bearer ${token}` }
          });
          
          if (response.data.status === 'ok') {
            setIsAuthenticated(true);
            setUser({
              email: response.data.decoded.email,
              role: response.data.decoded.role
            });
          } else {
            
            localStorage.removeItem('token');
            localStorage.removeItem('role');
          }
        } catch (error) {
          localStorage.removeItem('token');
          localStorage.removeItem('role');
        }
      }
      setLoading(false);
    };
    
    checkToken();
  }, []);

// Debug version of the login function
const login = async (email, password) => {
  try {
    console.log('Attempting login with:', email);
    const response = await axios.post('http://localhost:3333/login', { email, Password: password });
    console.log('Login response:', response.data);
    
    if (response.data.status === 'ok') {
      // Store token in sessionStorage
      sessionStorage.setItem('token', response.data.token);
      sessionStorage.setItem('role', response.data.role);
      
      // Set authentication state
      setIsAuthenticated(true);
      setUser({
        email: email,
        role: response.data.role
      });
      
      console.log('Login successful, auth state:', true);
      console.log('User set to:', { email, role: response.data.role });
      
      return { success: true };
    }
    return { success: false, message: response.data.message };
  } catch (error) {
    console.error('Login error:', error);
    return { success: false, message: error.response?.data?.message || 'Login failed' };
  }
};
  // ฟังก์ชันสำหรับ logout
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setIsAuthenticated(false);
    setUser(null);
  };

  const authAxios = axios.create({
    baseURL: 'http://localhost:3333'
  });
  
  // เพิ่ม interceptor เพื่อแนบ token ในทุก request
  authAxios.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      user, 
      loading, 
      login, 
      logout,
      authAxios // axios ที่มี token พร้อมใช้งาน
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook สำหรับเรียกใช้ Context
export const useAuth = () => useContext(AuthContext);