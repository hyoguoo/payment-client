import {useEffect, useRef, useState} from "react";
import {loadPaymentWidget, PaymentWidgetInstance,} from "@tosspayments/payment-widget-sdk";

import "../App.css";
import {CUSTOMER_EMAIL, CUSTOMER_NAME, ORDER_NAME, PRICE, PRODUCT_ID, QUANTITY, USER_ID} from "./Const";

const selector = "#payment-widget";

// @docs https://docs.tosspayments.com/reference/using-api/api-keys
const clientKey = "test_ck_EP59LybZ8Bwd6KDgXvlJ36GYo7pR";
const customerKey = "YbX2HuSlsC9uVJW6NMRMj";

export function CheckoutPage() {
    const paymentWidgetRef = useRef<PaymentWidgetInstance | null>(null);
    const paymentMethodsWidgetRef = useRef<ReturnType<
        PaymentWidgetInstance["renderPaymentMethods"]
    > | null>(null);
    const [price, setPrice] = useState(50_000);

    useEffect(() => {
        (async () => {
            // ------  결제위젯 초기화 ------
            // 비회원 결제에는 customerKey 대신 ANONYMOUS를 사용하세요.
            const paymentWidget = await loadPaymentWidget(clientKey, customerKey); // 회원 결제
            // const paymentWidget = await loadPaymentWidget(clientKey, ANONYMOUS); // 비회원 결제

            // ------  결제위젯 렌더링 ------
            // https://docs.tosspayments.com/reference/widget-sdk#renderpaymentmethods선택자-결제-금액-옵션
            const paymentMethodsWidget = paymentWidget.renderPaymentMethods(
                selector,
                {value: price}
            );

            // ------  이용약관 렌더링 ------
            // https://docs.tosspayments.com/reference/widget-sdk#renderagreement선택자
            paymentWidget.renderAgreement("#agreement");

            paymentWidgetRef.current = paymentWidget;
            paymentMethodsWidgetRef.current = paymentMethodsWidget;
        })();
    }, []);

    return (
        <div>
            <h1>주문서</h1>
            <span>{`${price.toLocaleString()}원`}</span>
            <div id="payment-widget"/>
            <div id="agreement"/>
            <button
                onClick={async () => {
                    const paymentWidget = paymentWidgetRef.current;

                    const requestData = {
                        userId: USER_ID,
                        amount: PRICE,
                        orderProduct: {
                            productId: PRODUCT_ID,
                            quantity: QUANTITY,
                        },
                    }

                    const response = await fetch("http://localhost:8080/api/v1/orders/create", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(requestData),
                    })

                    const json = await response.json();

                    if (!response.ok) {
                        console.log(json);
                        return;
                    }
                    const orderId = json.orderId;

                    try {
                        // ------ '결제하기' 버튼 누르면 결제창 띄우기 ------
                        // https://docs.tosspayments.com/reference/widget-sdk#requestpayment결제-정보
                        await paymentWidget?.requestPayment({
                            orderId: orderId,
                            orderName: ORDER_NAME,
                            customerName: CUSTOMER_NAME,
                            customerEmail: CUSTOMER_EMAIL,
                            successUrl: `${window.location.origin}/success`,
                            failUrl: `${window.location.origin}/fail`,
                        });
                    } catch (error) {
                        // 에러 처리하기
                        console.error(error);
                    }
                }}
            >
                결제하기
            </button>
        </div>
    );
}
