

export function makePrice (price: number) {
    return Math.round((price / 100) * 1.2)
}

export function makeStripePrice (price: number) {
    return Math.round((price) * 1.2)
}