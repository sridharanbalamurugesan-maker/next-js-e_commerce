export default function Footer() {
  return (
    <footer className="bg-[#1e1b4b] text-[#64748b] mt-auto">
      <div className="max-w-[1200px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 px-6 py-10 text-xs">
        <div>
          <h4 className="text-[#64748b] font-semibold tracking-wider mb-3">ABOUT</h4>
          <ul className="space-y-2 text-white">
            <li>Contact Us</li>
            <li>About Grabbuy</li>
            <li>Careers</li>
            <li>Grabbuy Stories</li>
          </ul>
        </div>
        <div>
          <h4 className="text-[#64748b] font-semibold tracking-wider mb-3">HELP</h4>
          <ul className="space-y-2 text-white">
            <li>Payments</li>
            <li>Shipping</li>
            <li>Cancellation & Returns</li>
            <li>FAQ</li>
          </ul>
        </div>
        <div>
          <h4 className="text-[#64748b] font-semibold tracking-wider mb-3">POLICY</h4>
          <ul className="space-y-2 text-white">
            <li>Return Policy</li>
            <li>Terms Of Use</li>
            <li>Security</li>
            <li>Privacy</li>
          </ul>
        </div>
        <div>
          <h4 className="text-[#64748b] font-semibold tracking-wider mb-3">Mail Us:</h4>
          <p className="text-white leading-5">
            Grabbuy Internet Private Limited,
            <br />
            Buildings Alyssa, Begonia &
            <br />
            Clove Embassy Tech Village,
            <br />
            Bengaluru, 560103,
            <br />
            Karnataka, India
          </p>
        </div>
      </div>
      <div className="border-t border-[#312e81] py-4 px-6 flex flex-wrap items-center justify-center gap-6 text-white text-sm">
        <span>© 2007–2026 Grabbuy.com</span>
        <span className="text-[#64748b]">All rights reserved</span>
      </div>
    </footer>
  );
}
