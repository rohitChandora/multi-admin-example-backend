export const getID = (function () {
  let id = 0;
  return () => {
    return id++;
  };
})();
