import React, { useState, useEffect, ChangeEvent } from "react";
import { Link } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";

import { LeafletMouseEvent } from "leaflet";
import { Map, TileLayer, Marker } from "react-leaflet";

import axios from "axios";
import api from "../../services/api";

import "./styles.css";

import Logo from "../../assets/logo.svg";

interface Item {
  id: number;
  title: string;
  image_url: string;
}

interface IBGEUFResponse {
  sigla: string;
}

interface IBGECityResponse {
  nome: string;
}

const CreatePoint: React.FC = () => {
  const [listItems, setListItems] = useState<Item[]>([]);

  const [ufs, setUfs] = useState<string[]>([]);
  const [selectedUf, setSelectedUf] = useState("0");
  const [cities, setCities] = useState<string[]>([]);
  const [selectedCities, setSelectedCities] = useState("0");

  const [selectedPosition, setSelectedPosition] = useState<[number, number]>([
    0,
    0,
  ]);

  useEffect(() => {
    api
      .get("/items")
      .then((res) => setListItems(res.data))
      .catch((error) => console.log(error));
  }, []);

  useEffect(() => {
    axios
      .get<IBGEUFResponse[]>(
        "https://servicodados.ibge.gov.br/api/v1/localidades/estados"
      )
      .then((res) => {
        const ufInitial = res.data.map((uf) => uf.sigla);
        setUfs(ufInitial);
      })
      .catch((error) => console.log(error));
  }, []);

  useEffect(() => {
    if (selectedUf === "0") return;
    axios
      .get<IBGECityResponse[]>(
        `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`
      )
      .then((res) => {
        const cityName = res.data.map((city) => city.nome);
        setCities(cityName);
      })
      .catch((error) => console.log(error));
  }, [selectedUf]);

  function handleSelectUf(event: ChangeEvent<HTMLSelectElement>) {
    const uf = event.target.value;
    setSelectedUf(uf);
  }

  function handleSelectCity(event: ChangeEvent<HTMLSelectElement>) {
    const city = event.target.value;
    setSelectedCities(city);
  }

  function handleMapClick(event: LeafletMouseEvent) {
    setSelectedPosition([event.latlng.lat, event.latlng.lng]);
  }

  return (
    <div id="page-create-point">
      <header>
        <img src={Logo} alt="ecoleta" />
        <Link to="/">
          <FiArrowLeft /> Voltar para a Home
        </Link>
      </header>

      <form action="">
        <h1>
          Cadastro o <br /> ponto de coleta
        </h1>

        <fieldset>
          <legend>
            <h2>Dados</h2>
          </legend>
          <div className="field">
            <label htmlFor="name">Nome da entidade</label>
            <input type="text" name="name" id="name" />
          </div>
          <div className="field-group">
            <div className="field">
              <label htmlFor="email">e-mail</label>
              <input type="email" name="email" id="email" />
            </div>
            <div className="field">
              <label htmlFor="whatsapp">Whatsapp</label>
              <input type="text" name="whatsapp" id="whatsapp" />
            </div>
          </div>
        </fieldset>

        <fieldset>
          <legend>
            <h2>Endereço</h2>
            <span>Selecione o endereço no mapa</span>
          </legend>

          <Map
            center={[-3.8223538, -38.4674014]}
            zoom={15}
            onClick={handleMapClick}
          >
            <TileLayer
              attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {selectedPosition && <Marker position={selectedPosition}></Marker>}
          </Map>

          <div className="field-group">
            <div className="field">
              <label htmlFor="uf">Esatado (UF)</label>
              <select
                name="uf"
                id="uf"
                value={selectedUf}
                onChange={handleSelectUf}
              >
                <option value="0">Selecione uma UF</option>
                {ufs &&
                  ufs.sort().map((uf) => (
                    <option key={uf} value={uf}>
                      {uf}
                    </option>
                  ))}
              </select>
            </div>
            <div className="field">
              <label htmlFor="city">Cidade</label>
              <select
                name="city"
                id="city"
                onChange={handleSelectCity}
                value={selectedCities}
              >
                <option value="0">Selecione uma cidade</option>
                {cities &&
                  cities.sort().map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
              </select>
            </div>
          </div>
        </fieldset>

        <fieldset>
          <legend>
            <h2>Ítens de coleta</h2>
            <span>Selecione um ou mais ítens abaixo</span>
          </legend>
          <ul className="items-grid">
            {listItems &&
              listItems.map((item) => (
                <li key={item.id}>
                  <img src={item.image_url} alt="bateria" />
                  <span>{item.title}</span>
                </li>
              ))}
          </ul>
        </fieldset>

        <button type="submit">Cadastrar ponto de coleta</button>
      </form>
    </div>
  );
};

export default CreatePoint;
