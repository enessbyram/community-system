import { NavLink, Link } from 'react-router-dom';
import logo from '../assets/images/logo.png';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRightToBracket } from "@fortawesome/free-solid-svg-icons";

const Header = ({ onLoginClick, user, onLogout }) => {
    return (
        <header className="w-full bg-[#062639] h-28 text-black flex items-center justify-center">
            <div className="container flex justify-between items-center px-4">

                {/* Logo */}
                <div className='flex flex-row items-center gap-4'>
                    <Link to="/" className='h-20 w-20 bg-white flex justify-between items-center rounded-full cursor-pointer'>
                        <img src={logo} className='h-full w-full' />
                    </Link>
                    <div className='flex flex-col'>
                        <h1 className='font-bold text-xl text-white'>İzmir Demokrasi Üniversitesi</h1>
                        <h3 className='text-lg text-white'>Öğrenci Toplulukları Bilgi Sistemi</h3>
                    </div>
                </div>

                {/* Nav */}
                <div className='flex flex-row text-white gap-4 text-md items-center'>
                    <NavLink
                        to="/"
                        className={({ isActive }) =>
                            `cursor-pointer ${isActive ? "border-b-2 font-semibold" : "font-normal"}`
                        }
                    >
                        Anasayfa
                    </NavLink>

                    <NavLink
                        to="/societies"
                        className={({ isActive }) =>
                            `cursor-pointer ${isActive ? "border-b-2 font-semibold" : "font-normal"}`
                        }
                    >
                        Topluluklar
                    </NavLink>

                    {user ? (
                        <NavLink to="/dashboard">
                            <button
                                className='bg-white rounded-lg py-1 px-2 text-[#062639] cursor-pointer'
                            >
                                Panelim
                            </button>
                        </NavLink>

                    ) : null}

                    {user ? (
                        <button
                            className='bg-white rounded-lg py-1 px-2 text-[#062639] cursor-pointer'
                            onClick={onLogout}
                        >
                            Çıkış Yap
                        </button>
                    ) : (
                        <button
                            className='bg-white rounded-lg py-1 px-2 text-[#062639] cursor-pointer'
                            onClick={onLoginClick}
                        >
                            <FontAwesomeIcon icon={faArrowRightToBracket} /> Giriş Yap
                        </button>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;
