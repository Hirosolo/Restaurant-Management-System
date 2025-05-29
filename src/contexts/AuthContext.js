import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

/* Context cho xác thực */
const AuthContext = createContext();

/* Provider cung cấp trạng thái xác thực và hàm quản lý */
export function AuthProvider({ children, initialAuthStatus, setPropAuthStatus, initialUserAddress, setPropUserAddress }) {
  const [authStatus, setAuthStatus] = useState(() => {
    const storedStatus = localStorage.getItem('authStatus');
    return storedStatus || initialAuthStatus || 'guest';
  });
  
  const [userAddress, setUserAddress] = useState(() => {
    try {
      const storedAddress = localStorage.getItem('userAddress');
      if (storedAddress && storedAddress !== 'null') {
        return JSON.parse(storedAddress);
      }
    } catch (err) {
      console.error('Error parsing userAddress from localStorage:', err);
    }
    return initialUserAddress || null;
  });

  const [userData, setUserData] = useState(() => {
    try {
      const storedUserData = localStorage.getItem('userData');
      if (storedUserData && storedUserData !== 'null') {
        return JSON.parse(storedUserData);
      }
    } catch (err) {
      console.error('Error parsing userData from localStorage:', err);
    }
    return null;
  });

  const [userContact, setUserContact] = useState(localStorage.getItem('userContact') || '');
  const navigate = useNavigate();

  // Sync authStatus with localStorage and parent component
  useEffect(() => {
    localStorage.setItem('authStatus', authStatus);
    if (setPropAuthStatus) {
      setPropAuthStatus(authStatus);
    }
  }, [authStatus, setPropAuthStatus]);

  // Sync userAddress with localStorage and parent component
  useEffect(() => {
    if (userAddress) {
      localStorage.setItem('userAddress', JSON.stringify(userAddress));
      if (setPropUserAddress) {
        setPropUserAddress(userAddress);
      }
    } else {
      localStorage.removeItem('userAddress');
    }
  }, [userAddress, setPropUserAddress]);

  // Load initial data from localStorage
  useEffect(() => {
    try {
      const storedAuthStatus = localStorage.getItem('authStatus');
      const storedUserData = localStorage.getItem('userData');
      const storedUserAddress = localStorage.getItem('userAddress');
      const storedUserContact = localStorage.getItem('userContact');

      if (storedAuthStatus) {
        setAuthStatus(storedAuthStatus);
      }

      if (storedUserData && storedUserData !== 'null') {
        setUserData(JSON.parse(storedUserData));
      }

      if (storedUserAddress && storedUserAddress !== 'null') {
        setUserAddress(JSON.parse(storedUserAddress));
      }

      if (storedUserContact) {
        setUserContact(storedUserContact);
      }

      console.log('AuthContext: Loaded from localStorage', {
        authStatus: storedAuthStatus,
        hasUserData: !!storedUserData,
        hasUserAddress: !!storedUserAddress,
        hasUserContact: !!storedUserContact
      });
    } catch (err) {
      console.error('Error loading auth data from localStorage:', err);
    }
  }, []);

  // Listen for userData updates
  useEffect(() => {
    const handleUserDataUpdate = (event) => {
      console.log('AuthContext: Received userData update event', event.detail);
      setUserData(event.detail.userData);
    };

    window.addEventListener('userDataUpdated', handleUserDataUpdate);

    return () => {
      window.removeEventListener('userDataUpdated', handleUserDataUpdate);
    };
  }, []);

  // Fetch user's address from database when component mounts for signed-in users
  useEffect(() => {
    const fetchUserAddress = async () => {
      if (authStatus === 'signedIn' && userData?.customer_id) {
        try {
          const token = localStorage.getItem('token');
          if (!token) {
            console.error('No token found for signed-in user');
            return;
          }

          console.log('Fetching user profile for address');
          const profileResponse = await fetch('http://localhost:3001/api/users/profile', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          if (profileResponse.ok) {
            const profileData = await profileResponse.json();
            console.log('Received profile data:', profileData);
            
            if (profileData.success && profileData.user.address) {
              try {
                // Try to parse the address if it's a JSON string
                const addressObj = typeof profileData.user.address === 'string' 
                  ? JSON.parse(profileData.user.address)
                  : profileData.user.address;

                console.log('Setting address object:', addressObj);
                setUserAddress(addressObj);
                localStorage.setItem('userAddress', JSON.stringify(addressObj));

                // Also update userData with the profile data which includes loyalty points
                setUserData(profileData.user);
                localStorage.setItem('userData', JSON.stringify(profileData.user));

              } catch (error) {
                console.error('Error parsing address:', error);
                // If parsing fails, store the address as is
                setUserAddress(profileData.user.address);
                localStorage.setItem('userAddress', JSON.stringify(profileData.user.address));

                // Even if address parsing fails, update userData with the rest of the profile data
                setUserData(profileData.user);
                localStorage.setItem('userData', JSON.stringify(profileData.user));
              }
            }
          } else {
            console.error('Failed to fetch profile:', await profileResponse.text());
          }
        } catch (error) {
          console.error('Error fetching user profile:', error);
        }
      }
    };

    fetchUserAddress();
  }, [authStatus, userData?.customer_id]);

  /* Xử lý đăng nhập */
  const handleSignIn = useCallback(async (email, password) => {
    console.log('AuthContext: Signing in', { email });
    
    try {
      const response = await fetch('http://localhost:3001/api/users/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Sign in failed');
      }

      // Store the token
      localStorage.setItem('token', data.token);
      
      // Update user data and auth status
      setUserData(data.user);
      setAuthStatus('signedIn');
      
      // Fetch user's profile to get their address
      const profileResponse = await fetch('http://localhost:3001/api/users/profile', {
        headers: {
          'Authorization': `Bearer ${data.token}`
        }
      });

      if (profileResponse.ok) {
        const profileData = await profileResponse.json();
        if (profileData.success && profileData.user.address) {
          try {
            // Try to parse the address if it's a JSON string
            const addressObj = typeof profileData.user.address === 'string' 
              ? JSON.parse(profileData.user.address)
              : profileData.user.address;

            console.log('Setting address object:', addressObj);
            setUserAddress(addressObj);
            localStorage.setItem('userAddress', JSON.stringify(addressObj));

            // Also update userData with the profile data which includes loyalty points
            setUserData(profileData.user);
            localStorage.setItem('userData', JSON.stringify(profileData.user));

          } catch (error) {
            console.error('Error parsing address:', error);
            // If parsing fails, store the address as is
            setUserAddress(profileData.user.address);
            localStorage.setItem('userAddress', JSON.stringify(profileData.user.address));

            // Even if address parsing fails, update userData with the rest of the profile data
            setUserData(profileData.user);
            localStorage.setItem('userData', JSON.stringify(profileData.user));
          }
        }
      }
      
      // Store auth data in localStorage
      localStorage.setItem('authStatus', 'signedIn');
      localStorage.setItem('userData', JSON.stringify(data.user));
      
      // Emit auth status change event
      const event = new CustomEvent('authStatusChanged', { 
        detail: { status: 'signedIn', user: data.user } 
      });
      window.dispatchEvent(event);
      
      console.log('AuthContext: Sign-in successful');
      return Promise.resolve();
    } catch (error) {
      console.error('AuthContext: Sign in error:', error);
      throw new Error(error.message);
    }
  }, []);

  /* Xử lý tạo tài khoản */
  const handleCreateAccount = useCallback(async (address, userInfo) => {
    console.log('AuthContext: Creating account', { userInfo, address });
    
    try {
      // Validate required fields
      if (!userInfo.password) {
        throw new Error('Password is required');
      }

      // Make API call to create account
      const requestBody = {
        email: userInfo.email,
        password: userInfo.password,
        firstName: userInfo.firstName,
        lastName: userInfo.lastName,
        contactMobile: userInfo.contactMobile,
        address: address
      };

      console.log('Sending registration request with data:', {
        ...requestBody,
        password: '***' // Hide password in logs
      });

      const response = await fetch('http://localhost:3001/api/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Account creation failed');
      }

      // Create new address from user info
      const newAddress = { 
        ...address, 
        fullName: `${userInfo.firstName} ${userInfo.lastName}`, 
        contactMobile: userInfo.contactMobile 
      };
      
      // Update user data
      setUserData(data.user);
      
      // Update auth status and address
      setAuthStatus('signedIn');
      setUserAddress(newAddress);
      
      // Store in localStorage
      localStorage.setItem('authStatus', 'signedIn');
      localStorage.setItem('userData', JSON.stringify(data.user));
      localStorage.setItem('userAddress', JSON.stringify(newAddress));
      
      // Emit auth status change event
      const event = new CustomEvent('authStatusChanged', { 
        detail: { status: 'signedIn', user: data.user } 
      });
      window.dispatchEvent(event);
      
      console.log('AuthContext: Account creation successful');
      return Promise.resolve();
    } catch (error) {
      console.error('AuthContext: Account creation error:', error);
      throw new Error(error.message);
    }
  }, [handleSignIn, setUserData, setAuthStatus, setUserAddress, navigate]);

  /* Xử lý đăng xuất */
  const handleSignOut = useCallback(() => {
    console.log('AuthContext: Signing out');
    
    // Clear user data and reset status
    setAuthStatus('guest');
    setUserData(null);
    setUserAddress(null);
    setUserContact('');
    
    // Clear localStorage
    localStorage.removeItem('authStatus');
    localStorage.removeItem('userData');
    localStorage.removeItem('userAddress');
    localStorage.removeItem('token');
    localStorage.removeItem('userContact');
    
    // Emit auth status change event
    const event = new CustomEvent('authStatusChanged', { 
      detail: { status: 'guest' } 
    });
    window.dispatchEvent(event);
    
    // Navigate to home
    navigate('/');
    
    console.log('AuthContext: Sign-out successful');
  }, [navigate]);

  /* Tiếp tục với tư cách khách */
  const continueAsGuest = useCallback(() => {
    console.log('AuthContext: Continuing as guest');
    
    setAuthStatus('guest');
    localStorage.setItem('authStatus', 'guest');
    
    // Emit auth status change event
    const event = new CustomEvent('authStatusChanged', { 
      detail: { status: 'guest' } 
    });
    window.dispatchEvent(event);
    
    console.log('AuthContext: Set status to guest');
    
    // Also clear userContact when continuing as guest
    setUserContact('');
    localStorage.removeItem('userContact');
  }, []);

  return (
    <AuthContext.Provider value={{
      authStatus,
      userAddress,
      userContact,
      userData,
      setUserAddress,
      setUserContact,
      handleSignIn,
      handleCreateAccount,
      handleSignOut,
      continueAsGuest
    }}>
      {children}
    </AuthContext.Provider>
  );
}

/* Hook để sử dụng AuthContext */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};