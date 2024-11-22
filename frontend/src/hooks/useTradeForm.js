import { useState } from "react";
import { toast } from "react-toastify";
import { placeBuyOrder, placeSellOrder } from "../service/api";
import coinMapping from "../constants/coinMapping";
import useAccounts from "../hooks/useAccounts";

const useTradeForm = () => {
  const [coinNameInput, setCoinNameInput] = useState("");
  const [amount, setAmount] = useState("");
  const [price, setPrice] = useState("");
  const [type, setType] = useState("buy");
  const [isKrwInput, setIsKrwInput] = useState(true);
  const { accounts } = useAccounts();

  const fetchCurrentPrice = async (marketName) => {
    try {
      const response = await fetch(
        `https://api.upbit.com/v1/ticker?markets=${marketName}`
      );
      const data = await response.json();
      return data[0].trade_price;
    } catch (error) {
      console.error(error);
      throw new Error("현재가를 가져오는 데 실패했습니다.");
    }
  };

  const speak = (message) => {
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(message);
    utterance.lang = "ko-KR";
    utterance.rate = 2;
    synth.speak(utterance);
  };

  const notify = (message, type = "info") => {
    if (type === "success") {
      toast.success(message, { position: "top-right", autoClose: 3000 });
    } else if (type === "error") {
      toast.error(message, { position: "top-right", autoClose: 3000 });
    } else {
      toast.info(message, { position: "top-right", autoClose: 3000 });
    }
  };

  const handlePercentageClick = async (percentage) => {
    if (type === "buy") {
      const krwAccount = accounts.find((account) => account.currency === "KRW");
      if (!krwAccount) {
        const errorMessage = "원화 계좌 정보를 찾을 수 없습니다.";
        speak(errorMessage);
        notify(errorMessage, "error");
        return;
      }

      const krwBalance = parseFloat(krwAccount.balance || "0");

      if (isKrwInput) {
        const calculatedAmount = ((krwBalance * percentage) / 100).toFixed(2);
        setAmount(calculatedAmount);
      } else {
        const marketName = Object.keys(coinMapping).find(
          (key) => coinMapping[key] === coinNameInput
        );

        if (!marketName) {
          const errorMessage = "유효한 코인 이름을 입력해주세요.";
          speak(errorMessage);
          notify(errorMessage, "error");
          return;
        }

        try {
          const currentPrice = await fetchCurrentPrice(`KRW-${marketName}`);
          const calculatedVolume = (
            (krwBalance * percentage) /
            100 /
            currentPrice
          ).toFixed(6);
          setAmount(calculatedVolume);
        } catch (error) {
          console.error(error);
          const errorMessage = "코인 개수를 계산하는 데 실패했습니다.";
          speak(errorMessage);
          notify(errorMessage, "error");
        }
      }
    } else {
      const selectedAccount = accounts.find(
        (account) => account.currencyKorean === coinNameInput
      );

      if (!selectedAccount) {
        const errorMessage =
          "입력한 코인 이름에 해당하는 계좌를 찾을 수 없습니다.";
        speak(errorMessage);
        notify(errorMessage, "error");
        return;
      }

      const evaluationValue = parseFloat(selectedAccount.evaluation || "0");
      const calculatedAmount = ((evaluationValue * percentage) / 100).toFixed(
        2
      );
      setAmount(calculatedAmount);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!coinNameInput || !amount) {
      const errorMessage = "모든 값을 입력해주세요.";
      speak(errorMessage);
      notify(errorMessage, "error");
      return;
    }

    const marketName = Object.keys(coinMapping).find(
      (key) => coinMapping[key] === coinNameInput
    );

    if (!marketName) {
      const errorMessage = "유효한 코인 이름을 입력해주세요.";
      speak(errorMessage);
      notify(errorMessage, "error");
      return;
    }

    try {
      const currentPrice = await fetchCurrentPrice(`KRW-${marketName}`);
      let volume;

      if (isKrwInput) {
        volume = parseFloat(amount) / currentPrice;
      } else {
        volume = parseFloat(amount);
      }

      if (type === "buy") {
        if (price) {
          await placeBuyOrder(`KRW-${marketName}`, volume, parseFloat(price));
          notify(
            `매수 주문: ${coinNameInput} (${price}원에 ${volume.toFixed(
              6
            )} 개 매수)`,
            "success"
          );
        } else {
          await placeBuyOrder(`KRW-${marketName}`, volume);
          notify(
            `매수 주문: ${coinNameInput} (${currentPrice.toFixed(
              2
            )}원에 ${volume.toFixed(6)} 개 매수)`,
            "success"
          );
        }
      } else {
        if (price) {
          await placeSellOrder(`KRW-${marketName}`, volume, parseFloat(price));
          notify(
            `매도 주문: ${coinNameInput} (${price}원에 ${volume.toFixed(
              6
            )} 개 매도)`,
            "success"
          );
        } else {
          await placeSellOrder(`KRW-${marketName}`, volume);
          notify(
            `매도 주문: ${coinNameInput} (${currentPrice.toFixed(
              2
            )}원에 ${volume.toFixed(6)} 개 매도)`,
            "success"
          );
        }
      }

      setCoinNameInput("");
      setAmount("");
      setPrice("");
    } catch (error) {
      const errorMessage = "주문 실패";
      speak(errorMessage);
      notify(errorMessage, "error");
      console.error(error);
    }
  };

  return {
    coinNameInput,
    setCoinNameInput,
    amount,
    setAmount,
    price,
    setPrice,
    type,
    setType,
    isKrwInput,
    setIsKrwInput,
    handlePercentageClick,
    handleSubmit,
  };
};

export default useTradeForm;
