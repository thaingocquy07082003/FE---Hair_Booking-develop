import Link from "next/link";
import {
  Facebook,
  Instagram,
  Mail,
  MapPin,
  Phone,
  Scissors,
  Twitter,
} from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container py-12 px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Scissors className="h-6 w-6" />
              <span className="text-xl font-bold text-white">HairStyle</span>
            </div>
            <p className="text-sm">
              Chúng tôi cung cấp dịch vụ cắt tóc chuyên nghiệp với đội ngũ thợ
              cắt tóc có nhiều năm kinh nghiệm.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="hover:text-white">
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link href="#" className="hover:text-white">
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link href="#" className="hover:text-white">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Link>
            </div>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white">Liên kết nhanh</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="hover:text-white">
                  Trang chủ
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-white">
                  Dịch vụ
                </Link>
              </li>
              <li>
                <Link href="/stylists" className="hover:text-white">
                  Thợ cắt tóc
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="hover:text-white">
                  Bộ sưu tập
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white">
                  Liên hệ
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white">Dịch vụ</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/services" className="hover:text-white">
                  Cắt tóc nam
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-white">
                  Cắt tóc nữ
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-white">
                  Nhuộm tóc
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-white">
                  Uốn tóc
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-white">
                  Duỗi tóc
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white">Liên hệ</h3>
            <ul className="space-y-2">
              <li className="flex items-start space-x-2">
                <MapPin className="h-5 w-5 shrink-0" />
                <span>123 Đường ABC, Quận XYZ, Hà Nội</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="h-5 w-5 shrink-0" />
                <span>0123 456 789</span>
              </li>
              <li className="flex items-center space-x-2">
                <Mail className="h-5 w-5 shrink-0" />
                <span>info@hairstyle.com</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t border-gray-800 pt-8 text-center text-sm">
          <p>
            &copy; {new Date().getFullYear()} HairStyle. Tất cả các quyền được
            bảo lưu.
          </p>
        </div>
      </div>
    </footer>
  );
}
