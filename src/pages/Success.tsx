import {useEffect} from "react";
import {useNavigate, useSearchParams} from "react-router-dom";
import {USER_ID} from "./Const";

export function SuccessPage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    useEffect(() => {
        const requestData = {
            userId: USER_ID,
            orderId: searchParams.get("orderId"),
            amount: searchParams.get("amount"),
            paymentKey: searchParams.get("paymentKey"),
        };

        /**
         * 토스페이먼츠 API는 시크릿 키를 사용자 ID로 사용하고, 비밀번호는 사용하지 않습니다.
         * 비밀번호가 없다는 것을 알리기 위해 시크릿 키 뒤에 콜론을 추가합니다.
         * @see https://docs.tosspayments.com/reference/using-api/authorization#%EC%9D%B8%EC%A6%9D
         */

        async function confirm() {
            const response = await fetch("http://localhost:8080/api/v1/orders/confirm", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(requestData),
            })

            const json = await response.json();

            if (!response.ok) {
                console.log(json);
                navigate(`/fail?message=${json.message}`)
                return;
            }

            console.log(json);
        }

        confirm();
    }, []);

    return (
        <div>
            <h1>결제 성공</h1>
            <div>{`주문 아이디: ${searchParams.get("orderId")}`}</div>
            <div>{`결제 금액: ${Number(
                searchParams.get("amount")
            ).toLocaleString()}원`}</div>
        </div>
    );
}
