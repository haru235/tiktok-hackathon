export default function Footer() {
    return (
        <footer className="bg-black text-white py-8 px-4">
            <div className="max-w-7xl mx-auto gap-8 flex flex-col-reverse lg:flex-row justify-between items-start">
                {/* Left side with lists */}
                <div className="flex ml-20 items-center lg:items-start justify-center flex-col gap-5 lg:flex-row space-x-16">
                    {/* Company list */}
                    <div className="ml-12">
                        <h4 className="text-xl font-semibold mb-4">Company</h4>
                        <ul className="text-gray-300 space-y-2">
                            <li><a href="#">TikTok</a></li>
                            <li><a href="#">TikTok for Business</a></li>
                            <li><a href="#">CapCut</a></li>
                        </ul>
                    </div>
                    {/* Product list */}
                    <div>
                        <h4 className="text-xl font-semibold mb-4">Product</h4>
                        <ul className="text-gray-300 space-y-2">
                            <li><a href="#">Seller Center</a></li>
                            <li><a href="#">App Store</a></li>
                            <li><a href="#">Agencies & Services</a></li>
                            <li><a href="#">LIVE Manager</a></li>
                            <li><a href="#">CapCut creative suite</a></li>
                            <li><a href="#">Partner Desktop</a></li>
                        </ul>
                    </div>
                    {/* Support list */}
                    <div>
                        <h4 className="text-xl font-semibold mb-4">Support</h4>
                        <ul className="space-y-2 text-gray-300">
                            <li><a href="#">Academy</a></li>
                            <li><a href="#">Feature guide</a></li>
                            <li><a href="#">Policy Center</a></li>
                            <li><a href="#">Contact us</a></li>
                            <li><a href="#">File a complaint</a></li>
                        </ul>
                    </div>
                </div>

                {/* Right side with SVG icons */}
                <div className="flex space-x-6">
                    <a href="#" className="hover:text-customTeal">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12.4729 1.2182C13.6519 1.2002 14.8218 1.2092 15.9918 1.2002C16.0638 2.57718 16.5588 3.98116 17.5668 4.95315C18.5748 5.95214 19.9968 6.41113 21.3828 6.56413V10.1911C20.0868 10.1461 18.7818 9.87609 17.6028 9.31809C17.0898 9.0841 16.6128 8.7871 16.1448 8.4811C16.1358 11.1091 16.1538 13.737 16.1268 16.356C16.0548 17.616 15.6408 18.867 14.9118 19.902C13.7329 21.6299 11.6899 22.7549 9.59291 22.7909C8.30593 22.8629 7.01894 22.5119 5.92096 21.8639C4.10298 20.7929 2.825 18.831 2.636 16.725C2.618 16.275 2.609 15.825 2.627 15.384C2.789 13.674 3.63499 12.0361 4.94897 10.9201C6.44295 9.62409 8.53092 9.0031 10.4839 9.37209C10.5019 10.7041 10.4479 12.0361 10.4479 13.368C9.55691 13.08 8.51293 13.161 7.72993 13.701C7.16294 14.07 6.73095 14.637 6.50595 15.276C6.31695 15.735 6.37095 16.239 6.37995 16.725C6.59595 18.201 8.01793 19.443 9.52991 19.308C10.5379 19.299 11.5009 18.714 12.0229 17.859C12.1939 17.562 12.3829 17.256 12.3919 16.905C12.4819 15.294 12.4459 13.692 12.4549 12.0811C12.4639 8.4541 12.4459 4.83615 12.4729 1.2182Z" fill="white" />
                        </svg>
                    </a>
                    <a href="#" className="hover:text-customTeal">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M22.8651 12.0668C22.8651 6.06479 18.0005 1.2002 11.9994 1.2002C5.99838 1.2002 1.13379 6.06479 1.13379 12.0668C1.13379 17.4892 5.10733 21.9843 10.3015 22.7993V15.2072H7.54325V12.0658H10.3015V9.67249C10.3015 6.9486 11.9243 5.44449 14.4055 5.44449C15.5945 5.44449 16.8378 5.65639 16.8378 5.65639V8.33047H15.4686C14.1193 8.33047 13.6982 9.1681 13.6982 10.0275V12.0668H16.7119L16.2302 15.2081H13.6982V22.8002C18.8925 21.9852 22.866 17.4901 22.866 12.0668H22.8651Z" fill="white" />
                        </svg>
                    </a>

                </div>
            </div>
        </footer>
    );
}
