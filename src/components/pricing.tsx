

export function makePrice (price: number) {
    return Math.round((price / 100))
}

export function makeStripePrice (price: number) {
    return Math.round((price / 100)) * 100
}

export function makeShippingCost (price: number) {
    return (price / 100)
}

export function makeStripeShippingCost (price: number) {
    return (price / 100) * 100
}