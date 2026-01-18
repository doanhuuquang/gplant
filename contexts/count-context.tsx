// "use client";

// import useCount from "@/hooks/use-count";
// import { createContext, useContext } from "react";

// interface CountContextProps {
//   count: number;
//   setCount: (count: number) => void;
// }

// const CountContext = createContext<CountContextProps | null>(null);

// function useCountContext() {
//   const context = useContext(CountContext);
//   if (!context) {
//     throw new Error("useCountContext must be used within a <CountProvider />");
//   }
//   return context;
// }

// function CountProvider({ children }: { children: React.ReactNode }) {
//   const { count, setCount } = useCount();

//   return (
//     <CountContext.Provider
//       value={{
//         count,
//         setCount,
//       }}
//     >
//       {children}
//     </CountContext.Provider>
//   );
// }

// export { useCountContext, CountProvider };
