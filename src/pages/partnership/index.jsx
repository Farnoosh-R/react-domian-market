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
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);

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

  const handleSendOtp = async () => {
    if (!form.phone) {
      alert("لطفاً شماره موبایل خود را وارد کنید.");
      return;
    }

    if (!/^09\d{9}$/.test(form.phone)) {
      alert("شماره موبایل معتبر نیست.");
      return;
    }

    setOtpLoading(true);

    try {
      const res = await fetch(
        "https://domigo.ir/api/wp-json/custom/v1/send-otp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            phone: form.phone,
          }),
        },
      );

      const data = await res.json();

      if (data.success) {
        setOtpSent(true);
        alert("کد تایید برای شما ارسال شد.");
      } else {
        alert(data.message || "ارسال کد تایید ناموفق بود.");
      }
    } catch (err) {
      console.log(err);
      alert("خطایی در ارسال کد تایید رخ داد.");
    } finally {
      setOtpLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) {
      alert("لطفاً کد تایید را وارد کنید.");
      return;
    }

    try {
      const res = await fetch(
        "https://domigo.ir/api/wp-json/custom/v1/verify-otp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            phone: form.phone,
            otp: otp,
          }),
        },
      );

      const data = await res.json();

      if (data.success && data.verified) {
        setOtpVerified(true);
        alert("شماره موبایل با موفقیت تایید شد.");
      } else {
        setOtpVerified(false);
        alert("کد تایید اشتباه است.");
      }
    } catch (err) {
      console.log(err);
      setOtpVerified(false);
      alert("خطایی در تایید کد رخ داد.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess(false);
    if (!otpVerified) {
      alert("لطفاً ابتدا شماره موبایل خود را تایید کنید.");
      return;
    }
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

        setTimeout(() => {
          setForm({
            name: "",
            phone: "",
            email: "",
            domain: "",
            price: "",
          });

          // Reset OTP
          setOtp("");
          setOtpSent(false);
          setOtpVerified(false);

          // Reset Captcha
          setCaptcha(generateCaptcha());
          setCaptchaValue("");

          // Remove success message
          setSuccess(false);
        }, 3000);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="partnership" className="relative min-h-screen py-6">
      <img
        src={bg}
        className="absolute inset-0 object-cover -z-10 w-full h-full"
        alt=""
      />
      <div className="app-container">
        <div className="flex flex-col gap-3 lg:gap-4 justify-center items-center">
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
          <div className="flex flex-col gap-2 lg:w-[80%] mt-10 lg:mt-0 mb-4">
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

                {/* ردیف اول: نام + ایمیل */}
                <div className="flex flex-col lg:flex-row gap-3 w-full">
                  {/* نام */}
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

                  {/* ایمیل */}
                  <div className="w-full">
                    <input
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      type="text"
                      placeholder="ایمیل خود را وارد نمایید"
                      className="w-full rounded-xl text-[var(--color-smooth)] border-2 border-gray-300 px-4 py-3 outline-none focus:border-[var(--color-accent)] placeholder:text-gray-400"
                    />
                  </div>
                </div>

                {/* ردیف دوم: دامنه */}
                <div className="w-full">
                  <input
                    name="domain"
                    value={form.domain}
                    onChange={handleChange}
                    type="text"
                    placeholder="دامنه را وارد نمایید"
                    className="w-full rounded-xl text-[var(--color-smooth)] border-2 border-gray-300 px-4 py-3 outline-none focus:border-[var(--color-accent)] placeholder:text-gray-400"
                  />
                </div>

                {/* ردیف سوم: قیمت + موبایل */}
                <div className="flex flex-col lg:flex-row gap-3 w-full">
                  {/* قیمت */}
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

                  {/* موبایل */}
                  <div className="w-full flex gap-2">
                    <input
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      type="tel"
                      inputMode="numeric"
                      placeholder="شماره موبایل خود را وارد کنید"
                      disabled={otpVerified}
                      className="w-full rounded-xl text-[var(--color-smooth)] border-2 border-gray-300 px-4 py-3 outline-none focus:border-[var(--color-accent)] placeholder:text-gray-400 disabled:bg-gray-100"
                    />

                    {!otpVerified && (
                      <button
                        type="button"
                        onClick={handleSendOtp}
                        disabled={otpLoading}
                        className="bg-[var(--color-accent)] text-white px-5 py-3 rounded-xl whitespace-nowrap hover:opacity-90 transition-all disabled:opacity-50"
                      >
                        {otpLoading ? "در حال ارسال..." : "ارسال کد تایید"}
                      </button>
                    )}
                  </div>
                </div>
                {/* ردیف چهارم: OTP */}
                {otpSent && !otpVerified && (
                  <div className="w-full lg:w-1/3 lg:mr-auto flex flex-col gap-2">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        inputMode="numeric"
                        maxLength={4}
                        value={otp}
                        onChange={(e) =>
                          setOtp(e.target.value.replace(/\D/g, ""))
                        }
                        placeholder="کد تایید"
                        className="flex-1 min-w-0 rounded-xl text-[var(--color-smooth)] border-2 border-gray-300 px-4 py-3 outline-none focus:border-[var(--color-accent)] placeholder:text-gray-400"
                      />

                      <button
                        type="button"
                        onClick={handleVerifyOtp}
                        className="shrink-0 bg-[var(--color-accent)] text-white px-5 py-3 rounded-xl whitespace-nowrap hover:opacity-90 transition-all"
                      >
                        تایید کد
                      </button>
                    </div>
                  </div>
                )}

                {/* تایید موفق */}
                {otpVerified && (
                  <div className="text-green-600 text-sm">
                    شماره موبایل با موفقیت تایید شد ✔
                  </div>
                )}

                {/* ردیف پنجم: کپچا + ارسال */}
                <div className="flex flex-col lg:flex-row gap-3 w-full items-end">
                  {/* کپچا */}
                  <div className="w-full lg:w-1/2">
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

                  {/* ارسال */}
                  <div className="w-full lg:w-1/2">
                    <button
                      type="submit"
                      disabled={loading || !otpVerified}
                      className="bg-[var(--color-accent)] w-full cursor-pointer hover:opacity-90 transition-all text-white px-8 py-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? "در حال ارسال..." : "ارسال پیشنهاد"}
                    </button>
                  </div>
                </div>

                {success && (
                  <div className="text-green-600 mt-2">
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
