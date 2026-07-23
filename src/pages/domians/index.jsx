import bg from "../../assets/images/bg.jpg";
import { FaSearch } from "react-icons/fa";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

const domainData = [
  {
    id: 1,
    domain: "mybrand.com",
    status: "available",
    price: "۸,۵۰۰,۰۰۰ تومان",
    // details: "-",
  },
  {
    id: 2,
    domain: "greenhost.net",
    status: "reserved",
    price: "۳,۲۰۰,۰۰۰ تومان",
    // details: "-",
  },
  {
    id: 3,
    domain: "startuphub.ir",
    status: "available",
    price: "۱,۹۵۰,۰۰۰ تومان",
    // details: "-",
  },
  {
    id: 4,
    domain: "fastcloud.org",
    status: "sold",
    price: "—",
    // details: "-",
  },
  {
    id: 5,
    domain: "nextbrand.co",
    status: "available",
    price: "۵,۷۰۰,۰۰۰ تومان",
    // details: "-",
  },
  {
    id: 6,
    domain: "nextbrand.co",
    status: "available",
    price: "۵,۷۰۰,۰۰۰ تومان",
    // details: "-",
  },
];

// وضعیت‌ها
// const statusMap = {
//   available: {
//     label: "موجود",
//     className: "bg-green-500/20 text-green-400 border border-green-500/30",
//   },
//   reserved: {
//     label: "رزرو شده",
//     className: "bg-yellow-500/20 text-yellow-300 border border-yellow-500/30",
//   },
//   sold: {
//     label: "فروخته شده",
//     className: "bg-red-500/20 text-red-400 border border-red-500/30",
//   },
// };

const Domains = () => {
  const [search, setSearch] = useState("");

  const filteredDomains = useMemo(() => {
    return domainData.filter((item) =>
      item.domain.toLowerCase().includes(search.toLowerCase()),
    );
  }, [search]);

  return (
    <div id="domains" className="relative min-h-screen py-10">
      <img
        src={bg}
        className="absolute inset-0 object-cover -z-10 w-full h-full"
        alt=""
      />

      <div className="app-container">
        <div className="flex flex-col w-full gap-7">
          {/* عنوان */}
          <div className="flex flex-col gap-2 items-center text-center">
            <h2 className="text-white">
              مشاهده تمام دامنه‌ها
            </h2>

            <div className="text-white/70">دامنه مورد نظر خود را پیدا کنید</div>
          </div>

          {/* سرچ */}
          <div className="flex gap-2">
            <button className="bg-[var(--color-accent)] p-6 rounded-xl cursor-pointer hover:opacity-90 transition">
              <FaSearch size={24} />
            </button>

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              type="text"
              placeholder="جستجوی دامنه..."
              className="w-full rounded-xl bg-[var(--color-smooth)] border border-gray-500 px-4 py-3 outline-none focus:border-[var(--color-accent)] placeholder:text-gray-500"
            />
          </div>

          {/* جدول */}
          <div className="bg-[var(--color-smooth)]/80 border border-[#05df72]/15 rounded-3xl p-4 shadow-[0_10px_30px_rgba(5,223,114,0.08)] scroll-anim" style={{ "--from": "translateY(40px)" }}>
            {/* هدر */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white text-xl font-bold">
                لیست دامنه‌های موجود
              </h3>

              <span className="text-white/60 text-sm">
                {filteredDomains.length} دامنه
              </span>
            </div>

            {/* اسکرول */}
            <div className="max-h-[500px] overflow-y-auto rounded-2xl">
              <table className="w-full text-right border-separate border-spacing-y-2">
                <thead className="sticky top-0 bg-[#36383f] z-10">
                  <tr>
                    <th className="px-4 py-3 text-white/80 font-semibold rounded-r-xl">
                      دامنه
                    </th>

                    <th className="px-4 py-3 text-white/80 font-semibold">
                      وضعیت
                    </th>

                    <th className="px-4 py-3 text-white/80 font-semibold">
                      قیمت
                    </th>

                    <th className="px-4 py-3 text-white/80 font-semibold rounded-l-xl">
                      جزئیات
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredDomains.map((item) => {
                    // const status = statusMap[item.status];

                    return (
                      <tr key={item.id} className="bg-[#36383f]">
                        <td className="px-4 py-4 text-white font-semibold rounded-r-xl">
                          {item.domain}
                        </td>

                        <td className="px-4 py-4">
                          <span
                            className={`px-3 py-1 rounded-full text-sm bg-green-500/20 text-green-400 border border-green-500/30`}
                          >
                            موجود
                          </span>
                        </td>

                        <td className="px-4 py-4 text-white">{item.price}</td>

                        <td className="px-4 py-4 text-white/70 rounded-l-xl">
                          <Link
                            to={`/domain/${item.domain}`}
                            className="hover:text-[#05df72] transition-colors"
                          >
                            {/* {item.details} */}
                            ثبت درخواست
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Domains;
