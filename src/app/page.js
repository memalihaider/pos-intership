import { CustomerSignup } from "../components/customerSignup";
import "./styling/home.css";

export default function Home() {
  return (
    <>
      <div className="pos-container">
        <div className="pos-card">
          <CustomerSignup/>
        </div>
      </div>
    </>
  );
}
