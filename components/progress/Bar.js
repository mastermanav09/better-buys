export const Bar = ({ animationDuration, progress }) => {
  return (
    <div
      className="bg-white h-[0.2rem] w-full left-0 top-0 fixed z-50 rounded-sm"
      style={{
        marginLeft: `${(-1 + progress) * 100}%`,
        transition: `marginLeft ${animationDuration}ms linear`,
      }}
    ></div>
  );
};
