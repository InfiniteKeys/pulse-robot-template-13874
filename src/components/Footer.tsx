import { Instagram, Mail, MapPin } from "lucide-react";
import logoImage from "@/assets/breaking-math-logo-latest.png";
const Footer = () => {
  return <footer className="text-primary-foreground footer-slide-up bg-slate-900">
      <div className="container mx-auto px-4 py-16 footer-fade-in bg-gray-900">
        <div className="grid md:grid-cols-4 gap-10">
          {/* Logo and Description */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-4 mb-6">
              <div className="p-3 rounded-xl shadow-lg bg-gray-900">
                <img src={logoImage} alt="Breaking Math Logo" className="h-7 w-7 object-contain" />
              </div>
              <div>
                <h3 className="text-2xl font-bold">Breaking Math</h3>
                <p className="text-sm opacity-90 font-medium">Bramalea Secondary School</p>
              </div>
            </div>
            <p className="text-primary-foreground/85 leading-relaxed max-w-md text-base">
              Empowering students through mathematics, fostering friendship through competition, 
              and building confidence through collaboration. Join us in exploring the world of mathematical excellence.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold mb-6 text-lg">Quick Links</h4>
            <ul className="space-y-4">
              <li>
                <a href="#about" className="footer-link text-primary-foreground/85 hover:text-white transition-colors duration-200 text-base">
                  About Us
                </a>
              </li>
              <li>
                <a href="#events" className="footer-link text-primary-foreground/85 hover:text-white transition-colors duration-200 text-base">
                  Events
                </a>
              </li>
              <li>
                <a href="#announcements" className="footer-link text-primary-foreground/85 hover:text-white transition-colors duration-200 text-base">
                  Announcements
                </a>
              </li>
              <li>
                <a href="#join" className="footer-link text-primary-foreground/85 hover:text-white transition-colors duration-200 text-base">
                  Join Us
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-bold mb-6 text-lg">Contact</h4>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 footer-icon opacity-90 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-primary-foreground/85">Room 208, Bramalea Secondary School</span>
              </li>
              <li className="flex items-start space-x-3">
                <Mail className="h-5 w-5 footer-icon opacity-90 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-primary-foreground/85">p0188851@pdsb.net</span>
              </li>
              <li className="flex items-start space-x-3">
                <Instagram className="h-5 w-5 footer-icon opacity-90 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-primary-foreground/85">@bss.math</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-primary-foreground/25 mt-12 pt-8 text-center">
          <p className="text-sm text-primary-foreground/70 font-medium">
            © 2025 Breaking Math Club - Bramalea Secondary School. All rights reserved.
          </p>
        </div>
      </div>
    </footer>;
};
export default Footer;