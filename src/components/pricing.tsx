

export function makePrice (price: number) {
    return Math.round((price / 100))
}

export function makeStripePrice (price: number) {
    return Math.round((price / 100)) * 100
}