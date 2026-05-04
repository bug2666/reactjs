import { Globe, Earth, Share2, Wallet,WalletCards  } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-white py-10">
            <div className="container mx-auto px-20">
                <div className="grid md:grid-cols-4">
                    <div>
                        <div className="text-xl font-bold mb-4 ">LOGO</div>
                        <p className="text-gray-500 text-sm">Redefining the standards of footwear<br></br> through engineering and artistic vision</p>
                        <div className="flex gap-2 py-10">
                            <a className='hover:text-orange-500' href="#"><Earth size={20} /></a>
                            <a className='hover:text-orange-500' href="#"><Globe size={20} /></a>
                            <a className='hover:text-orange-500' href="#"><Share2 size={20} /></a>
                        </div>
                    </div>

                    <div>
                        <h4 className="font-bold mb-4">Collections</h4>
                        <ul className="text-gray-600 mb-20 space-y-4">
                            <li className='hover:text-orange-400'><a href="#">Running</a></li>
                            <li className='hover:text-orange-400'> <a href="#"></a>Lifestyle</li>
                            <li className='hover:text-orange-400'> <a href="#">Basketball</a></li>
                            <li className='hover:text-orange-400'> <a href="#">Limited Drops</a></li>
                        </ul>
                    </div>


                    <div>
                        <h4 className="font-bold mb-4">Support</h4>
                        <ul className="text-gray-600 mb-20 space-y-4">
                            <li className='hover:text-orange-400'><a href="#">Shipping & Returns</a></li>
                            <li className='hover:text-orange-400'> <a href="#"></a>Contact Support</li>
                            <li className='hover:text-orange-400'> <a href="#">Size Guide</a></li>
                            <li className='hover:text-orange-400'> <a href="#">Order Tracking</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold mb-4">Company</h4>
                        <ul className="text-gray-600 mb-20 space-y-4">
                            <li className='hover:text-orange-400'><a href="#">About Us</a></li>
                            <li className='hover:text-orange-400'> <a href="#"></a>Privacy Policy</li>
                            <li className='hover:text-orange-400'> <a href="#">Terms of Service</a></li>
                            <li className='hover:text-orange-400'> <a href="#">Retail Stores</a></li>
                        </ul>
                    </div>
                </div>


                {/* chưa có div 2 */}
                <div className="flex items-center justify-between border-t border-gray-100 py-8 w-full">
                    <div className='text-gray-400 text-sm'>
                        © 2026 VELOCITY. All rights reserved.
                    </div>
                    <div className='flex items-center gap-2 text-gray-400 text-sm font-bold'>
                        <span>Payment methods accepted: </span>
                        <Wallet size={18} />
                        <WalletCards size={17} />
                    </div>

                </div>







            </div>
        </footer>
    )
}