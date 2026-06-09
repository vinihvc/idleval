import React from "react";

export const LiveAnnouncer = (props: { message: string }) => {
  const { message } = props;

  return (
    <span aria-live="polite" className="sr-only" role="status">
      {message}
    </span>
  );
};

export const useLiveAnnouncer = () => {
  const [message, setMessage] = React.useState("");

  const announce = React.useCallback((text: string) => {
    setMessage("");
    requestAnimationFrame(() => {
      setMessage(text);
    });
  }, []);

  return { announce, message };
};
