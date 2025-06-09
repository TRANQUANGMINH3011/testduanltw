import './Hero.less';
import muonDoImage from '@/assets/devices.jpg';

// import { useHero } from './useHero';

const Hero = () => {
//   useHero(); // Tạm thời chưa dùng gì, nhưng chuẩn bị cho tương lai

  return (
    <section className="hero">
      <div className="hero__container">
        <div className="hero__grid">
          {/* Left Content */}
          <div className="hero__content">
            <h1 className="hero__title">
              Đồ dùng trong tay , Quản lý trong tầm
            </h1>
            <p className="hero__subtitle">
              Xem đồ dùng, kiểm tra tình trạng và quản lý mượn trả , chỉ trong một hệ thống.
            </p>
            <div className="hero__buttons">
              <button className="hero__btn-start">
                Bắt đầu ngay
              </button>
              <button className="hero__btn-learn">
                Tìm hiểu thêm
              </button>
            </div>
          </div>

          {/* Right Content */}
          <div className="hero__image-wrapper">
            <div className="hero__image-container">
              <img
                src={muonDoImage}
                alt="Ảnh minh họa mượn đồ"
                className="hero__image"
              />
              <div className="hero__image-overlay"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
