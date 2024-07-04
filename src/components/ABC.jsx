import React, { useState } from 'react';

const A = ({ count }) => {
  return <h1>Count: {count}</h1>;
};

const B = () => {
  return <div>B Component</div>;
};

const C = ({ increment, decrement, reset }) => {
  return (
    <div>
      <button onClick={increment}>Increment</button>
      <button onClick={decrement}>Decrement</button>
      <button onClick={reset}>Reset</button>
    </div>
  );
};

const ABC = () => {
  const [count, setCount] = useState(0);

  const increment = () => setCount(count + 1);
  const decrement = () => setCount(count - 1);
  const reset = () => setCount(0);

  return (
    <div>
      <A count={count} />
      <B />
      <C increment={increment} decrement={decrement} reset={reset} />
    </div>
  );
};

export default ABC;