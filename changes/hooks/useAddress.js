import { useState } from 'react';
import { addressOptions } from '../data/menuData';

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