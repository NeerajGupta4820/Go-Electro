import { useState } from "react";
import "./Toss.css";

const CoinToss = () => {
  const [angle, setAngle] = useState(0);

  const flipCoin = () => {
    if (Math.random() > 0.5) setAngle((prev) => prev + 180);
    else setAngle((prev) => prev + 360);
  };

  return (
    <div className="coin-toss-container">
      <main className="coin-toss-app">
        <h1>Coin Toss</h1>
        <section>
          <article
            className="coin"
            onClick={flipCoin}
            style={{
              transform: `rotateY(${angle}deg)`,
            }}
          >
            <div className="coin-side heads"></div>
            <div className="coin-side tails"></div>
          </article>
        </section>
      </main>
    </div>
  );
};

export default CoinToss;
