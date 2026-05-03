/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useLayoutEffect, useState, useTransition } from "react";
import { ButtonProps } from "../ui/button";
import LoadingButton from "../ui/loading-button";
import { subscribeUser, unsubscribeUser } from "./action";
import { urlBase64ToUint8Array } from "./helper";
interface Props extends ButtonProps {
  setSubscribed: (isSubscribed: boolean) => void;
}
export default function ButtonSubscribeUnsubscribeWebPush({
  setSubscribed,
  ...props
}: Props) {
  const [isSupported, setIsSupported] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [subscription, setSubscription] = useState<PushSubscription | null>(
    null,
  );

  useLayoutEffect(() => {
    async function registerServiceWorker() {
      const registration = await navigator.serviceWorker.register("/sw.js", {
        scope: "/",
        updateViaCache: "none",
        type: "classic",
      });
      const sub = await registration.pushManager.getSubscription();
      setSubscription(sub);
      setSubscribed(!!sub);
    }
    if ("serviceWorker" in navigator && "PushManager" in window) {
      setIsSupported(true);
      registerServiceWorker();
    }
  }, [setSubscribed]);

  async function subscribeToPush() {
    const registration = await navigator.serviceWorker.ready;
    const sub = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(
        process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
      ),
    });
    setSubscription(sub);
    const serializedSub = JSON.parse(JSON.stringify(sub));
    await subscribeUser(serializedSub);
    setSubscribed(true);
  }

  async function unsubscribeFromPush() {
    await subscription?.unsubscribe();
    setSubscription(null);
    await unsubscribeUser(subscription?.endpoint || "");
    setSubscribed(false);
  }

  if (!isSupported) {
    return <p className="text-destructive">Web Push Not supported</p>;
  }
  function handleButtonClick() {
    startTransition(() => {
      if (subscription) {
        unsubscribeFromPush();
      } else {
        subscribeToPush();
      }
    });
  }
  return (
    <LoadingButton
      loading={isPending}
      title={
        subscription
          ? `Unsubscribe Push Notification`
          : "Subscribe to Push Notification"
      }
      onClick={handleButtonClick}
      {...props}
    />
  );
}
