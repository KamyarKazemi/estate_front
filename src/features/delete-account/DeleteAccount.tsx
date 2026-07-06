import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { OtpStep } from "../auth/components/OtpStep";
import { useOtp } from "../auth/hooks/useOtp";

import { confirmDeleteAccountThunk } from "../../store/thunks/confirmDeleteAccountThunk";

import type { RootState, AppDispatch } from "../../store";

function DeleteAccount() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { error, loading } = useSelector((state: RootState) => state.auth);

  const { otp, otpRefs, isComplete, handleChange, handleKeyDown, handlePaste } =
    useOtp(5);

  const handleSubmit = async () => {
    try {
      await dispatch(
        confirmDeleteAccountThunk({
          otp_code: otp.join(""),
        }),
      ).unwrap();

      navigate("/");
    } catch (error) {
      console.error("Error confirming account deletion:", error);
    }
  };

  return (
    <main
      dir="rtl"
      className="relative min-h-screen overflow-hidden bg-slate-950 flex items-center justify-center px-4"
    >
      <div className="relative z-10 w-full max-w-xl">
        <div
          className="
bg-slate-900/60
backdrop-blur-xl
border border-white/10
rounded-3xl
p-8
space-y-8
"
        >
          <div className="text-center">
            <h1 className="text-white text-2xl font-semibold">
              حذف حساب کاربری
            </h1>

            <p className="text-slate-400 text-sm">کد ارسال‌شده را وارد کنید</p>
          </div>

          <OtpStep
            otp={otp}
            otpRefs={otpRefs}
            isComplete={isComplete}
            loading={loading}
            handleChange={handleChange}
            handleKeyDown={handleKeyDown}
            handlePaste={handlePaste}
            onSubmit={handleSubmit}
          />

          {error && <p className="text-red-400 text-center">{error}</p>}
        </div>
      </div>
    </main>
  );
}

export default DeleteAccount;
