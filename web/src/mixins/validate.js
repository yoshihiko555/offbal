export const validateSpace = val => {
    return true
}

export const validateSymbol = val => {
    return true
}

export const validateLength = val => {
    return true
}

export const globalValidateMixins = {
    methods: {
        validateSpace,
        validateSymbol,
        validateLength,
    }
}
