import { Menu, X } from 'lucide-react';
import  useNavbar  from './useNavbar';
import './Navbar.less';

const Navbar = () => {
  const { isMobileMenuOpen, toggleMobileMenu } = useNavbar();

  return (
    <>
      <header className="navbar">
        <div className="navbar__container">
          <div className="navbar__logo">
            <div className="navbar__logo-icon">LH</div>
            <span className="navbar__logo-text">LendHub</span>
          </div>

          <nav className="navbar__menu">
            <a href="#">Trang Chủ</a>
            <a href="#">Kho mượn</a>
            <a href="#">Hướng dẫn</a>
            <a href="#">Liên hệ</a>
            <button className="navbar__login-btn">Đăng nhập</button>
            <button className="navbar__signup-btn">Đăng ký tài khoản</button>
          </nav>

          <button className="navbar__mobile-toggle" onClick={toggleMobileMenu}>
            {isMobileMenuOpen ? (
              <X className="navbar__icon" />
            ) : (
              <Menu className="navbar__icon" />
            )}
          </button>
        </div>
      </header>

      {isMobileMenuOpen && (
        <div className="navbar__mobile-overlay">
          <div className="navbar__mobile-backdrop" onClick={toggleMobileMenu}></div>
          <div className="navbar__mobile-menu">
            <div className="navbar__mobile-header">
              <div className="navbar__logo">
                <div className="navbar__logo-icon">LH</div>
                <span className="navbar__logo-text">LendHub</span>
              </div>
              <button onClick={toggleMobileMenu} className="navbar__mobile-close">
                <X className="navbar__icon" />
              </button>
            </div>

            <nav className="navbar__mobile-links">
              <a href="http://localhost:3456/user/devices">Trang Chủ</a>
              <a href="#">Kho mượn</a>
              <a href="#">Hướng dẫn</a>
              <a href="#">Liên hệ</a>
              <button className="navbar__mobile-login-btn">Đăng nhập</button>
              <button className="navbar__mobile-signup-btn">Đăng ký tài khoản</button>
            </nav>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
