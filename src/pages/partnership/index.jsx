import { useState } from "react";
import bg from "../../assets/images/bg.jpg";
import { FaHandshake } from "react-icons/fa";
import { Link } from "react-router-dom";
import { FaLongArrowAltLeft } from "react-icons/fa";

const Partnership = () => {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    domian: "",
    price: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(
        "http://test.ir/api/wp-json/custom/v1/test",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            fullName: form.name,
            mobile: form.phone,
            email: form.email,
            domian: form.domian,
            price: form.price,
          }),
        },
      );

      const data = await res.json();

      if (data.success) {
        setSuccess(true);
        setForm({
          name: "",
          phone: "",
          email: "",
          domian: "",
          price: "",
        });
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="partnership" className="relative min-h-screen py-10">
      <img
        src={bg}
        className="absolute inset-0 object-cover -z-10 w-full h-full"
        alt=""
      />
      <div className="app-container">
        <div className="flex flex-col gap-3 lg:gap-12 justify-center items-center">
          <div className="text-center">
            <div className="flex gap-2 items-center">
              <FaHandshake size={35} color="var(--color-accent)" />
              <h2>درخواست همکاری</h2>
            </div>
            <div className="text-lg text-white">
              اگر در زمینه فروش دامنه فعالیت می‌کنید، خوشحال می‌شویم درباره
              فرصت‌های همکاری با شما گفتگو کنیم.
            </div>
          </div>
          <div className="flex flex-col gap-2 lg:w-[70%] mt-10 lg:mt-0">
            <div className="flex items-center justify-end w-full ">
              <Link to={"/"} className="flex items-center gap-1 hover:text-[var(--color-text)]/70">
                <div>بازگشت به صفحه ثبت پیشنهاد</div>
                <FaLongArrowAltLeft size={15} />
              </Link>
              
            </div>
            <div className=" bg-[var(--color-soft)] rounded-xl p-7 scroll-anim" style={{ "--from": "translateY(40px)" }}>
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <h2 className="text-[var(--color-smooth)]">ثبت پیشنهاد فروش</h2>
                <div className="text-[var(--color-muted)] text-lg">
                  لطفاً فرم زیر را تکمیل کنید تا درخواست همکاری شما توسط تیم ما
                  بررسی شود.
                </div>
                <div className="flex flex-col lg:flex-row gap-3 w-full">
                  {/* نام و نام خانوادگی */}
                  <div className="w-full">
                    <input
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      type="text"
                      placeholder="نام و نام خانوادگی خود را وارد نمایید"
                      className="w-full rounded-xl border-2 border-gray-300 px-4 py-3 outline-none focus:border-[var(--color-accent)] placeholder:text-gray-400"
                    />
                  </div>

                  {/* شماره تماس */}
                  <div className="w-full">
                    <input
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      type="text"
                      placeholder="شماره تماس خود را وارد نمایید"
                      className="w-full rounded-xl border-2 border-gray-300 px-4 py-3 outline-none focus:border-[var(--color-accent)] placeholder:text-gray-400"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-3 lg:flex-row">
                  {/* ایمیل */}
                  <div className="w-full">
                    <input
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      type="text"
                      placeholder="ایمیل خود را وارد نماید"
                      className="w-full rounded-xl border-2 border-gray-300 px-4 py-3 outline-none focus:border-[var(--color-accent)] placeholder:text-gray-400"
                    />
                  </div>

                  {/* قیمت*/}
                  <div className="w-full">
                    <input
                      name="price"
                      value={form.price}
                      onChange={handleChange}
                      type="email"
                      placeholder="قیمت پیشنهادی خود را وارد نمایید"
                      className="w-full rounded-xl border-2 border-gray-300 px-4 py-3 outline-none focus:border-[var(--color-accent)] placeholder:text-gray-400"
                    />
                  </div>
                </div>

                {/* دامنه*/}
                <div className="md:col-span-1">
                  <input
                    name="domain"
                    value={form.domain}
                    onChange={handleChange}
                    type="email"
                    placeholder="دامنه را وارد نمایید"
                    className="w-full rounded-xl border-2 border-gray-300 px-4 py-3 outline-none focus:border-[var(--color-accent)] placeholder:text-gray-400"
                  />
                </div>

                {/* دکمه ارسال */}
                <div className="md:col-span-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-[var(--color-accent)] w-full cursor-pointer hover:opacity-90 transition-all text-white px-8 py-2 rounded-xl"
                  >
                    {loading ? "در حال ارسال..." : "ارسال پیشنهاد"}
                  </button>
                </div>
                {success && (
                  <div className="text-green-600 mt-4">
                    درخواست شما با موفقیت ارسال شد ✔
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Partnership;
