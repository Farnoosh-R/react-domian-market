import { useState } from "react";
import bg from "../../assets/images/bg.png";
import { FaHandshake } from "react-icons/fa";
import { Link } from "react-router-dom";
import { FaLongArrowAltLeft } from "react-icons/fa";

const generateCaptcha = () => {
  const first = Math.floor(Math.random() * 10) + 1;
  const second = Math.floor(Math.random() * 10) + 1;

  return {
    first,
    second,
    answer: first + second,
  };
};

const Partnership = () => {
  const [captcha, setCaptcha] = useState(generateCaptcha());
  const [captchaValue, setCaptchaValue] = useState("");

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    domain: "",
    price: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // فقط برای فیلد قیمت
    if (name === "price") {
      const rawValue = value.replace(/,/g, "");

      // فقط عدد مجاز است
      if (!/^\d*$/.test(rawValue)) return;

      setForm((prev) => ({
        ...prev,
        price: rawValue === "" ? "" : Number(rawValue).toLocaleString("en-US"),
      }));

      return;
    }

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess(false);
    if (Number(captchaValue) !== captcha.answer) {
      alert("پاسخ سوال امنیتی اشتباه است.");

      setCaptcha(generateCaptcha());
      setCaptchaValue("");

      return;
    }
    setLoading(true);

    try {
      const res = await fetch(
        "https://domigo.ir/api/wp-json/custom/v1/partnership",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: form.name,
            phone: form.phone,
            email: form.email,
            domain: form.domain,
            price: form.price.replace(/,/g, ""),
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
          domain: "",
          price: "",
        });
        setCaptcha(generateCaptcha());
        setCaptchaValue("");
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="partnership" className="relative min-h-screen py-8">
      <img
        src={bg}
        className="absolute inset-0 object-cover -z-10 w-full h-full"
        alt=""
      />
      <div className="app-container">
        <div className="flex flex-col gap-3 lg:gap-5 justify-center items-center">
          <div className="">
            <div className="flex gap-2 items-center">
              <FaHandshake size={35} color="var(--color-accent)" />
              <h2>درخواست همکاری</h2>
            </div>
            <div className="text-lg text-white text-justify">
              دامنه خود را رایگان ثبت کنید تا در بازار فروش دامنه سایت در دسترس
              هزاران خریدار قرار گیرد.
            </div>
          </div>
          <div className="flex flex-col gap-2 lg:w-[80%] mt-10 lg:mt-0">
            <div className="flex items-center justify-end w-full ">
              <Link
                to={"/domains"}
                className="flex items-center gap-1 hover:text-[var(--color-text)]/70"
              >
                <div>مشاهده تمام دامنه ها</div>
                <FaLongArrowAltLeft size={15} />
              </Link>
            </div>
            <div
              className=" bg-[var(--color-soft)] rounded-xl p-7 scroll-anim"
              style={{ "--from": "translateY(40px)" }}
            >
              <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                <h2 className="text-[var(--color-smooth)]">
                  ثبت رایگان آگهی دامنه
                </h2>
                <div className="text-[var(--color-muted)] text-lg">
                  لطفا فرم زیر را پر کنید تا ثبت آگهی دامنه شما توسط همکاران ما
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
                      className="w-full rounded-xl text-[var(--color-smooth)] border-2 border-gray-300 px-4 py-3 outline-none focus:border-[var(--color-accent)] placeholder:text-gray-400"
                    />
                  </div>

                  {/* شماره تماس */}
                  <div className="w-full">
                    <input
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      type="number"
                      inputMode="numeric"
                      placeholder="شماره تماس خود را وارد نمایید"
                      className="w-full rounded-xl text-[var(--color-smooth)] border-2 border-gray-300 px-4 py-3 outline-none focus:border-[var(--color-accent)] placeholder:text-gray-400"
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
                      className="w-full rounded-xl text-[var(--color-smooth)] border-2 border-gray-300 px-4 py-3 outline-none focus:border-[var(--color-accent)] placeholder:text-gray-400"
                    />
                  </div>

                  {/* قیمت*/}

                  <div className="relative w-full">
                    <input
                      name="price"
                      value={form.price}
                      onChange={handleChange}
                      type="text"
                      inputMode="numeric"
                      placeholder="قیمت پیشنهادی خود را وارد نمایید"
                      className="w-full rounded-xl border-2 border-gray-300 px-4 pl-20 py-3 text-[var(--color-smooth)] outline-none focus:border-[var(--color-accent)] placeholder:text-gray-400"
                    />

                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
                      تومان
                    </span>
                  </div>
                </div>

                {/* دامنه*/}
                <div className="md:col-span-1">
                  <input
                    name="domain"
                    value={form.domain}
                    onChange={handleChange}
                    type="text"
                    placeholder="دامنه را وارد نمایید"
                    className="w-full rounded-xl text-[var(--color-smooth)] border-2 border-gray-300 px-4 py-3 outline-none focus:border-[var(--color-accent)] placeholder:text-gray-400"
                  />
                </div>

                <div className="flex flex-col lg:flex-row gap-3 items-baseline-last">
                  {/* capcha */}
                  <div className="flex flex-col lg:flex-row gap-3 w-full lg:w-1/2">
                    <div className="w-full ">
                      <div className="mb-2 text-sm text-[var(--color-muted)]">
                        حاصل {captcha.first} + {captcha.second} چند می‌شود؟
                      </div>

                      <input
                        type="number"
                        value={captchaValue}
                        onChange={(e) => setCaptchaValue(e.target.value)}
                        placeholder="پاسخ را وارد کنید"
                        className="w-full rounded-xl text-[var(--color-smooth)] border-2 border-gray-300 px-4 py-3 outline-none focus:border-[var(--color-accent)] placeholder:text-gray-400"
                      />
                    </div>
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
