import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

/* Context cho xác thực */
const AuthContext = createContext();

/* Provider cung cấp trạng thái xác thực và hàm quản lý */
export function AuthProvider({ children, initialAuthStatus, setPropAuthStatus, initialUserAddress, setPropUserAddress }) {
  /* Trạng thái xác thực, khởi tạo từ initialAuthStatus */
  const [authStatus, setAuthStatus] = useState(initialAuthStatus || localStorage.getItem('authStatus') || 'guest');
  
  /* Trạng thái địa chỉ, khởi tạo từ localStorage hoặc initialUserAddress */
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

  /* Trạng thái dữ liệu người dùng, khởi tạo từ localStorage */
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

  const navigate = useNavigate();

  // Load dữ liệu từ localStorage khi component mount
  useEffect(() => {
    try {
      const storedAuthStatus = localStorage.getItem('authStatus');
      const storedUserData = localStorage.getItem('userData');
      const storedUserAddress = localStorage.getItem('userAddress');

      if (storedAuthStatus) {
        setAuthStatus(storedAuthStatus);
      }

      if (storedUserData && storedUserData !== 'null') {
        setUserData(JSON.parse(storedUserData));
      }

      if (storedUserAddress && storedUserAddress !== 'null') {
        setUserAddress(JSON.parse(storedUserAddress));
      }

      console.log('AuthContext: Loaded from localStorage', {
        authStatus: storedAuthStatus,
        hasUserData: !!storedUserData,
        hasUserAddress: !!storedUserAddress
      });
    } catch (err) {
      console.error('Error loading auth data from localStorage:', err);
    }
  }, []);

  /* Xử lý đăng nhập */
  const handleSignIn = useCallback((email, password, redirectToAccount = false) => {
    console.log('AuthContext: Signing in', { email, redirectToAccount });
    
    // Ở đây bạn có thể thêm logic kiểm tra thông tin đăng nhập
    
    // Giả lập thông tin người dùng sau khi đăng nhập thành công
    const userInfo = {
      email,
      firstName: 'Người',
      lastName: 'Dùng',
      contactMobile: '0123456789'
    };
    
    setUserData(userInfo);
    setAuthStatus('signedIn');
    if (setPropAuthStatus) {
      setPropAuthStatus('signedIn');
    }
    localStorage.setItem('authStatus', 'signedIn');
    localStorage.setItem('userData', JSON.stringify(userInfo));
    
    // Phát ra sự kiện về thay đổi trạng thái đăng nhập
    const event = new CustomEvent('authStatusChanged', { 
      detail: { status: 'signedIn', user: userInfo } 
    });
    window.dispatchEvent(event);
    
    console.log('AuthContext: Auth status updated to signedIn');
    console.log('AuthContext: localStorage after update:', localStorage.getItem('authStatus'));
    
    // Chỉ chuyển hướng đến trang tài khoản nếu redirectToAccount = true
    if (redirectToAccount) {
      console.log('AuthContext: Navigating to /account');
      navigate('/account');
    }
    
    console.log('AuthContext: Sign-in successful');
    return Promise.resolve();
  }, [setPropAuthStatus, navigate]);

  /* Xử lý tạo tài khoản */
  const handleCreateAccount = useCallback((address, userInfo, redirectToAccount = false) => {
    console.log('AuthContext: Creating account', { userInfo, redirectToAccount });
    
    // Tạo địa chỉ mới từ thông tin người dùng
    const newAddress = { 
      ...address, 
      fullName: `${userInfo.firstName} ${userInfo.lastName}`, 
      contactMobile: userInfo.contactMobile 
    };
    
    // Cập nhật thông tin người dùng
    setUserData({
      email: userInfo.email,
      firstName: userInfo.firstName,
      lastName: userInfo.lastName,
      contactMobile: userInfo.contactMobile
    });
    
    // Cập nhật trạng thái xác thực và địa chỉ
    setAuthStatus('signedIn');
    if (setPropAuthStatus) {
      setPropAuthStatus('signedIn');
    }
    setUserAddress(newAddress);
    if (setPropUserAddress) {
      setPropUserAddress(newAddress);
    }
    
    // Lưu thông tin vào localStorage
    localStorage.setItem('authStatus', 'signedIn');
    localStorage.setItem('userData', JSON.stringify(userInfo));
    localStorage.setItem('userAddress', JSON.stringify(newAddress));
    
    // Phát ra sự kiện về thay đổi trạng thái đăng nhập
    const event = new CustomEvent('authStatusChanged', { 
      detail: { status: 'signedIn', user: userInfo } 
    });
    window.dispatchEvent(event);
    
    console.log('AuthContext: Auth status updated to signedIn');
    console.log('AuthContext: localStorage after update:', localStorage.getItem('authStatus'));
    
    // Chỉ chuyển hướng đến trang tài khoản nếu redirectToAccount = true
    if (redirectToAccount) {
      console.log('AuthContext: Navigating to /account');
      navigate('/account');
    }
    
    console.log('AuthContext: Account creation successful');
    return Promise.resolve();
  }, [setPropAuthStatus, setPropUserAddress, navigate]);

  /* Xử lý đăng xuất */
  const handleSignOut = useCallback(() => {
    console.log('AuthContext: Signing out');
    
    // Xóa thông tin người dùng và đặt lại trạng thái
    setAuthStatus('guest');
    setUserData(null);
    setUserAddress(null);
    if (setPropAuthStatus) {
      setPropAuthStatus('guest');
    }
    
    // Xóa thông tin từ localStorage
    localStorage.removeItem('authStatus');
    localStorage.removeItem('userData');
    localStorage.removeItem('userAddress');
    
    // Phát ra sự kiện về thay đổi trạng thái đăng nhập
    const event = new CustomEvent('authStatusChanged', { 
      detail: { status: 'guest' } 
    });
    window.dispatchEvent(event);
    
    // Chuyển hướng về trang chủ
    navigate('/');
    
    console.log('AuthContext: Sign-out successful');
  }, [setPropAuthStatus, navigate]);

  /* Tiếp tục với tư cách khách */
  const continueAsGuest = useCallback(() => {
    console.log('AuthContext: Continuing as guest');
    
    setAuthStatus('guest');
    if (setPropAuthStatus) {
      setPropAuthStatus('guest');
    }
    localStorage.setItem('authStatus', 'guest');
    
    // Phát ra sự kiện về thay đổi trạng thái đăng nhập
    const event = new CustomEvent('authStatusChanged', { 
      detail: { status: 'guest' } 
    });
    window.dispatchEvent(event);
    
    console.log('AuthContext: Set status to guest');
    console.log('AuthContext: localStorage after update:', localStorage.getItem('authStatus'));
  }, [setPropAuthStatus]);

  return (
    <AuthContext.Provider value={{
      authStatus,
      userAddress,
      userData,
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