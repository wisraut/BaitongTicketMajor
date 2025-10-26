import React from "react";

const FOOTER_H = "h-16";
function Footer() {
  return (
    <footer
      className={`fixed inset-x-0 bottom-0 ${FOOTER_H} bg-[#234C6A] text-white flex items-center justify-center z-40`}
    >
      <div className="container mx-auto px-4 text-center">
        <p>
          &copy; {new Date().getFullYear()} BaiTong Ticket. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
