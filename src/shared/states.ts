import { createSharedState } from "react-hooks-toolkit";

export const keywordState = createSharedState('')
export const variantState = createSharedState<string>()
export const iconSetState = createSharedState<string>()