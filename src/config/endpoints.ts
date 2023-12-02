const endpoints = (params?: string | number) => {
    const env = process.env.NODE_ENV
    const local = process.env.STEALTH_ENDPOINT_DEV
    const prod = process.env.STEALTH_ENDPOINT_PROD

    if (!local || !prod) throw new Error("Missing env variables")

    const baseUrl = env === "development" ? local : prod

    const user = {
        register: `${baseUrl}/register`,
        profile: `${baseUrl}/profile/info`,
        activate: `${baseUrl}/activate?key=${params}`
    }

    const auth = {
        login: `${baseUrl}/authenticate`,
        logout: `${baseUrl}/logout`,
        "change-password": `${baseUrl}/account/change-password`,
        "init-reset-password": `${baseUrl}/account/reset-password/init`,
        "finish-reset-password": `${baseUrl}/account/reset-password/finish`
    }

    const wallet = {
        "get-by-id": `${baseUrl}/wallets/${params}`,
        list: `${baseUrl}/wallets`,
        create: `${baseUrl}/wallets`,
        update: `${baseUrl}/wallets/${params}`,
        delete: `${baseUrl}/wallets/${params}`
    }

    const dca = {
        "get-by-id": `${baseUrl}/dca-plans/${params}`,
        list: `${baseUrl}/dca-plans`,
        create: `${baseUrl}/dca-plans`,
        update: `${baseUrl}/dca-plans/${params}`,
        delete: `${baseUrl}/dca-plans/${params}`
    }

    const price = {
        btc: `${baseUrl}/btc/price`
    }

    const payment = {
        "get-details": `${baseUrl}/payment/details`,
        "get-by-id": `${baseUrl}/payment/${params}`,
        list: `${baseUrl}/payment`,
        "get-status": `${baseUrl}/payment/paid`
    }

    return {
        user,
        auth,
        wallet,
        dca,
        price,
        payment
    }
}

export default endpoints
