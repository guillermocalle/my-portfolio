const Heading = ({ children }) => {
  return (
    <h2 className="capitalize text-base md:text-lg text-indigo-700 dark:text-zinc-400 font-bold mb-3">
      {children}
    </h2>
  );
};

export default Heading;
