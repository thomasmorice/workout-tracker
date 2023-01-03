import { useState, useEffect } from "react";

export const usePromptNewVersion = () => {
  const [hasNewVersion, set_hasNewVersion] = useState(null);

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      "serviceWorker" in navigator &&
      window.workbox !== undefined
    ) {
      const wb = window.workbox;
      // add event listeners to handle any of PWA lifecycle event
      // https://developers.google.com/web/tools/workbox/reference-docs/latest/module-workbox-window.Workbox#events
      wb.addEventListener("installed", (event) => {
        console.log(`Event ${event.type} is triggered.`);
        console.log(event);
      });

      wb.addEventListener("controlling", (event) => {
        console.log(`Event ${event.type} is triggered.`);
        console.log(event);
      });

      wb.addEventListener("activated", (event) => {
        console.log(`Event ${event.type} is triggered.`);
        console.log(event);
      });

      // A common UX pattern for progressive web apps is to show a banner when a service worker has updated and waiting to install.
      // NOTE: MUST set skipWaiting to false in next.config.js pwa object
      // https://developers.google.com/web/tools/workbox/guides/advanced-recipes#offer_a_page_reload_for_users
      const promptNewVersionAvailable = (event) => {
        // `event.wasWaitingBeforeRegister` will be false if this is the first time the updated service worker is waiting.
        // When `event.wasWaitingBeforeRegister` is true, a previously updated service worker is still waiting.
        // You may want to customize the UI prompt accordingly.
        if (
          confirm(
            "A newer version of this web app is available, reload to update?"
          )
        ) {
          wb.addEventListener("controlling", (event) => {
            window.location.reload();
          });

          // Send a message to the waiting service worker, instructing it to activate.
          wb.messageSkipWaiting();
        } else {
          console.log(
            "User rejected to reload the web app, keep using old version. New version will be automatically load when user open the app next time."
          );
        }
      };
      wb.addEventListener("waiting", promptNewVersionAvailable);
    }
  }, []);
};