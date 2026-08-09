import bg from "../../assets/images/bg.png";
import { FaSearch } from "react-icons/fa";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaLongArrowAltLeft } from "react-icons/fa";


const formatPrice = (price) => {
  if (!price) return "—";

  const numericPrice = Number(String(price).replace(/,/g, ""));

  if (isNaN(numericPrice)) return "—";

  return `${numericPrice.toLocaleString("fa-IR")} تومان`;
};

const Domains = () => {
  const [domains, setDomains] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDomains = async () => {
      try {
        const response = await fetch(
          "https://domigo.ir/api/wp-json/domain-manager/v1/domains",
        );

        if (!response.ok) {
          throw new Error("خطا در دریافت اطلاعات");
        }

        const data = await response.json();

        setDomains(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDomains();
  }, []);

  const filteredDomains = domains.filter((item) => {
    const value = search.trim().toLowerCase();

    return (
      item.domain?.toLowerCase().includes(value) ||
      item.keyword1?.toLowerCase().includes(value) ||
      item.keyword2?.toLowerCase().includes(value) ||
      item.keyword3?.toLowerCase().includes(value)
    );
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-white">
        در حال دریافت اطلاعات...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div id="domains" className="relative min-h-screen py-10">
      <img
        src={bg}
        className="absolute inset-0 object-cover -z-10 w-full h-full"
        alt=""
      />

      <div className="app-container">
        <div className="flex flex-col w-full gap-7">
          <div className="flex flex-col gap-2 items-center text-center">
            <h2 className="text-white">مشاهده تمام دامنه‌ها</h2>

            <div className="text-white/70">دامنه مورد نظر خود را پیدا کنید</div>
          </div>

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

          <div className="bg-[var(--color-smooth)]/80 border border-[#05df72]/15 rounded-3xl p-4 shadow-[0_10px_30px_rgba(5,223,114,0.08)]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white text-xl font-bold">
                لیست دامنه‌های موجود
              </h3>

              <span className="text-white/60 text-sm">
                {filteredDomains.length} دامنه
              </span>
            </div>

            <div className="max-h-[500px] overflow-y-auto overflow-x-auto rounded-2xl">
              <table className="w-full text-right border-separate border-spacing-y-2">
                <thead className="sticky top-0 bg-[#36383f] z-10">
                  <tr>
                    <th className="px-4 py-3 text-white/80 font-semibold rounded-r-xl">
                      دامنه
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

                    return (
                      <tr key={item.id} className="bg-[#36383f]">
                        <td className="px-4 py-4 text-white font-semibold rounded-r-xl">
                          {item.domain}
                        </td>

                        <td className="px-4 py-4 text-white whitespace-nowrap">
                          {formatPrice(item.price)}
                        </td>
                        <td className="px-4 py-4 rounded-l-xl whitespace-nowrap">
                          <Link
                            to={`/domain/${item.domain}`}
                            className="text-white/70 hover:text-[#05df72] transition-colors"
                          >
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
