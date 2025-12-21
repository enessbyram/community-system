import logo from '../assets/images/logo.png';
import twitter from '../assets/icons/twitter.png';
import youtube from '../assets/icons/youtube.png';
import instagram from '../assets/icons/instagram.png';
import facebook from '../assets/icons/facebook.png';

export default function Footer() {
    return (
        <footer className="bg-[#062639] w-full h-70 flex flex-col items-center justify-center text-white px-20 py-8 gap-8">
            <div className='container flex justify-center flex-col gap-4 items-center'>
                <div className='flex flex-row gap-4 w-full h-50 items-center justify-between'>
                    <div className='flex flex-row w-240 h-full items-center justify-center gap-4'>
                        <div className='rounded-full bg-white w-40 h-auto'>
                            <img src={logo} className='w-auto h-auto' />
                        </div>
                        <div className='w-160'>
                            <h1 className='text-xl font-semibold'>İzmir Demokrasi Üniversitesi</h1>
                            <p className='text-sm'>Hedefimiz, öncelikle insanlık değerlerine sahip, Ülkemize faydalı, yenilikçi, teknolojiyi yakından takip eden ve geliştiren vizyon sahibi öğrenciler yetiştirmektedir.</p>
                        </div>
                    </div>
                    <div className='flex flex-row items-center gap-2'>
                        <img src={twitter} className='w-10 h-10 cursor-pointer' />
                        <img src={facebook} className='w-10 h-10 cursor-pointer' />
                        <img src={instagram} className='w-10 h-10 cursor-pointer' />
                        <img src={youtube} className='w-10 h-10 cursor-pointer' />
                    </div>
                </div>
                <hr className='w-full' />
                <p>© 2025 İzmir Demokrasi Üniversitesi. Tüm hakları saklıdır.</p>
            </div>
        </footer>
    );
}