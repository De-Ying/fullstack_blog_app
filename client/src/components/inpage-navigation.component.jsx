import PropTypes from "prop-types";
import { useEffect, useRef, useState } from "react";

const InPageNavigation = ({
  routes,
  defaultHidden = [],
  defaultActiveIndex = 0,
  children,
}) => {
  const activeTabLine = useRef(null);
  const activeTab = useRef(null);

  const [inPageNavIndex, setInPageNavIndex] = useState(defaultActiveIndex);

  const changePageState = (btn, i) => {
    let { offsetWidth, offsetLeft } = btn;
    activeTabLine.current.style.width = offsetWidth + "px";
    activeTabLine.current.style.left = offsetLeft + "px";
    setInPageNavIndex(i);
  };

  useEffect(() => {
    if (activeTab.current) {
      changePageState(activeTab.current, defaultActiveIndex);
    }
  }, [defaultActiveIndex]);

  return (
    <>
      <div className="relative mb-8 bg-white border-b border-grey flex flex-nowrap overflow-x-auto">
        {routes.map((route, i) => (
          <button
            ref={i === defaultActiveIndex ? activeTab : null}
            key={i}
            className={`p-4 px-5 capitalize ${
              inPageNavIndex === i ? "text-black" : "text-dark-grey"
            } ${defaultHidden.includes(route) && "md:hidden"}`}
            onClick={(e) => changePageState(e.target, i)}
          >
            {route}
          </button>
        ))}

        <hr ref={activeTabLine} className="absolute bottom-0 duration-300" />
      </div>

      {Array.isArray(children) ? children[inPageNavIndex] : children}
    </>
  );
};

InPageNavigation.propTypes = {
  routes: PropTypes.array.isRequired,
  defaultHidden: PropTypes.array,
  defaultActiveIndex: PropTypes.number,
  children: PropTypes.node
};

export default InPageNavigation;
