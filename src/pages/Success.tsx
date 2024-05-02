import {useEffect, useState} from "react";
import {Link, useNavigate, useSearchParams} from "react-router-dom";

export function SuccessPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [responseData, setResponseData] = useState(null);

  useEffect(() => {
    const requestData = {
      userId: 1,
      orderId: searchParams.get("orderId"),
      amount: searchParams.get("amount"),
      paymentKey: searchParams.get("paymentKey"),
    };

    async function confirm() {
      const response = await fetch("http://localhost:8080/api/v1/orders/confirm", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      const json = await response.json();

      if (!response.ok) {
        console.log(JSON.stringify(json, null, 4));
        navigate(`/fail?code=${json.code}&message=${json.message}`);
        return;
      }

      // TODO: 구매 완료 비즈니스 로직 구현
      // console.log(json);
      return json;
    }

    confirm().then((data) => {
      setResponseData(data);
    });
  }, [searchParams]);

  return (
      <div className="wrapper">
        <div className="box_section" style={{width: "600px"}}>
          <img width="100px" src="https://static.toss.im/illusts/check-blue-spot-ending-frame.png"/>
          <h2>결제를 완료했어요</h2>
          <div className="p-grid typography--p" style={{marginTop: "50px"}}>
            <div className="p-grid-col text--left">
              <b>결제금액</b>
            </div>
            <div className="p-grid-col text--right" id="amount">
              {`${Number(searchParams.get("amount")).toLocaleString()}원`}
            </div>
          </div>
          <div className="p-grid typography--p" style={{marginTop: "10px"}}>
            <div className="p-grid-col text--left">
              <b>주문번호</b>
            </div>
            <div className="p-grid-col text--right" id="orderId">
              {`${searchParams.get("orderId")}`}
            </div>
          </div>
          <div className="p-grid typography--p" style={{marginTop: "10px"}}>
            <div className="p-grid-col text--left">
              <b>paymentKey</b>
            </div>
            <div className="p-grid-col text--right" id="paymentKey"
                 style={{whiteSpace: "initial", width: "250px"}}>
              {`${searchParams.get("paymentKey")}`}
            </div>
          </div>
          <div className="p-grid-col">
            <Link to="https://docs.tosspayments.com/guides/payment/integration">
              <button className="button p-grid-col5">연동 문서</button>
            </Link>
            <Link to="https://discord.gg/A4fRFXQhRu">
              <button className="button p-grid-col5"
                      style={{backgroundColor: "#e8f3ff", color: "#1b64da"}}>
                실시간 문의
              </button>
            </Link>
          </div>
        </div>
        <div className="box_section" style={{width: "600px", textAlign: "left"}}>
          <b>Response Data :</b>
          <div id="response" style={{whiteSpace: "initial"}}>
            {responseData && <pre>{JSON.stringify(responseData, null, 4)}</pre>}
          </div>
        </div>
      </div>
  );
}
