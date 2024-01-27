import React from 'react';
import Typed from 'typed.js';
import './index.scss';

const AboutMe = () => {
  const el = React.useRef(null);
  const poetryArr = [
    '他喜欢喝酒^800',
    '喜欢抽烟^800',
    '也不是那么喜欢',
    '好像就在那么一瞬间',
    '是那个穿着工装裤^200 白衬衫^200 三七分的年轻人',
    '老旧的相片里',
  ]

  React.useEffect(() => {
    const typed = new Typed(el.current, {
      strings: [poetryArr.join('\n')],
      typeSpeed: 80,
    });

    return () => {
      typed.destroy();
    };
  }, []);

  return (
    <div className="about-me">
      <img src="/not-my-time-to-die.jpg" alt=""/>
      <div className="about-me-content">
        <div className='about-me-poetry' ref={el} />
      </div>
    </div>
  );
}

export default AboutMe
