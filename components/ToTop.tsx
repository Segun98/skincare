import React, { useState, useEffect } from "react";
import { Icon } from "@chakra-ui/core";

export const ToTop = () => {
  const [showToTop, setshowToTop] = useState(false);
  useEffect(() => {
    if (typeof window === "object") {
      window.addEventListener("scroll", getScroll);
    }
  }, []);

  function getScroll() {
    if (window.scrollY > 400) {
      setshowToTop(true);
    } else {
      setshowToTop(false);
    }
  }

  return (
    <div>
      <section
        className="to-top"
        style={{
          position: "fixed",
          bottom: 20,
          right: 10,
          color: "var(--primary)",
          zIndex: 9999,
        }}
      >
        {showToTop && (
          <button
            aria-label="scroll to top"
            onClick={() => window.scrollTo(0, 0)}
          >
            <Icon name="arrow-up" />
          </button>
        )}
      </section>

      <style jsx>{`
        .to-top {
          font-size: 2rem;
          background: white;
          border-radius: 5px;
        }
        .to-top button {
          border: 0.5px solid var(--primary);
          border-radius: 5px;
        }
      `}</style>
    </div>
  );
};
