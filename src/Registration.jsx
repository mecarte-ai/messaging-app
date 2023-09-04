import { useRef } from "react";

export default function Registration() {
  const formStyle = {
    display: "flex",
    flexDirection: "column",
    width: "50%",
    gap: "0.5rem",
  };

  const formRef = useRef("");

  function handleRegistration(e) {
    e.preventDefault();

    console.log(formRef);
  }

  return (
    <div>
      <h1>Registration</h1>
      <form
        action=""
        style={formStyle}
        onSubmit={handleRegistration}
        ref={formRef}
      >
        <label htmlFor="">Email</label>
        <input type="text" name="email" id="" />
        <label htmlFor="">Password</label>
        <input type="password" name="password" id="" />
        <label htmlFor="">Retype Password</label>
        <input type="password" name="confirmPassword" id="" />
        <button style={{ marginTop: "1rem" }}>Submit</button>
      </form>
    </div>
  );
}
