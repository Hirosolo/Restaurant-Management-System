import { useState } from 'react';

// Predefined address options
const addressOptions = {
  wards: [
    'Phường 1', 'Phường 2', 'Phường 3', 'Phường 4', 'Phường 5',
    'Phường 6', 'Phường 7', 'Phường 8', 'Phường 9', 'Phường 10'
  ],
  districts: [
    'Quận 1', 'Quận 2', 'Quận 3', 'Quận 4', 'Quận 5',
    'Quận 6', 'Quận 7', 'Quận 8', 'Quận 9', 'Quận 10',
    'Quận 11', 'Quận 12', 'Thủ Đức', 'Bình Thạnh', 'Gò Vấp'
  ],
  streets: [
    'Nguyễn Huệ', 'Lê Lợi', 'Đồng Khởi', 'Lê Duẩn', 'Nguyễn Du',
    'Lý Tự Trọng', 'Đồng Nai', 'Võ Văn Tần', 'Lê Văn Sỹ', 'Nguyễn Văn Trỗi'
  ]
};

/* Hook quản lý trạng thái địa chỉ và dropdown */
export function useAddress() {
  /* Trạng thái cho các trường địa chỉ */
  const [address, setAddress] = useState({
    ward: '',
    district: '',
    street: '',
    houseNumber: '',
    buildingName: '',
    block: '',
    floor: '',
    roomNumber: '',
    deliveryInstructions: ''
  });

  /* Trạng thái cho dropdown */
  const [dropdownOpen, setDropdownOpen] = useState({
    ward: false,
    district: false,
    street: false
  });

  /* Cập nhật trường địa chỉ */
  const updateAddressField = (field, value) => {
    setAddress(prev => ({ ...prev, [field]: value }));
  };

  /* Bật/tắt dropdown */
  const toggleDropdown = (field) => {
    setDropdownOpen(prev => ({ ...prev, [field]: !prev[field] }));
  };

  return {
    address,
    updateAddressField,
    dropdownOpen,
    toggleDropdown,
    addressOptions
  };
}