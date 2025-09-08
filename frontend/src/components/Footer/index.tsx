import Image from "next/image";
import Link from "next/link";

const Footer = () => {
  return (
    <footer
      className="wow fadeInUp relative z-10 overflow-hidden bg-[#090E34] pt-20 pb-0 lg:pt-[100px]"
      data-wow-delay=".15s"
    >
      <div className="container">
        <div className="-mx-4 flex flex-wrap justify-between">
          <div className="w-full px-4 lg:w-1/3">
            <div className="mb-10 w-full">
              <Link href="/" className="mb-6 inline-block max-w-[160px]">
                <span className="inline-block select-none text-2xl font-extrabold tracking-wide text-white">
                  Task<span className="text-primary">It</span>
                </span>
              </Link>
              <p className="mb-8 max-w-[360px] text-base text-gray-7">
                Task Management App — manage tasks, track progress, and stay organized.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-12 border-t border-[#8890A4] border-opacity-40 py-8 lg:mt-[60px]">
        <div className="container">
          <div className="-mx-4 flex flex-wrap items-center justify-between">
            <div className="w-full px-4">
              <div className="my-1 flex justify-center">
                <p className="text-base text-gray-7">
                  © {new Date().getFullYear()} Task Management App
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div>
        <span className="absolute left-0 top-0 z-[-1] aspect-[95/82] w-full max-w-[570px]">
          <Image src="/images/footer/shape-1.svg" alt="shape" fill />
        </span>
        <span className="absolute bottom-0 right-0 z-[-1] aspect-[31/22] w-full max-w-[372px]">
          <Image src="/images/footer/shape-3.svg" alt="shape" fill />
        </span>
      </div>
    </footer>
  );
};

export default Footer;
