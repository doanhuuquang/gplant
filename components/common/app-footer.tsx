import Link from "next/link";
import LocaleSwitcher from "@/components/common/locale-switcher";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { ModeSwitcher } from "@/components/common/mode-switcher";
import {
  faInstagram,
  faTiktok,
  faFacebook,
  faYoutube,
  faThreads,
  faPinterest,
  faXTwitter,
} from "@fortawesome/free-brands-svg-icons";

library.add(
  faInstagram,
  faTiktok,
  faFacebook,
  faYoutube,
  faThreads,
  faPinterest,
  faXTwitter,
);

export default function AppFooter() {
  const footerNavLinks = [
    {
      title: "Giới thiệu về Gplant",
      href: "/about",
    },
    {
      title: "Bảng giá & gói dịch vụ",
      href: "/pricing",
    },
    {
      title: "Điều khoản cấp phép",
      href: "/license-terms",
    },
    {
      title: "Điều khoản & điều kiện",
      href: "/term-conditions",
    },
    {
      title: "Chính sách quyền riêng tư",
      href: "/privacy",
    },
    {
      title: "Cookie",
      href: "/cookies",
    },
    {
      title: "Không bán hoặc chia sẻ thông tin cá nhân của tôi",
      href: "/my-personal-information",
    },
    {
      title: "Trung tâm trợ giúp",
      href: "/hc",
    },
    {
      title: "Cài đặt cookie",
      href: "/cookies-settings",
    },
  ];

  const footerSocialLinks = [
    {
      icon: (
        <FontAwesomeIcon
          icon={["fab", "instagram"]}
          size={"xl"}
          className="hover:text-[#833AB4] transition-colors"
        />
      ),
      href: "https://instagram.com/gplantapp",
    },
    {
      icon: (
        <FontAwesomeIcon
          icon={["fab", "tiktok"]}
          size={"xl"}
          className="hover:text-[#fe2c55] transition-colors"
        />
      ),
      href: "https://tiktok.com/@gplantapp",
    },
    {
      icon: (
        <FontAwesomeIcon
          icon={["fab", "facebook"]}
          size={"xl"}
          className="hover:text-[#1877f2] transition-colors"
        />
      ),
      href: "https://facebook.com/gplantapp",
    },
    {
      icon: (
        <FontAwesomeIcon
          icon={["fab", "youtube"]}
          size={"xl"}
          className="hover:text-[#ff0000] transition-colors"
        />
      ),
      href: "https://youtube.com/gplantapp",
    },
    {
      icon: <FontAwesomeIcon icon={["fab", "threads"]} size={"xl"} />,
      href: "https://threads.net/gplantapp",
    },
    {
      icon: (
        <FontAwesomeIcon
          icon={["fab", "pinterest"]}
          size={"xl"}
          className="hover:text-[#E60023] transition-colors"
        />
      ),
      href: "https://pinterest.com/gplantapp",
    },
    {
      icon: <FontAwesomeIcon icon={["fab", "x-twitter"]} size={"xl"} />,
      href: "https://x.com/gplantapp",
    },
  ];

  return (
    <footer className="w-full h-fit bg-soft-peach border-t">
      <div className="w-full h-fit max-w-350 mx-auto py-10 px-4 space-y-10">
        {/* Links  */}
        <div className="flex flex-wrap gap-5">
          {footerNavLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="hover:underline underline-offset-3"
            >
              {link.title}
            </Link>
          ))}
        </div>

        <div className="w-full flex flex-wrap items-center justify-between gap-10">
          {/* Social media links */}
          <div className="flex items-center gap-4">
            {footerSocialLinks.map((socialLink, index) => (
              <Link key={index} href={socialLink.href}>
                {socialLink.icon}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-5">
            <LocaleSwitcher />
            <div className="h-5 w-0.5 bg-muted-foreground/20"></div>
            <ModeSwitcher />
          </div>
        </div>

        <p className="text-sm">© Bảo lưu mọi quyền.</p>
      </div>
    </footer>
  );
}
