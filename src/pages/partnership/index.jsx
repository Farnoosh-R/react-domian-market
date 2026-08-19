import { useState } from "react";
import bg from "../../assets/images/bg.png";
import { FaHandshake } from "react-icons/fa";
import { Link } from "react-router-dom";
import { FaLongArrowAltLeft } from "react-icons/fa";

const Partnership = () => {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    domain: "",
    price: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // =========================
  // OTP
  // =========================

  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);

  const [otpMessage, setOtpMessage] = useState("");
  const [otpMessageType, setOtpMessageType] = useState("");

  // =========================
  // FORM CHANGE
  // =========================

  const handleChange = (e) => {
    const { name, value } = e.target;

    // قیمت
    if (name === "price") {
      const rawValue = value.replace(/,/g, "");

      if (!/^\d*$/.test(rawValue)) return;

      setForm((prev) => ({
        ...prev,
        price:
          rawValue === ""
            ? ""
            : Number(rawValue).toLocaleString("en-US"),
      }));

      return;
    }

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =========================
  // SEND OTP
  // =========================

  const handleSendOtp = async () => {
    setOtpMessage("");
    setOtpMessageType("");

    if (!form.phone) {
      setOtpMessage("لطفاً شماره موبایل خود را وارد کنید.");
      setOtpMessageType("error");
      return;
    }

    if (!/^09\d{9}$/.test(form.phone)) {
      setOtpMessage("شماره موبایل معتبر نیست.");
      setOtpMessageType("error");
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
        }
      );

      const data = await res.json();

      if (data.success) {
        setOtpSent(true);
        setOtp("");

        setOtpMessage("کد تایید با موفقیت ارسال شد.");
        setOtpMessageType("success");
      } else {
        setOtpMessage(
          data.message || "ارسال کد تایید ناموفق بود."
        );

        setOtpMessageType("error");
      }
    } catch (err) {
      console.log(err);

      setOtpMessage("خطایی در ارسال کد تایید رخ داد.");
      setOtpMessageType("error");
    } finally {
      setOtpLoading(false);
    }
  };

  // =========================
  // SUBMIT FORM
  // =========================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSuccess(false);
    setOtpMessage("");
    setOtpMessageType("");

    // =========================
    // CHECK REQUIRED FIELDS
    // =========================

    if (
      !form.name.trim() ||
      !form.price.trim() ||
      !form.domain.trim() ||
      !form.phone.trim()
    ) {
      return;
    }

    // =========================
    // CHECK PHONE
    // =========================

    if (!/^09\d{9}$/.test(form.phone)) {
      setOtpMessage("شماره موبایل معتبر نیست.");
      setOtpMessageType("error");
      return;
    }

    // =========================
    // OTP SENT CHECK
    // =========================

    if (!otpSent) {
      setOtpMessage("لطفاً ابتدا کد تایید را دریافت کنید.");
      setOtpMessageType("error");
      return;
    }

    // =========================
    // OTP INPUT CHECK
    // =========================

    if (!otp || otp.length !== 4) {
      setOtpMessage("لطفاً کد تایید ۴ رقمی را وارد کنید.");
      setOtpMessageType("error");
      return;
    }

    setLoading(true);

    try {
      // =========================
      // VERIFY OTP
      // =========================

      const otpRes = await fetch(
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
        }
      );

      const otpData = await otpRes.json();

      // OTP اشتباه یا منقضی شده
      if (!otpData.success || !otpData.verified) {
        setOtpMessage("کد تایید اشتباه یا منقضی شده است.");
        setOtpMessageType("error");

        setLoading(false);
        return;
      }

      // =========================
      // SEND PARTNERSHIP FORM
      // =========================

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
            domain: form.domain,
            price: form.price.replace(/,/g, ""),
          }),
        }
      );

      const data = await res.json();

      // =========================
      // SUCCESS
      // =========================

      if (data.success) {
        setSuccess(true);

        setTimeout(() => {
          setForm({
            name: "",
            phone: "",
            domain: "",
            price: "",
          });

          setOtp("");
          setOtpSent(false);

          setOtpMessage("");
          setOtpMessageType("");

          setSuccess(false);
        }, 3000);
      } else {
        setOtpMessage(
          data.message || "ارسال درخواست ناموفق بود."
        );

        setOtpMessageType("error");
      }
    } catch (err) {
      console.log(err);

      setOtpMessage("خطایی در ارسال درخواست رخ داد.");
      setOtpMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // UI
  // =========================

  return (
    <div id="partnership" className="relative min-h-screen py-6">
      <img
        src={bg}
        className="absolute inset-0 object-cover -z-10 w-full h-full"
        alt=""
      />

      <div className="app-container">
        <div className="flex flex-col gap-3 lg:gap-4 justify-center items-center">

          {/* عنوان */}
          <div>
            <div className="flex gap-2 items-center">
              <FaHandshake
                size={35}
                color="var(--color-accent)"
              />

              <h2>درخواست همکاری</h2>
            </div>

            <div className="text-lg text-white text-justify">
              دامنه خود را رایگان ثبت کنید تا در بازار فروش دامنه سایت
              در دسترس هزاران خریدار قرار گیرد.
            </div>
          </div>

          <div className="flex flex-col gap-2 lg:w-[80%] mt-10 lg:mt-0 mb-4">

            {/* لینک دامنه ها */}
            <div className="flex items-center justify-end w-full">
              <Link
                to={"/domains"}
                className="flex items-center gap-1 hover:text-[var(--color-text)]/70"
              >
                <div>مشاهده تمام دامنه ها</div>

                <FaLongArrowAltLeft size={15} />
              </Link>
            </div>

            <div
              className="bg-[var(--color-soft)] rounded-xl p-7 scroll-anim"
              style={{ "--from": "translateY(40px)" }}
            >

              <form
                onSubmit={handleSubmit}
                className="flex flex-col gap-3"
              >

                <h2 className="text-[var(--color-smooth)]">
                  ثبت رایگان آگهی دامنه
                </h2>

                <div className="text-[var(--color-muted)] text-lg">
                  لطفا فرم زیر را پر کنید تا ثبت آگهی دامنه شما توسط
                  همکاران ما بررسی شود.
                </div>

                {/* =========================
                    ردیف اول: نام + قیمت
                ========================= */}

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

                </div>

                {/* =========================
                    ردیف دوم: دامنه
                ========================= */}

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

                {/* =========================
                    ردیف سوم: موبایل
                ========================= */}

                <div className="w-full flex flex-col gap-2">

                  {/* موبایل */}
                  <div className="flex gap-2 justify-center">

                    <input
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      type="tel"
                      inputMode="numeric"
                      placeholder="شماره موبایل خود را وارد کنید"
                      className="w-full lg:w-50 rounded-xl text-[var(--color-smooth)] border-2 border-gray-300 px-4 py-3 outline-none focus:border-[var(--color-accent)] placeholder:text-gray-400"
                    />

                    <button
                      type="button"
                      onClick={handleSendOtp}
                      disabled={otpLoading}
                      className="bg-[var(--color-accent)] text-white px-5 py-3 rounded-xl whitespace-nowrap hover:opacity-90 transition-all disabled:opacity-50"
                    >
                      {otpLoading
                        ? "در حال ارسال..."
                        : "ارسال کد تایید"}
                    </button>

                  </div>

                  {/* OTP */}
                  {otpSent && (
                    <div className="flex justify-center items-center">

                      <div className="w-full lg:w-1/4 flex flex-col gap-2">

                        <input
                          type="text"
                          inputMode="numeric"
                          maxLength={4}
                          value={otp}
                          onChange={(e) =>
                            setOtp(
                              e.target.value.replace(/\D/g, "")
                            )
                          }
                          placeholder="کد تایید"
                          className="w-full rounded-xl text-[var(--color-smooth)] border-2 border-gray-300 px-4 py-3 outline-none focus:border-[var(--color-accent)] placeholder:text-gray-400"
                        />

                        {otpMessage && (
                          <div
                            className={`text-sm ${
                              otpMessageType === "success"
                                ? "text-green-600"
                                : "text-red-500"
                            }`}
                          >
                            {otpMessage}
                          </div>
                        )}

                      </div>

                    </div>
                  )}

                </div>

                {/* =========================
                    ردیف آخر: ارسال پیشنهاد
                ========================= */}

                <div className="flex justify-center items-center w-full pt-1">

                  <button
                    type="submit"
                    disabled={
                      loading ||
                      !form.name.trim() ||
                      !form.price.trim() ||
                      !form.domain.trim() ||
                      !form.phone.trim() ||
                      !otp
                    }
                    className="bg-[var(--color-accent)] w-full lg:w-70 cursor-pointer hover:opacity-90 transition-all text-white px-8 py-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading
                      ? "در حال ارسال..."
                      : "ارسال پیشنهاد"}
                  </button>

                </div>

                {/* پیام موفقیت */}
                {success && (
                  <div className="text-green-600 mt-2 text-center mx-auto">
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