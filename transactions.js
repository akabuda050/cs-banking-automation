import { Parser } from 'json2csv';
import config from './config.js';
import axios from 'axios';

/**
 *
 * @param {{
 *  authorizationBearer: string,
 *  webApiKey: string,
 * }} credentials
 *
 * @param {{
 *  from: string,
 *  to: string,
 * }}
 *
 * @returns {Promise<import('axios').AxiosResponse>}
 */
export const exportTransactions = async (credentials, { from, to }) => {
    const params = {
        lang: 'en',
        fields: [
            'ownerAccountTitle',
            'ownerAccountNumber',
            'booking',
            'receiver',
            'amount',
            'currency',
            'symbolConstant',
            'symbolSpecific',
            'symbolVariable',
            'bookingTypeTranslation',
            'senderReference',
            'senderAddress',
            'receiverReference',
            'receiverAddress',
            'note',
            'category',
            'referenceNumber',
            'cardNumber',
            'cardLocation',
            'investmentName',
            'e2eReference',
            'virtualCardNumber',
            'virtualCardDevice',
            'instructionName',
        ].join(','),
        from,
        to,
    };

    const baseUrl = config.cs_transactions_export_url;
    const url = `${baseUrl}?${new URLSearchParams(params).toString()}`;

    return axios.post(url, null, {
        headers: {
            Authorization: credentials.authorizationBearer,
            'Web-Api-Key': credentials.webApiKey,
        },
    });
};

export const normalizeAmount = (amount) => {
    if (!amount || typeof amount.value !== 'number' || typeof amount.precision !== 'number') {
        throw new Error('Invalid amount format');
    }

    return {
        value: amount.value / Math.pow(10, amount.precision),
        currency: amount.currency,
    };
};

export const mapTransactions = (transactions) => {
    return transactions
        .filter(({ amount }) => 0 !== amount.value)
        .map(
            ({
                booking,
                referenceNumber,
                ownerAccountNumber,
                ownerAccountTitle,
                partnerName,
                partnerAccount,
                bookingTypeTranslation,
                categories,
                amount,
            }) => {
                const normalizedAmount = normalizeAmount(amount);

                return {
                    date: new Date(booking).toLocaleString('en-US', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                    }),
                    referenceNumber,
                    description: bookingTypeTranslation,
                    accountName: ownerAccountTitle,
                    accountNumber: ownerAccountNumber,
                    partnerNumber:
                        partnerAccount?.number && partnerAccount?.bankCode
                            ? `${partnerAccount?.number}/${partnerAccount?.bankCode}`
                            : null,
                    partnerName: partnerName,
                    categories: categories.join(','),
                    type: amount.value > 0 ? 'income' : 'outcome',
                    amount: Math.abs(normalizedAmount.value),
                    currency: normalizedAmount.currency,
                };
            }
        );
};

export const convertToCsv = (transactions, options = { fields: [], delimiter: ';' }) => {
    const json2csvParser = new Parser(options);
    return json2csvParser.parse(transactions);
};
