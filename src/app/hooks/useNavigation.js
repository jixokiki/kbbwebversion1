"use client";

import { useState } from "react";

const useNavigation = () => {
  const [isLoading, setIsLoading] = useState(false);

  return { isLoading, setIsLoading };
};

export default useNavigation;
