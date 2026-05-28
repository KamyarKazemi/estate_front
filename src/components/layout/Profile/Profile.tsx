function Profile() {
  return (
    <div
      className="w-full flex flex-col flex-1 items-center justify-center"
      dir="rtl"
    >
      <form className="w-100 bg-header-primary text-[#ccc] p-2.5 rounded-lg h-100 flex flex-col items-center juustify-center gap-2.5">
        <h2>Profile</h2>
        <label htmlFor="phoneNumber">شماره تلفن</label>
        <input
          type="tel"
          id="phoneNumber"
          placeholder="شماره تلفن"
          className="text-right bg-[#ccc] text-slate-900"
        />
        <button className="bg-black p-2.5">Submit</button>
      </form>
    </div>
  );
}

export default Profile;
