import { useState, useEffect } from "react";
import bg from "../../assets/images/bg.png";
import { FaPhone, FaEnvelope, FaGlobe } from "react-icons/fa";
import { Link, useParams } from "react-router-dom";
import {
  FaTelegramPlane,
  FaLinkedinIn,
  FaInstagram,
  FaWhatsapp,
  FaYoutube,
} from "react-icons/fa";
import bale from "../../assets/images/bale.png";

const Offers = () => {
  const { domain: routeDomain } = useParams();

  const domain = (routeDomain || window.location.hostname)
    .replace(/^www\./, "")
    .toLowerCase();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    offer: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const [domainData, setDomainData] = useState(null);
  const [loadingDomain, setLoadingDomain] = useState(true);

  const defaultDomain = {
    domain: "domian.com",
    price: 2000000,
    phone: "02112345678",
    email: "info@example.com",
    description:
      "این دامنه برای فروش در دسترس است. برای دریافت اطلاعات بیشتر و ثبت پیشنهاد خرید با ما در ارتباط باشید.",
  };

  // =========================
  // OTP
  // =========================

  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);

  const [otpMessage, setOtpMessage] = useState("");
  const [otpMessageType, setOtpMessageType] = useState("");

  // =========================
  // GET DOMAIN
  // =========================

  useEffect(() => {
    const fetchDomain = async () => {
      try {
        const res = await fetch(
          "https://domigo.ir/api/wp-json/domain-manager/v1/domains",
        );

        const data = await res.json();

        const selected = data.find(
          (item) => item.domain?.replace(/^www\./, "").toLowerCase() === domain,
        );

        setDomainData(selected || defaultDomain);
      } catch (err) {
        console.log(err);
        setDomainData(defaultDomain);
      } finally {
        setLoadingDomain(false);
      }
    };

    fetchDomain();

    console.log("window.location.hostname", window.location.hostname);
  }, [domain]);

  if (loadingDomain) {
    return <div>در حال بارگذاری...</div>;
  }

  // =========================
  // FORM CHANGE
  // =========================

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "offer") {
      const rawValue = value.replace(/,/g, "");

      if (!/^\d*$/.test(rawValue)) return;

      setForm((prev) => ({
        ...prev,
        offer: rawValue === "" ? "" : Number(rawValue).toLocaleString("en-US"),
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
        },
      );

      const data = await res.json();

      if (data.success) {
        setOtpSent(true);
        setOtp("");

        setOtpMessage("کد تایید با موفقیت ارسال شد.");
        setOtpMessageType("success");
      } else {
        setOtpMessage(data.message || "ارسال کد تایید ناموفق بود.");

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

    if (!otp) {
      setOtpMessage("لطفاً کد تایید را وارد کنید.");
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
        },
      );

      const otpData = await otpRes.json();

      // OTP WRONG / EXPIRED
      if (!otpData.success || !otpData.verified) {
        setOtpMessage("کد تایید اشتباه یا منقضی شده است.");
        setOtpMessageType("error");

        setLoading(false);

        return;
      }

      // =========================
      // SEND OFFER
      // =========================

      const res = await fetch(
        "https://domigo.ir/api/wp-json/custom/v1/offers",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: form.name,
            phone: form.phone,
            domain: domainData.domain,
            offer: form.offer.replace(/,/g, ""),
          }),
        },
      );

      const data = await res.json();

      // =========================
      // SUCCESS
      // =========================

      if (data.success) {
        setSuccess(true);

        setTimeout(() => {
          // Reset form
          setForm({
            name: "",
            phone: "",
            offer: "",
          });

          // Reset OTP
          setOtp("");
          setOtpSent(false);

          // Reset messages
          setOtpMessage("");
          setOtpMessageType("");

          // Reset success
          setSuccess(false);
        }, 3000);
      } else {
        setOtpMessage(data.message || "ارسال پیشنهاد ناموفق بود.");

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

  return (
    <div
      id="offers"
      className="relative min-h-screen flex flex-col justify-center items-center pt-5 lg:pt-20 pb-10"
    >
      <img
        src={bg}
        className="absolute inset-0 object-cover -z-1 w-full h-full"
        alt=""
      />

      <div className="app-container w-full z-10 flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* =========================
              DOMAIN INFO
          ========================= */}

          <div
            className="col-span-2 flex flex-col gap-6 items-center lg:items-start"
            style={{ "--from": "translateX(40px)" }}
          >
            <div className="bg-[var(--color-danger)] w-fit text-white py-2 px-4 rounded-xl">
              <h2>این دامنه برای فروش است!</h2>
            </div>

            <h1 className="text-[40px] lg:text-[60px] text-[var(--color-text)]">
              {domainData?.domain}
            </h1>

            <div className="flex flex-col md:flex-row gap-3 items-center">
              <h3 className="text-[var(--color-text)]">ارزش تقریبی:</h3>

              <div className="flex gap-2 bg-[var(--color-success)] text-[var(--color-text)] p-2 rounded-xl">
                <h3>{Number(domainData?.price).toLocaleString("en-US")}</h3>

                <h3>تومان</h3>
              </div>
            </div>

            <div className="text-[var(--color-text)] text-lg text-justify">
              {domainData?.description}
            </div>

            <div className="flex flex-col lg:flex-row gap-5 lg:gap-15">
              <div>
                <a
                  href={`tel:${domainData?.phone}`}
                  className="flex gap-3 items-center justify-center hover:text-[var(--color-text)]/70"
                >
                  <FaPhone size={24} />

                  <div className="text-lg">
                    {domainData?.phone || "021-12345678"}
                  </div>
                </a>
              </div>

              <div>
                <a
                  href={`mailto:${domainData?.email}`}
                  className="flex gap-3 items-center justify-center hover:text-[var(--color-text)]/70"
                >
                  <FaEnvelope size={24} />

                  <div className="text-lg">
                    {domainData?.email || "info@example.com"}
                  </div>
                </a>
              </div>

              <div>
                <Link
                  to={"/domains"}
                  className="flex gap-3 items-center justify-center hover:text-[var(--color-text)]/70"
                >
                  <FaGlobe size={24} />

                  <div className="text-lg">مشاهده همه دامنه ها</div>
                </Link>
              </div>
            </div>

            <div className="flex flex-col gap-5 bg-gray-500/20 p-4 rounded-xl w-fit">
              <div className="text-lg text-justify">
                دامنه خود را رایگان ثبت کنید تا در بازار فروش دامنه سایت در
                دسترس هزاران خریدار قرار گیرد.
              </div>

              <Link
                to={"/partnership"}
                className="bg-[var(--color-accent)] w-fit py-2 px-3 rounded-xl text-lg hover:opacity-90 transition-all mx-auto lg:mx-0"
              >
                آگهی فروش دامنه
              </Link>
            </div>
          </div>

          {/* =========================
              OFFER FORM
          ========================= */}

          <div
            className="bg-[var(--color-soft)] rounded-xl p-7 mt-10 lg:mt-0"
            style={{ "--from": "translateX(-40px)" }}
          >
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <h2 className="text-[var(--color-smooth)]">ثبت پیشنهاد خرید</h2>

              <div className="text-[var(--color-muted)] text-lg">
                لطفاً فرم زیر را تکمیل کنید تا پیشنهاد شما برای فروشنده ارسال
                شود.
              </div>

              {/* =========================
                  NAME
              ========================= */}

              <div className="md:col-span-1">
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  type="text"
                  placeholder="نام و نام خانوادگی خود را وارد نمایید"
                  className="w-full rounded-xl text-[var(--color-smooth)] border-2 border-gray-300 px-4 py-3 outline-none focus:border-[var(--color-accent)] placeholder:text-gray-400"
                />
              </div>

              {/* =========================
                  OFFER
              ========================= */}

              <div className="md:col-span-1">
                <div className="relative">
                  <input
                    name="offer"
                    value={form.offer}
                    onChange={handleChange}
                    type="text"
                    inputMode="numeric"
                    placeholder="پیشنهاد خود را وارد نمایید"
                    className="w-full rounded-xl border-2 border-gray-300 px-4 pl-20 py-3 text-[var(--color-smooth)] outline-none focus:border-[var(--color-accent)] placeholder:text-gray-400"
                  />

                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
                    تومان
                  </span>
                </div>
              </div>

              {/* =========================
                  PHONE
              ========================= */}

              <div className="md:col-span-1 flex flex-col gap-2">
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    type="tel"
                    inputMode="numeric"
                    placeholder="شماره موبایل را وارد کنید"
                    className="w-full rounded-xl text-[var(--color-smooth)] border-2 border-gray-300 px-4 py-3 outline-none focus:border-[var(--color-accent)] placeholder:text-gray-400"
                  />

                  <button
                    type="button"
                    onClick={handleSendOtp}
                    disabled={otpLoading}
                    className="bg-[var(--color-accent)] text-white px-5 py-3 rounded-xl whitespace-nowrap hover:opacity-90 transition-all disabled:opacity-50"
                  >
                    {otpLoading ? "در حال ارسال..." : "ارسال کد تایید"}
                  </button>
                </div>

                {/* =========================
                    OTP
                ========================= */}

                {otpSent && (
                  <div className="flex flex-col gap-2 mt-1">
                    <input
                      type="text"
                      inputMode="numeric"
                      maxLength={4}
                      value={otp}
                      onChange={(e) =>
                        setOtp(e.target.value.replace(/\D/g, ""))
                      }
                      placeholder="کد تایید را وارد کنید"
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
                )}
              </div>

              {/* =========================
                  SUBMIT
              ========================= */}

              <div className="md:col-span-2">
                <button
                  type="submit"
                  disabled={
                    loading ||
                    !form.name.trim() ||
                    !form.offer.trim() ||
                    !form.phone.trim() ||
                    !otp
                  }
                  className="bg-[var(--color-accent)] w-full cursor-pointer hover:opacity-90 transition-all text-white px-8 py-2 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "در حال ارسال..." : "ارسال پیشنهاد"}
                </button>
              </div>

              {/* =========================
                  SUCCESS
              ========================= */}

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
  );
};

export default Offers;
