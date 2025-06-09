import { useState } from 'react';

const useNavbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  return { isMobileMenuOpen, toggleMobileMenu };
};
export default useNavbar;