import { useEffect } from "react";

const JivoChat = () => {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "//code.jivosite.com/widget/h8xstT7SpJ";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      // Cleanup if component unmounts
      const existingScript = document.querySelector('script[src*="jivosite.com"]');
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, []);

  return null;
};

export default JivoChat;
