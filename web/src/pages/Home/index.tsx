import React from "react";
import "./styles.css";
import { FiLogIn } from "react-icons/fi";

import Logo from "../../assets/logo.svg";

const Home: React.FC = () => {
  return (
    <div id="page-home">
      <div className="content">
        <header>
          <img src={Logo} alt="Ecoleta" />
        </header>
        <main>
          <h1>Seu marketplace de coleeta de resíduos.</h1>
          <p>
            Ajudamos pessoas a encontrarem pontos de coleta de forma efficiente.
          </p>

          <a href="/cadastro">
            <span>
              <FiLogIn />
            </span>
            <strong>Cadastre um ponto de coleta</strong>
          </a>
        </main>
      </div>
    </div>
  );
};

export default Home;
