import React, { useState, useEffect } from 'react';
import './App.css';

const App = () => {
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [result, setResult] = useState(null);
  const [btcRateBRL, setBtcRateBRL] = useState(null);
  const [btcRates, setBtcRates] = useState(null);
  const [error, setError] = useState(null);
  const [date, setDate] = useState(null);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    // Fetch Bitcoin rate in BRL from CoinDesk API
    fetch('https://api.coindesk.com/v1/bpi/currentprice/BRL.json')
      .then(response => response.json())
      .then(data => {
        setBtcRateBRL(data.bpi.BRL.rate_float);
      })
      .catch(error => {
        setError('Failed to fetch Bitcoin rate for BRL.');
      });

    // Fetch Bitcoin rates in USD, EUR, and GBP from CoinDesk API
    fetch('https://api.coindesk.com/v1/bpi/currentprice.json')
      .then(response => response.json())
      .then(data => {
        setBtcRates(data.bpi);
        setDate(data.time.updated);
      })
      .catch(error => {
        setError('Failed to fetch Bitcoin rates for other currencies.');
      });
  }, []);

  const handleConvert = () => {
    if (!btcRateBRL || !btcRates || !amount) return;
    const amountInBtc = amount / btcRateBRL;
    const conversionRate = btcRates[currency].rate_float;
    const convertedAmount = (amountInBtc * conversionRate).toFixed(2);
    setResult(convertedAmount);
    const transaction = {
      date: new Date().toLocaleString(),
      amount: amount,
      currency: currency,
      result: convertedAmount,
    };
    setHistory([...history, transaction]);
  };

  return (
    <div className="app-container">
      <h1>Desafio XP</h1>
      <div className="converter-container">
        <h2>Financeiro</h2>
        <div className="input-group">
          <label>BRL</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="R$ 100,00"
          />
        </div>
        <div className="input-group">
          <label>Converter para:</label>
          <select value={currency} onChange={(e) => setCurrency(e.target.value)}>
            <option value="USD">USD/U.S. Dolar</option>
            <option value="EUR">EUR/Euro</option>
            <option value="GBP">GBP/Libra Esterlina</option>
          </select>
        </div>
        <button onClick={handleConvert}>Converter</button>
        {result && (
          <div className="result">
            <p>{currency}</p>
            <p>$ {result}</p>
          </div>
        )}
        {error && <p className="error">{error}</p>}
        {date && <p className="date">Data da cotação: {date}</p>}
      </div>
      <div className="history-container">
        <h2>Histórico de Transações</h2>
        <ul>
          {history.map((transaction, index) => (
            <li key={index}>
              <p>Data: {transaction.date}</p>
              <p>Valor: R$ {transaction.amount}</p>
              <p>Convertido para: {transaction.currency}</p>
              <p>Resultado: $ {transaction.result}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default App;
